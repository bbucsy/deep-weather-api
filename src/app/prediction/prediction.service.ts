import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NeuralModel } from './neural-model.entity';
import { Prediction } from './prediction.entity';

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(NeuralModel)
    private readonly modelRepository: Repository<NeuralModel>,
  ) {}

  async predictWeather(): Promise<Prediction> {
    const model = await this.modelRepository.findOne();

    return await model.getPredictor().predict();
  }
}
