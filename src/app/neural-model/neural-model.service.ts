import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../city/city.entity';
import { NeuralModel } from '../neural-model/neural-model.entity';
import { NeuralModelConfiguration } from './predictor';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NeuralModelService {
  constructor(
    @InjectRepository(NeuralModel)
    private readonly modelRepository: Repository<NeuralModel>,
  ) {}

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
    const predictor = await model.getPredictor();

    await predictor.train([]);

    model.ready = true;
    this.modelRepository.save(model);

    return model;
  }
}
