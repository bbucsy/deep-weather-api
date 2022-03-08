import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Redirect,
} from '@nestjs/common';
import { City } from './city.entity';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @Render('city/new')
  async create(@Body() createCityDto: CreateCityDto) {
    console.log(createCityDto);
    return {
      city: await this.cityService.create(createCityDto),
      message: 'Created successfully',
    };
  }

  @Get('new')
  @Render('city/new')
  new() {
    return { city: new City() };
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

  /*@Patch(':id')
  async update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }
*/

  @Get(':id/delete')
  @Redirect('/city')
  async remove(@Param('id') id: string) {
    await this.cityService.remove(+id);
  }
}
