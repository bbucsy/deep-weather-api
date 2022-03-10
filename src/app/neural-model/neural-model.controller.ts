import { Controller, Get } from '@nestjs/common';
import { CityService } from '../city/city.service';
import { NeuralModelService } from './neural-model.service';

@Controller('neural-model')
export class NeuralModelController {
  constructor(
    private readonly modelService: NeuralModelService,
    private readonly cityService: CityService,
  ) {}

  @Get()
  async createModel() {
    const city = await this.cityService.findAll();

    const model = await this.modelService.createModell(city[0], {
      epochs: 6,
      hiddenLayerCount: 10,
      lstm_units: 5,
    });

    console.log(model);

    const pred = await model.getPredictor();
    return pred.summary();
  }
}
