import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { RequiredRole } from '../auth/role.guard';
import { CityService } from '../city/city.service';
import { Role } from '../user/user-role.enum';
import { CreateModelDto } from './dto/create-model.dto';
import {
  NeuralModelAccuracyDto,
  NeuralModelDto,
  NeuralModelListDto,
} from './dto/neural-model.dto';
import { TrainingDataDto } from './dto/training-data.dto';
import { NeuralModel } from './neural-model.entity';
import { NeuralModelService } from './neural-model.service';

@ApiTags('neural-model')
@ApiBearerAuth()
@Controller('neural-model')
export class NeuralModelController {
  constructor(
    private readonly modelService: NeuralModelService,
    private readonly cityService: CityService,
    @InjectQueue('neural-model') private readonly neuralQueue: Queue,
  ) {}

  private readonly logger = new Logger(NeuralModelController.name);

  /**
   * Cretes a new Neural model, and starts a Pre-Train job with a set of training data.
   */
  @RequiredRole(Role.Admin)
  @Post()
  async createModel(@Body() dto: CreateModelDto) {
    this.logger.debug(dto);
    const city = await this.cityService.findOne(dto.city);
    if (typeof city === 'undefined')
      throw new NotFoundException(undefined, 'City not found');

    const model = await this.modelService.createModell(city, dto);
    await this.neuralQueue.add('pretrain', { modelId: model.id });
  }

  /**
   *
   * Finds all neural models
   */
  @Get()
  async findAllModels(): Promise<NeuralModelListDto[]> {
    const models = await this.modelService.findAll();
    return models.map(this.modelToListDto);
  }

  /** Forcefully  starts a prediction background job (Normally started by cron)*/
  @RequiredRole(Role.Admin)
  @Post('predict')
  @HttpCode(200)
  async predict() {
    await this.neuralQueue.add('predict');
  }

  /** Forcefully  starts a Re-Train background job (Normally started by cron)*/
  @RequiredRole(Role.Admin)
  @Post('retrain')
  @HttpCode(200)
  async retrain() {
    await this.modelService.startRetrainJobs();
  }

  /**
   * Gets a NeuralModel with a specific ID
   */
  @ApiNotFoundResponse({ description: 'Neural model not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NeuralModelDto> {
    const model = await this.modelService.findOne(+id, true);
    if (typeof model === 'undefined') throw new NotFoundException();
    const dto = this.ModelToDto(model);
    dto.accuracy = await this.modelService.getAccuracySinceLastTrain(model.id);
    return dto;
  }

  @Get(':id/accuracy')
  async overallAccuracy(
    @Param('id') id: string,
  ): Promise<NeuralModelAccuracyDto> {
    return { accuracy: await this.modelService.getActualAccuracy(+id) };
  }

  @Get(':id/training-data')
  async getTrainingData(@Param('id') id: string): Promise<TrainingDataDto[]> {
    return await this.modelService.getTrainingData(+id);
  }

  private ModelToDto(model: NeuralModel): NeuralModelDto {
    return {
      id: model.id,
      name: model.name,
      city: {
        id: model.city.id,
        name: model.city.name,
      },
      status: model.status,
      epochs: model.epochs,
      hiddenLayerCount: model.hiddenLayerCount,
      lstm_count: model.lstm_count,
    };
  }
  private modelToListDto(model: NeuralModel): NeuralModelListDto {
    return {
      id: model.id,
      name: model.name,
      status: model.status,
    };
  }
}
