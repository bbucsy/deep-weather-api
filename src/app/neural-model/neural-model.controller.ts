import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Queue } from 'bull';
import { CityService } from '../city/city.service';
import { NeuralModelService } from './neural-model.service';

@Controller('neural-model')
export class NeuralModelController {
  constructor(
    private readonly modelService: NeuralModelService,
    private readonly cityService: CityService,
    @InjectQueue('neural-model') private readonly neuralQueue: Queue,
  ) {}

  @Get('new')
  async createModel() {
    const city = await this.cityService.findAll();

    const model = await this.modelService.createModell(city[0], {
      epochs: 1,
      hiddenLayerCount: 5,
      lstm_units: 16,
    });

    await this.neuralQueue.add('pretrain', { modelId: model.id });
    return model;
  }
}
