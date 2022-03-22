import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { City } from '../city/city.entity';
import { NeuralModel } from '../neural-model/neural-model.entity';
import { Predictor } from './predictor';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { OpenWeatherDto } from '../open-weather/dto/open-weather.dto';
import { join } from 'path';
import { Prediction } from '../prediction/prediction.entity';
import { OpenWeatherService } from '../open-weather/open-weather.service';

@Injectable()
export class NeuralModelService {
  constructor(
    @InjectRepository(NeuralModel)
    private readonly modelRepository: Repository<NeuralModel>,
    private readonly weatherService: OpenWeatherService,
  ) {}

  private readonly logger = new Logger(NeuralModelService.name);

  async createModell(city: City, dto: CreateModelDto): Promise<NeuralModel> {
    const file_path = `file://models/${uuidv4()}`;
    const model = this.modelRepository.create({
      city: city,
      file_path: file_path,
      epochs: dto.epochs,
      hiddenLayerCount: dto.hiddenLayerCount,
      lstm_count: dto.lstm_count,
      name: dto.name,
    });

    await this.modelRepository.save(model);
    return model;
  }

  async findOne(id: number, withCity = false): Promise<NeuralModel> {
    const load: FindOneOptions<NeuralModel> = withCity
      ? { relations: ['city'] }
      : {};
    return this.modelRepository.findOne(id, load);
  }

  async findByStatus(status: number): Promise<NeuralModel[]> {
    return await this.modelRepository.find({
      where: { status: status },
      relations: ['city'],
    });
  }

  async makePrediction(model: NeuralModel): Promise<Prediction> {
    const predictor = await model.getPredictor();
    const data = await this.weatherService.getHistoricalHorlyData(
      model.city.lat.toString(),
      model.city.lon.toString(),
      Predictor.LAG,
    );
    return predictor.predict(data);
  }

  async pretrainModel(model: NeuralModel): Promise<number[]> {
    this.logger.debug('Pretrain function called');
    const predictor = await model.getPredictor();
    this.logger.debug('Got Predictor object');
    //load train data
    const data = JSON.parse(
      fs.readFileSync(join(__dirname, 'training_data.json'), 'utf-8'),
    ) as Array<OpenWeatherDto>;
    const prepared: OpenWeatherDto[][] = [];
    for (let i = Predictor.LAG; i < data.length; i++) {
      prepared.push(data.slice(i - Predictor.LAG, i + 1));
    }
    this.logger.debug('Pretrain data loaded');
    const info = await predictor.train(prepared);

    model.status = 1;
    await this.modelRepository.save(model);

    return info.history.acc as unknown as number[];
  }

  async setErrorState(id: number) {
    const model = await this.modelRepository.findOneOrFail(id);
    model.status = 2;
    this.modelRepository.save(model);
  }

  async setAccuracy(id: number, acc: number) {
    const model = await this.modelRepository.findOneOrFail(id);
    model.accuracy = acc;
    this.modelRepository.save(model);
  }
}
