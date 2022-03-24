import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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

  @Get('responses')
  @Render('predictions/responses')
  async responses() {
    const responses = await this.predictionService.findAllResponsesWithModels();
    return {
      responses: responses.map((r) => {
        return {
          created_at: r.created_at.toLocaleString(),
          model: r.prediction.model.name,
          predicted: r.prediction.result,
          actual: r.response,
        };
      }),
    };
  }

  @Get('response/:id/wrong')
  @Render('predictions/wrong')
  async wrongResult(@Param('id') id: number, @Query('city') city_id: number) {
    return {
      prediction: await this.predictionService.findOne(id),
      city_id: city_id,
    };
  }

  @Get('response/:id/:response')
  async addResponse(
    @Param('id') id: number,
    @Param('response') response: number,
    @Query('city') city_id: number,
    @Res() res: Response,
  ) {
    await this.predictionService.addResponseToPrediction({
      prediction_id: id,
      response: response,
    });
    if (typeof city_id != 'undefined') {
      res.redirect(`/predictions/${city_id}?success`);
    } else {
      res.redirect('/predictions');
    }
  }

  @Get(':city_id')
  @Render('predictions/current')
  async currentPredictions(
    @Param('city_id') city_id: number,
    @Query('success') success: boolean,
  ) {
    const now = Date.now();
    const predictions = (
      await this.predictionService.findByCity(city_id)
    ).filter((p) => p.predictionTime > now);
    const city = await this.cityService.findOne(city_id);
    return {
      success: success,
      city: city,
      predictions: predictions.map((p) => {
        return {
          id: p.id,
          dt: p.predictionTime,
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
