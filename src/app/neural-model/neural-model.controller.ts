import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { Queue } from 'bull';
import { Response } from 'express';
import { CityService } from '../city/city.service';
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
  async createModel(@Body() dto: CreateModelDto, @Res() res: Response) {
    this.logger.debug(dto);
    const city = await this.cityService.findOne(dto.city);
    const model = await this.modelService.createModell(city, dto);
    await this.neuralQueue.add('pretrain', { modelId: model.id });
    return res.redirect(`/neural-model/${model.id}`);
  }

  @Get('new')
  @Render('neural-model/new')
  async new(@Query('city') cityId: number, @Res() res) {
    this.logger.debug(`Requested city Id: ${cityId}`);
    const cities = await this.cityService.findAll();

    if (cities.length == 0) res.redirect('/city/new');

    const model = new NeuralModel();

    if (typeof cityId !== undefined) {
      const city = await this.cityService.findOne(cityId);
      model.city = city;
    }

    return { neuralModel: model, cities: cities };
  }

  @Get(':id')
  @Render('neural-model/show')
  async findOne(@Param('id') id: string) {
    const model = await this.modelService.findOne(+id, true);
    this.logger.debug(`model city: ${model.city.name}`);
    return { neuralModel: model };
  }
}
