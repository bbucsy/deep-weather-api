import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  async create(@Body() createCityDto: CreateCityDto) {
    return await this.cityService.create(createCityDto);
  }

  @Get()
  @Render('city/index')
  async findAll() {
    return { cities: await this.cityService.findAll() };
  }

  @Get(':id')
  @Render('city/show')
  async findOne(@Param('id') id: string) {
    return { city: await this.cityService.findOne(+id) };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.cityService.remove(+id);
  }
}
