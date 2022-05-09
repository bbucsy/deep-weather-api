import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, MoreThan, Repository } from 'typeorm';
import { Prediction } from './prediction.entity';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { PredictionResponse } from './prediction-response.entity';
import { CreatePredictionResponseDto } from './dto/create-prediction-response.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  PredictionWithResponse,
  ResponseStatisticsDto,
} from './dto/response-list.dto';

@Injectable()
export class PredictionService {
  constructor(
    private connection: Connection,
    @InjectRepository(Prediction)
    private readonly predictionRepository: Repository<Prediction>,
    @InjectRepository(PredictionResponse)
    private readonly responseRepository: Repository<PredictionResponse>,
    @InjectQueue('predictor') private readonly predictorQueue: Queue,
  ) {}

  private logger = new Logger(PredictionService.name);

  async findAllPredictions(minTime = 0): Promise<Prediction[]> {
    return this.predictionRepository.find({
      where: { predictionTime: MoreThan(minTime) },
    });
  }

  async findAllPredictionsWithModelsAndCity(
    minTime = 0,
  ): Promise<Prediction[]> {
    return this.predictionRepository.find({
      relations: ['model', 'model.city'],
      where: { predictionTime: MoreThan(minTime) },
    });
  }

  async findOne(id: number): Promise<Prediction> {
    return this.predictionRepository.findOne(id);
  }

  async create(createDto: CreatePredictionDto): Promise<Prediction> {
    const prediction = this.predictionRepository.create({
      input: JSON.stringify(createDto.input),
      model: createDto.model,
      predictionTime: createDto.predictionTime.getTime(),
      result: createDto.result,
    });
    return this.predictionRepository.save(prediction);
  }

  async findAllResponsesWithModels(): Promise<PredictionResponse[]> {
    return this.responseRepository.find({
      relations: ['prediction', 'prediction.model'],
      order: { created_at: 'DESC' },
      take: 100,
    });
  }

  async getResponseStatistics(): Promise<ResponseStatisticsDto> {
    const all = await this.responseRepository.count();
    const query = this.connection
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(PredictionResponse, 'res')
      .innerJoin(Prediction, 'prediction', 'res.predictionId = prediction.id')
      .where('res.response = prediction.result');

    const good = await query.getRawOne<{ count: number }>();

    this.logger.debug(query.getSql());
    return {
      numGood: good.count,
      numResponses: all,
    };
  }

  async findByCity(city_id: number, minTime = 0): Promise<Prediction[]> {
    return this.predictionRepository.find({
      relations: ['model', 'model.city'],
      where: { model: { city: city_id }, predictionTime: MoreThan(minTime) },
    });
  }

  async findByModel(model_id: number): Promise<Prediction[]> {
    return this.predictionRepository.find({
      relations: ['model'],
      where: { model: { id: model_id } },
    });
  }

  async addResponseToPrediction(
    dto: CreatePredictionResponseDto,
  ): Promise<PredictionResponse> {
    const pred = await this.predictionRepository.findOne(dto.prediction_id);
    if (typeof pred === 'undefined')
      throw new NotFoundException(undefined, 'Prediction not found');
    const response = this.responseRepository.create({
      prediction: pred,
      response: dto.response,
    });
    return await this.responseRepository.save(response);
  }

  async getUserResponseWeather(prediction: Prediction): Promise<number> {
    const query = await this.responseRepository
      .createQueryBuilder('response')
      .select('response.response', 'label')
      .addSelect('count(*)', 'numRes')
      .where('response.predictionId = :id', { id: prediction.id })
      .groupBy('label')
      .orderBy('numRes', 'DESC')
      .limit(1);

    this.logger.debug(query.getSql());

    const result: { label: number; numRes: number } = await query.getRawOne();
    return result?.label || prediction.result;
  }

  async getPredictionsWithResponses(
    model_id: number,
    with_input = false,
    only_unused = false,
  ): Promise<PredictionWithResponse[]> {
    const query = this.connection
      .createQueryBuilder()
      .select('t_all.pid', 'prediction_id')
      .addSelect('t_all.response', 'user_response')
      .addSelect('p.result', 'prediction_result')
      .from((subQuery) => {
        return subQuery
          .select('sq2.pid', 'pid')
          .addSelect('max(sq2.count)', 'max')
          .from((subQuery2) => {
            return subQuery2
              .select('p.id', 'pid')
              .addSelect('pr.response', 'response')
              .addSelect('count(pr.response)', 'count')
              .from('prediction', 'p')
              .innerJoin('prediction_response', 'pr', 'p.id = pr.predictionId')
              .where('p.modelId = :modelId', { modelId: model_id })
              .groupBy('pid')
              .addGroupBy('response');
          }, 'sq2')
          .groupBy('sq2.pid');
      }, 't_max')
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('pr.predictionId', 'pid')
            .addSelect('pr.response', 'response')
            .addSelect('count(pr.response)', 'count')
            .from('prediction_response', 'pr')
            .groupBy('pid')
            .addGroupBy('response');
        },
        't_all',
        't_all.pid = t_max.pid and t_all.count = t_max.max',
      )
      .innerJoin('prediction', 'p', 'p.id = t_all.pid');

    if (with_input) query.addSelect('p.input', 'input');
    if (only_unused) query.where('p.used_in_trining = false');

    this.logger.debug(query.getSql());

    return await query.getRawMany();
  }

  async setUsedBulk(predictionIds: number[], usedState: boolean) {
    const query = this.predictionRepository
      .createQueryBuilder()
      .update(Prediction)
      .set({ usedInTraining: usedState })
      .where({ id: In(predictionIds) });

    await query.execute();
  }

  async startAutoRespondJob() {
    await this.predictorQueue.add('auto-respond');
  }
}
