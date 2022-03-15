import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../city/city.entity';
import { NeuralModel } from '../neural-model/neural-model.entity';
import { NeuralModelConfiguration, Predictor } from './predictor';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { OpenWeatherDto } from '../open-weather/open-weather.dto';
import { join } from 'path';

@Injectable()
export class NeuralModelService {
  constructor(
    @InjectRepository(NeuralModel)
    private readonly modelRepository: Repository<NeuralModel>,
  ) {}

  private readonly logger = new Logger(NeuralModelService.name);

  async createModell(
    city: City,
    config: NeuralModelConfiguration,
  ): Promise<NeuralModel> {
    const file_path = `file://models/${uuidv4()}`;
    const model = this.modelRepository.create({
      city: city,
      epochs: config.epochs,
      file_path: file_path,
      hiddenLayerCount: config.hiddenLayerCount,
      lstm_count: config.lstm_units,
    });

    await this.modelRepository.save(model);
    await model.getPredictor();

    return model;
  }

  async find(id: number): Promise<NeuralModel> {
    return this.modelRepository.findOne(id);
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
}
