import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vacation } from './schema/vacation.schema';
import { Model } from 'mongoose';
import { UuidService } from 'src/uuid/uuid.service';
import { MessageService } from 'src/message/message.service';
import { TimezoneService } from 'src/timezone/timezone.service';
import { VacationDto } from './dto/vacation.dto';
import { PaginationResponseInterface } from 'src/utils/interface/pageResponse.interface';

@Injectable()
export class VacationService {
  constructor(
    @InjectModel(Vacation.name)
    private readonly vacationModel: Model<Vacation>,
    private readonly uuidService: UuidService,
    private readonly messageService: MessageService,
    private readonly timezoneService: TimezoneService,
  ) {}

  async createVacation(vacationDto: VacationDto): Promise<Vacation> {
    const id: string = this.uuidService.generateId('vacation');
    const createdAt: string = this.timezoneService.getTimeZone();
    const updatedAt: string = createdAt;

    const newVacation = new this.vacationModel({
      id,
      ...vacationDto,
      createdAt,
      updatedAt,
    });

    newVacation.save();
    this.messageService.setMessage('Vacation created successfully');
    return newVacation;
  }

  async getAllVacations(): Promise<Vacation[]> {
    const vacations: Vacation[] = await this.vacationModel
      .find()
      .sort({ createdAt: -1 });
    this.messageService.setMessage('Get all vacation successfully');
    return vacations;
  }

  async getAllVacationPaginate(
    page: number,
    limit: number,
    search: string,
  ): Promise<PaginationResponseInterface<Vacation>> {
    const regexQuery: RegExp = new RegExp(search, 'i');
    const query = {
      $or: [{ name: regexQuery }],
    };

    const totalData: number = await this.vacationModel.countDocuments(query);
    const totalPages: number = Math.ceil(totalData / limit);
    const data: Vacation[] = await this.vacationModel
      .find(query)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    this.messageService.setMessage('Get all vacation successfully');

    return {
      totalPages,
      page,
      totalData,
      data,
    };
  }

  async getVacationById(id: string): Promise<Vacation> {
    const vacation: Vacation = await this.vacationModel.findOne({ id });

    if (!vacation) {
      throw new NotFoundException('Vacation not found');
    }

    this.messageService.setMessage('Get vacation successfully');
    return vacation;
  }

  async updateVacation(
    id: string,
    vacationDto: VacationDto,
  ): Promise<Vacation> {
    const updatedAt: string = this.timezoneService.getTimeZone();

    const updatedVacation = await this.vacationModel.findOneAndUpdate(
      { id },
      { ...vacationDto, updatedAt },
      { new: true },
    );

    if (!updatedVacation) {
      throw new NotFoundException('Vacation not found');
    }
    this.messageService.setMessage('Vacation updated successfully');
    return updatedVacation;
  }

  async deleteVacation(id: string): Promise<string> {
    const deletedVacation = await this.vacationModel.findOneAndDelete({ id });

    if (!deletedVacation) {
      throw new NotFoundException('Vacation not found');
    }

    this.messageService.setMessage('Vacation deleted successfully');
    return `Vacation ${deletedVacation.name} deleted successfully`;
  }
}
