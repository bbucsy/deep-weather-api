import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City) private readonly cityRepository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const city = this.cityRepository.create(createCityDto);
    await this.cityRepository.save(city);
    return city;
  }

  async findAll(): Promise<City[]> {
    return this.cityRepository.find();
  }

  async findOne(id: number): Promise<City> {
    return this.cityRepository.findOne(id);
  }

  async update(id: number, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.cityRepository.findOne(id);
    this.cityRepository.merge(city, updateCityDto);
    await this.cityRepository.save(city);
    return city;
  }

  async remove(id: number): Promise<City> {
    try {
      const city = await this.cityRepository.findOne(id);
      if (typeof city !== 'undefined') return this.cityRepository.remove(city);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'There are active models on this city. Cannot delete',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
