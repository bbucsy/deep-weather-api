import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Prediction } from './prediction.entity';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { PredictionResponse } from './prediction-response.entity';
import { CreatePredictionResponseDto } from './dto/create-prediction-response.dto';

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(Prediction)
    private readonly predictionRepository: Repository<Prediction>,
    @InjectRepository(PredictionResponse)
    private readonly responseRepository: Repository<PredictionResponse>,
  ) {}

  private logger = new Logger(PredictionService.name);

  async findAllPredictions(minTime = 0): Promise<Prediction[]> {
    return this.predictionRepository.find({
      where: { predictionTime: MoreThan(minTime) },
    });
  }

  async findAllPredictionsWithModels(minTime = 0): Promise<Prediction[]> {
    return this.predictionRepository.find({
      relations: ['model'],
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

  async findAllResponsesWithModels() {
    return this.responseRepository.find({
      relations: ['prediction', 'prediction.model'],
    });
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

  async getActualWeather(prediction: Prediction): Promise<number> {
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
}
