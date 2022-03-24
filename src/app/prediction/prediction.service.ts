import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from './prediction.entity';
import { CreatePredictionDto } from './dto/create-prediction.dto';

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(Prediction)
    private readonly predictionRepository: Repository<Prediction>,
  ) {}

  async findAllPredictions(): Promise<Prediction[]> {
    return this.predictionRepository.find();
  }

  async create(createDto: CreatePredictionDto): Promise<Prediction> {
    const prediction = this.predictionRepository.create({
      input: JSON.stringify(createDto.input),
      model: createDto.model,
      result: createDto.result,
    });
    return this.predictionRepository.save(prediction);
  }

  async findByCity(city_id: number): Promise<Prediction[]> {
    return this.predictionRepository.find({
      relations: ['model', 'model.city'],
      where: { model: { city: city_id } },
    });
  }
}
