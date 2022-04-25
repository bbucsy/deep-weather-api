import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequiredRole } from '../auth/role.guard';
import { CityService } from '../city/city.service';
import { Role } from '../user/user-role.enum';
import { CreateResponseDto } from './dto/create-response.dto';
import { PredictionListDto } from './dto/prediction-list.dto';
import { ResponseListDto } from './dto/response-list.dto';
import { PredictionResponse } from './prediction-response.entity';
import { Prediction } from './prediction.entity';
import { PredictionService } from './prediction.service';

@ApiTags('predictions')
@ApiBearerAuth()
@Controller('predictions')
export class PredictionController {
  constructor(
    private readonly predictionService: PredictionService,
    private readonly cityService: CityService,
  ) {}
  private readonly logger = new Logger(PredictionController.name);

  /**
   * Gets all user responses to weather predictions
   */
  @RequiredRole(Role.Admin)
  @Get('responses')
  async responses(): Promise<ResponseListDto[]> {
    const responses = await this.predictionService.findAllResponsesWithModels();
    return responses.map(this.responseToListDto);
  }

  /**
   * Creates a user response to a specified prediction
   * @param createResponseDto
   */
  @Post('responses')
  async addResponse(@Body() createResponseDto: CreateResponseDto) {
    await this.predictionService.addResponseToPrediction(createResponseDto);
  }

  /**
   * Returns all predictions predicted to a given city.
   * Only those predictions will show up, that are in the time window of the time of calling the endpoint
   * @param city_id The id of the city
   */
  @RequiredRole(Role.Guest)
  @Get('city/:city_id')
  async currentPredictionsOfCity(
    @Param('city_id') city_id: number,
  ): Promise<PredictionListDto[]> {
    const city = await this.cityService.findOne(city_id);
    if (typeof city === 'undefined')
      throw new NotFoundException('City not found');

    const now = Date.now();
    const predictions = await this.predictionService.findByCity(city_id, now);

    const dtos = predictions.map(async (p) => {
      const userLabel = await this.predictionService.getActualWeather(p);
      return this.predictionToListDto(p, userLabel);
    });

    return Promise.all(dtos);
  }

  /**
   *
   * Returns all predictions, that are in the current time window
   */
  @Get()
  @RequiredRole(Role.Guest)
  async currentPredictions(): Promise<PredictionListDto[]> {
    const now = Date.now();
    const predictions =
      await this.predictionService.findAllPredictionsWithModelsAndCity(now);

    const dtos = predictions.map(async (p) => {
      const userLabel = await this.predictionService.getActualWeather(p);
      return this.predictionToListDto(p, userLabel);
    });

    return Promise.all(dtos);
  }

  private responseToListDto(r: PredictionResponse): ResponseListDto {
    return {
      id: r.id,
      created_at: r.created_at.toISOString(),
      model: {
        id: r.prediction.model.id,
        name: r.prediction.model.name,
      },
      prediction: r.prediction.result,
      userResponse: r.response,
    };
  }

  private predictionToListDto(
    p: Prediction,
    userResponse: number,
  ): PredictionListDto {
    return {
      id: p.id,
      city: {
        id: p.model.city.id,
        name: p.model.city.name,
      },
      model: {
        id: p.model.id,
        name: p.model.name,
      },
      predictedLabel: p.result,
      predictionTime: p.predictionTime,
      userResponseLabel: userResponse,
    };
  }
}
