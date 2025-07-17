import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MaintenanceScheduleUpdateInput } from 'src/@generated/maintenance-schedule/maintenance-schedule-update.input';

import { Prisma } from 'generated/prisma';
import { MaintenanceScheduleCreateInput } from 'src/@generated/maintenance-schedule/maintenance-schedule-create.input';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MaintenanceScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMaintenanceScheduleInput: MaintenanceScheduleCreateInput) {
    return this.prisma.maintenanceSchedule.create({
      data: <Prisma.MaintenanceScheduleCreateInput>{
        maintenance_type: createMaintenanceScheduleInput.maintenance_type,
        status: createMaintenanceScheduleInput.status,
        notes: createMaintenanceScheduleInput.notes,
        createdAt: createMaintenanceScheduleInput.createdAt,
        updatedAt: createMaintenanceScheduleInput.updatedAt,
        item: createMaintenanceScheduleInput.item
          ? {
              ...(createMaintenanceScheduleInput.item.connect && {
                connect: createMaintenanceScheduleInput.item.connect,
              }),
              ...(createMaintenanceScheduleInput.item.create && {
                create: createMaintenanceScheduleInput.item.create,
              }),
            }
          : undefined,
        user: createMaintenanceScheduleInput.user
          ? {
              ...(createMaintenanceScheduleInput.user.connect && {
                connect: createMaintenanceScheduleInput.user.connect,
              }),
              ...(createMaintenanceScheduleInput.user.create && {
                create: createMaintenanceScheduleInput.user.create,
              }),
            }
          : undefined,
      },
      include: {
        item: true,
        user: true,
      },
    });
  }

  async findAll(skip?: number, take?: number) {
    const [maintenanceSchedules, total] = await Promise.all([
      this.prisma.maintenanceSchedule.findMany({
        skip,
        take,
        include: {
          item: true,
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.maintenanceSchedule.count(),
    ]);

    return { maintenanceSchedules, total };
  }

  async findOne(id: string) {
    const record = await this.prisma.maintenanceSchedule.findUnique({
      where: { maintenance_schedule_ID: id },
      include: {
        item: true,
        user: true,
      },
    });
    return record;
  }

  async update(
    id: string,
    updateMaintenanceScheduleInput: MaintenanceScheduleUpdateInput,
  ) {
    await this.findOne(id);

    return this.prisma.maintenanceSchedule.update({
      where: { maintenance_schedule_ID: id },
      data: <Prisma.MaintenanceScheduleUpdateInput>{
        maintenance_type: updateMaintenanceScheduleInput.maintenance_type,
        status: updateMaintenanceScheduleInput.status,
        notes: updateMaintenanceScheduleInput.notes,
        createdAt: updateMaintenanceScheduleInput.createdAt,
        updatedAt: updateMaintenanceScheduleInput.updatedAt,
        item: updateMaintenanceScheduleInput.item
          ? {
              ...(updateMaintenanceScheduleInput.item.connect && {
                connect: updateMaintenanceScheduleInput.item.connect,
              }),
              ...(updateMaintenanceScheduleInput.item.disconnect && {
                disconnect: updateMaintenanceScheduleInput.item.disconnect,
              }),
              ...(updateMaintenanceScheduleInput.item.create && {
                create: updateMaintenanceScheduleInput.item.create,
              }),
              ...(updateMaintenanceScheduleInput.item.update && {
                update: updateMaintenanceScheduleInput.item.update,
              }),
            }
          : undefined,
        user: updateMaintenanceScheduleInput.user
          ? {
              ...(updateMaintenanceScheduleInput.user.connect && {
                connect: updateMaintenanceScheduleInput.user.connect,
              }),
              ...(updateMaintenanceScheduleInput.user.disconnect && {
                disconnect: updateMaintenanceScheduleInput.user.disconnect,
              }),
              ...(updateMaintenanceScheduleInput.user.create && {
                create: updateMaintenanceScheduleInput.user.create,
              }),
              ...(updateMaintenanceScheduleInput.user.update && {
                update: updateMaintenanceScheduleInput.user.update,
              }),
            }
          : undefined,
      },
      include: {
        item: true,
        user: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.maintenanceSchedule.delete({
      where: { maintenance_schedule_ID: id },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.checkItemCondition();
  }
  private async checkItemCondition() {
    const items = await this.prisma.item.findMany({
      where: {
        condition: 'DAMAGED',
      },
    });
    for (const item of items) {
      const AlreadyExist = await this.prisma.maintenanceSchedule.findFirst({
        where: {
          maintenance_type: 'CORRECTIVE',
          item: {
            itemId: item.itemId,
          },
          OR: [
            {
              status: 'SCHEDULED',
            },
            {
              status: 'DUE',
            },
          ],
        },
        include: {
          item: true,
        },
      });

      if (!AlreadyExist) {
        await this.prisma.maintenanceSchedule.create({
          data: {
            itemId: item.itemId,
            createdAt: new Date(),
            updatedAt: new Date(),
            maintenance_type: 'CORRECTIVE',
            status: 'DUE',
            notes: ` Item "${item.name}" is "${item.condition}" need to fixed`,
          },
        });
      }
    }
  }
}
