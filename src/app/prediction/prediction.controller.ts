import {
  Controller,
  Get,
  Logger,
  Param,
  Redirect,
  Render,
} from '@nestjs/common';
import { CityService } from '../city/city.service';
import { PredictionService } from './prediction.service';

@Controller('predictions')
export class PredictionController {
  constructor(
    private readonly predictionService: PredictionService,
    private readonly cityService: CityService,
  ) {}
  private readonly logger = new Logger(PredictionController.name);

  @Get()
  @Render('predictions/index')
  async index() {
    const cities = await this.cityService.findAll();
    return {
      cities: cities.map((city) => {
        return {
          name: city.name,
          id: city.id,
        };
      }),
    };
  }

  @Get('response/:id/wrong')
  @Render('predictions/wrong')
  async wrongResult(@Param('id') id: number) {
    return { prediction: await this.predictionService.findOne(id) };
  }

  @Get('response/:id/:response')
  @Redirect('/predictions')
  async addResponse(
    @Param('id') id: number,
    @Param('response') response: number,
  ) {
    this.logger.debug(`id:${id}, response:${response}`);
    await this.predictionService.addResponseToPrediction({
      prediction_id: id,
      response: response,
    });
  }

  @Get(':city_id')
  @Render('predictions/current')
  async currentPredictions(@Param('city_id') city_id: number) {
    const predictions = await this.predictionService.findByCity(city_id);
    const city = await this.cityService.findOne(city_id);
    return {
      city: city,
      predictions: predictions.map((p) => {
        return {
          id: p.id,
          result: p.result,
          model: {
            id: p.model.id,
            name: p.model.name,
          },
        };
      }),
    };
  }
}
