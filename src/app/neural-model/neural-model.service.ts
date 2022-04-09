import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { City } from '../city/city.entity';
import { NeuralModel } from '../neural-model/neural-model.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateModelDto } from './dto/create-model.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class NeuralModelService {
  constructor(
    @InjectRepository(NeuralModel)
    private readonly modelRepository: Repository<NeuralModel>,
    @InjectQueue('neural-model') private readonly neuralQueue: Queue,
  ) {}

  private readonly logger = new Logger(NeuralModelService.name);

  async createModell(city: City, dto: CreateModelDto): Promise<NeuralModel> {
    const file_path = `file://models/${uuidv4()}`;
    const model = this.modelRepository.create({
      city: city,
      file_path: file_path,
      epochs: dto.epochs,
      hiddenLayerCount: dto.hiddenLayerCount,
      lstm_count: dto.lstm_count,
      name: dto.name,
    });

    await this.modelRepository.save(model);
    return model;
  }

  async findAll(): Promise<NeuralModel[]> {
    return await this.modelRepository.find();
  }

  async findOne(id: number, withCity = false): Promise<NeuralModel> {
    const load: FindOneOptions<NeuralModel> = withCity
      ? { relations: ['city'] }
      : {};
    return this.modelRepository.findOne(id, load);
  }

  async findByStatus(status: number): Promise<NeuralModel[]> {
    return await this.modelRepository.find({
      where: { status: status },
      relations: ['city'],
    });
  }

  async setErrorState(id: number) {
    const model = await this.modelRepository.findOneOrFail(id);
    model.status = 2;
    this.modelRepository.save(model);
  }

  async setAccuracy(id: number, acc: number) {
    const model = await this.modelRepository.findOneOrFail(id);
    model.accuracy = acc;
    this.modelRepository.save(model);
  }

  async startWeatherPredictionJob() {
    await this.neuralQueue.add('predict');
  }

  async startRetrainJobs() {
    const models = await this.findByStatus(1);
    await Promise.all(
      models.map((m) => {
        return this.neuralQueue.add('retrain', { modelId: m.id });
      }),
    );
  }
}
