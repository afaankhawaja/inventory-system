import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(AlertService.name);

  async findAllAlerts(skip?: number, take?: number) {
    const [alerts, total] = await Promise.all([
      this.prisma.alert.findMany({
        skip,
        take,
        include: {
          itemAlerts: {
            include: {
              item: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.alert.count(),
    ]);

    return { alerts, total };
  }

  findAlertById(alertId: string) {
    return this.prisma.alert.findUnique({
      where: { alertId },
      include: {
        itemAlerts: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  findItemAlerts(itemId: string) {
    return this.prisma.itemAlert.findMany({
      where: { itemId },
      include: {
        alert: true,
        item: true,
      },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.checkExpiryAlerts();
    await this.checkRestockAlerts();
  }

  private async checkExpiryAlerts() {
    const thresholdDays = 30;
    const alertDate = new Date();
    alertDate.setDate(alertDate.getDate() + thresholdDays);

    const items = await this.prisma.item.findMany({
      where: {
        expiry_date: {
          lte: alertDate,
          gte: new Date(),
        },
      },
    });

    for (const item of items) {
      const existingAlert = await this.prisma.itemAlert.findFirst({
        where: {
          itemId: item.itemId,
          alert: {
            alert_type: 'expiry',
            is_active: true,
          },
        },
        include: {
          alert: true,
        },
      });

      if (!existingAlert) {
        const alert = await this.prisma.alert.create({
          data: {
            alert_type: 'expiry',
            message: `Item "${item.name}" is expiring soon on ${item?.expiry_date?.toISOString().split('T')[0]}`,
            severity: 'warning',
            alert_date: new Date(),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        await this.prisma.itemAlert.create({
          data: {
            alertId: alert.alertId,
            itemId: item.itemId,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }
    }
  }

  private async checkRestockAlerts() {
    const items = await this.prisma.item.findMany({
      where: {
        quantity_in_stock: {
          lte: this.prisma.item.fields.reorder_threshold,
        },
      },
    });

    for (const item of items) {
      const existingAlert = await this.prisma.itemAlert.findFirst({
        where: {
          itemId: item.itemId,
          alert: {
            alert_type: 'low stock',
            is_active: true,
          },
        },
        include: {
          alert: true,
        },
      });

      if (!existingAlert) {
        const alert = await this.prisma.alert.create({
          data: {
            alert_type: 'low stock',
            message: `Item "${item.name}" has low stock of "${item.quantity_in_stock}"`,
            severity: 'warning',
            alert_date: new Date(),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        await this.prisma.itemAlert.create({
          data: {
            alertId: alert.alertId,
            itemId: item.itemId,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }
    }
  }
}
