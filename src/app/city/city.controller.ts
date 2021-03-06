import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  NotFoundException,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequiredRole } from '../auth/role.guard';
import { Role } from '../user/user-role.enum';
import { City } from './city.entity';
import { CityService } from './city.service';
import { CityDto } from './dto/city.dto';
import { CreateCityDto } from './dto/create-city.dto';

@ApiTags('city')
@ApiBearerAuth()
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  private logger = new Logger(CityController.name);

  /**
   *
   * Creates a new city
   */
  @RequiredRole(Role.Admin)
  @Post()
  async create(@Body() createCityDto: CreateCityDto) {
    const city = await this.cityService.create(createCityDto);
    return {
      id: city.id,
      message: 'Created city successfully',
    };
  }

  /** Returns all cities */
  @RequiredRole(Role.Guest)
  @Get()
  @ApiOkResponse({ type: [CityDto] })
  async findAll(): Promise<CityDto[]> {
    return (await this.cityService.findAll()).map(this.cityToDto);
  }

  /** Returns a specific city */
  @Get(':id')
  @ApiOkResponse({ type: CityDto })
  @ApiNotFoundResponse({ description: 'City not found with specified ID' })
  async findOne(@Param('id') id: number): Promise<CityDto> {
    const city = await this.cityService.findOne(id);
    if (!city) throw new NotFoundException();
    return this.cityToDto(city);
  }

  /** Deletes a specific city */
  @RequiredRole(Role.Admin)
  @Delete(':id')
  @ApiOkResponse({ description: 'City with specified ID is deleted' })
  @ApiResponse({ status: 204, description: 'No city found with this id' })
  async remove(@Param('id') id: string) {
    const removed = await this.cityService.remove(+id);
    this.logger.debug(removed);
    if (removed === undefined)
      throw new HttpException(
        {
          status: HttpStatus.NO_CONTENT,
          error: 'No content',
        },
        HttpStatus.NO_CONTENT,
      );
  }

  private cityToDto(city: City): CityDto {
    return {
      id: city.id,
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      neuralModels: city.neuralModels.map((nm) => {
        return { id: nm.id, name: nm.name };
      }),
    };
  }
}
