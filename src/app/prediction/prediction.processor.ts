import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CityService } from '../city/city.service';

import { OpenWeatherService } from '../open-weather/open-weather.service';
import { PredictionService } from './prediction.service';

@Processor('predictor')
export class PredictionProcessor {
  private readonly logger = new Logger(PredictionProcessor.name);

  constructor(
    private readonly cityService: CityService,
    private readonly weatherService: OpenWeatherService,
    private readonly predictionService: PredictionService,
  ) {}

  @Process('auto-respond')
  async handlePretrain(job: Job) {
    const now = Date.now();
    this.logger.log(`Job(${job.id}) Start auto-respond job`);
    const cities = await this.cityService.findAll();
    for (const city of cities) {
      this.logger.log(`Getting actual weather of ${city.name}`);
      const weather = await this.weatherService.currentWeather(
        city.lat.toString(),
        city.lon.toString(),
      );

      const predcitions = await this.predictionService.findByCity(city.id, now);
      await Promise.all(
        predcitions.map(async (p) => {
          this.logger.debug(`Adding response to ${p.id}`);
          return await this.predictionService.addResponseToPrediction({
            prediction_id: p.id,
            response: weather.weather,
          });
        }),
      );
    }
  }

  @OnQueueFailed()
  async handler(job: Job, err: Error) {
    this.logger.error('job failed');
    this.logger.error(err.stack);
  }
}
