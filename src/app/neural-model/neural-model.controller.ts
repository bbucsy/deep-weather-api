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
import { Queue } from 'bull';
import { CityService } from '../city/city.service';
import { CreateModelDto } from './dto/create-model.dto';
import { NeuralModelDto, NeuralModelListDto } from './dto/neural-model.dto';
import { NeuralModel } from './neural-model.entity';
import { NeuralModelService } from './neural-model.service';

@Controller('neural-model')
export class NeuralModelController {
  constructor(
    private readonly modelService: NeuralModelService,
    private readonly cityService: CityService,
    @InjectQueue('neural-model') private readonly neuralQueue: Queue,
  ) {}

  private readonly logger = new Logger(NeuralModelController.name);

  @Post()
  async createModel(@Body() dto: CreateModelDto) {
    this.logger.debug(dto);
    const city = await this.cityService.findOne(dto.city);
    if (typeof city === 'undefined')
      throw new NotFoundException(undefined, 'City not found');

    const model = await this.modelService.createModell(city, dto);
    await this.neuralQueue.add('pretrain', { modelId: model.id });
  }

  @Get()
  async findAllModels(): Promise<{ id: number; name: string }[]> {
    const models = await this.modelService.findAll();
    return models.map(this.modelToListDto);
  }

  @Post('predict')
  @HttpCode(200)
  async predict() {
    await this.neuralQueue.add('predict');
  }

  @Post('retrain')
  @HttpCode(200)
  async retrain() {
    await this.modelService.startRetrainJobs();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NeuralModelDto> {
    const model = await this.modelService.findOne(+id, true);
    if (typeof model === undefined) throw new NotFoundException();
    return this.ModelToDto(model);
  }

  private ModelToDto(model: NeuralModel): NeuralModelDto {
    return {
      id: model.id,
      name: model.name,
      city: {
        id: model.city.id,
        name: model.city.name,
      },
      accuracy: model.accuracy,
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
