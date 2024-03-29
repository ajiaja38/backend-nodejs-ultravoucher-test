import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VacationService } from './vacation.service';
import { VacationDto } from './dto/vacation.dto';
import { Vacation } from './schema/vacation.schema';
import { JwtAuthGuard } from 'src/utils/guard/auth.guard';
import { PaginationResponseInterface } from 'src/utils/interface/pageResponse.interface';
import { RoleGuard } from 'src/utils/guard/role.guard';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { Role } from 'src/user/schema/user.schema';

@Controller('vacation')
@UseGuards(JwtAuthGuard, RoleGuard)
export class VacationController {
  constructor(private readonly vacationService: VacationService) {}

  @Post()
  @Roles(Role.ADMIN)
  async createVacationHandler(
    @Body() vacationDto: VacationDto,
  ): Promise<Vacation> {
    return this.vacationService.createVacation(vacationDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async getAllVacationHandler(): Promise<Vacation[]> {
    return this.vacationService.getAllVacations();
  }

  @Get('paginate')
  @Roles(Role.ADMIN, Role.USER)
  async getAllVacationPaginateHandler(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<PaginationResponseInterface<Vacation>> {
    return this.vacationService.getAllVacationPaginate(page, limit, search);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  async getVacationByIdHandler(@Param('id') id: string): Promise<Vacation> {
    return this.vacationService.getVacationById(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async updateVacationHandler(
    @Param('id') id: string,
    @Body() vacationDto: VacationDto,
  ): Promise<Vacation> {
    return this.vacationService.updateVacation(id, vacationDto);
  }

  @Delete('delete/:id')
  @Roles(Role.ADMIN)
  async deleteVacationHandler(@Param('id') id: string): Promise<string> {
    return this.vacationService.deleteVacation(id);
  }
}
