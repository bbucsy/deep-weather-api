import { Controller, Get } from '@nestjs/common';
import { CityService } from '../city/city.service';
import { NeuralModelService } from './neural-model.service';

@Controller('neural-model')
export class NeuralModelController {
  constructor(
    private readonly modelService: NeuralModelService,
    private readonly cityService: CityService,
  ) {}

  @Get('new')
  async createModel() {
    const city = await this.cityService.findAll();

    const model = await this.modelService.createModell(city[0], {
      epochs: 5,
      hiddenLayerCount: 5,
      lstm_units: 16,
    });

    const info = await this.modelService.pretrainModel(model);
    return info;
  }
}
