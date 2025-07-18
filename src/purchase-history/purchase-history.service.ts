import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PurchaseHistoryCreateInput } from 'src/@generated/purchase-history/purchase-history-create.input';
import { PurchaseHistoryUpdateInput } from 'src/@generated/purchase-history/purchase-history-update.input';
import { Prisma } from 'generated/prisma';

@Injectable()
export class PurchaseHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(purchaseHistoryCreateInput: PurchaseHistoryCreateInput) {
    return this.prisma.purchaseHistory.create({
      data: <Prisma.PurchaseHistoryCreateInput>{
        purchase_date: purchaseHistoryCreateInput.purchase_date,
        quantity: purchaseHistoryCreateInput.quantity,
        unit_price: purchaseHistoryCreateInput.unit_price,
        total_cost: purchaseHistoryCreateInput.total_cost,
        item: purchaseHistoryCreateInput.item
          ? {
              ...(purchaseHistoryCreateInput.item.connect && {
                connect: purchaseHistoryCreateInput.item.connect,
              }),
              ...(purchaseHistoryCreateInput.item.create && {
                create: purchaseHistoryCreateInput.item.create,
              }),
            }
          : undefined,
        vendor: purchaseHistoryCreateInput.vendor
          ? {
              ...(purchaseHistoryCreateInput.vendor.connect && {
                connect: purchaseHistoryCreateInput.vendor.connect,
              }),
              ...(purchaseHistoryCreateInput.vendor.create && {
                create: purchaseHistoryCreateInput.vendor.create,
              }),
            }
          : undefined,
      },
      include: {
        item: true,
        vendor: true,
      },
    });
  }

  async update(
    purchaseID: string,
    purchaseHistoryUpdateInput: PurchaseHistoryUpdateInput,
  ) {
    return this.prisma.purchaseHistory.update({
      where: { purchaseId: purchaseID },
      data: <Prisma.PurchaseHistoryUpdateInput>{
        purchase_date: purchaseHistoryUpdateInput.purchase_date,
        quantity: purchaseHistoryUpdateInput.quantity,
        unit_price: purchaseHistoryUpdateInput.unit_price,
        total_cost: purchaseHistoryUpdateInput.total_cost,
        item: purchaseHistoryUpdateInput.item
          ? {
              ...(purchaseHistoryUpdateInput.item.connect && {
                connect: purchaseHistoryUpdateInput.item.connect,
              }),
              ...(purchaseHistoryUpdateInput.item.disconnect && {
                disconnect: purchaseHistoryUpdateInput.item.disconnect,
              }),
              ...(purchaseHistoryUpdateInput.item.create && {
                create: purchaseHistoryUpdateInput.item.create,
              }),
              ...(purchaseHistoryUpdateInput.item.update && {
                update: purchaseHistoryUpdateInput.item.update,
              }),
            }
          : undefined,
        vendor: purchaseHistoryUpdateInput.vendor
          ? {
              ...(purchaseHistoryUpdateInput.vendor.connect && {
                connect: purchaseHistoryUpdateInput.vendor.connect,
              }),
              ...(purchaseHistoryUpdateInput.vendor.disconnect && {
                disconnect: purchaseHistoryUpdateInput.vendor.disconnect,
              }),
              ...(purchaseHistoryUpdateInput.vendor.create && {
                create: purchaseHistoryUpdateInput.vendor.create,
              }),
              ...(purchaseHistoryUpdateInput.vendor.update && {
                update: purchaseHistoryUpdateInput.vendor.update,
              }),
            }
          : undefined,
      },
      include: {
        item: true,
        vendor: true,
      },
    });
  }

  remove(purchaseID: string) {
    return this.prisma.purchaseHistory.delete({
      where: { purchaseId: purchaseID },
    });
  }

  findAll() {
    return this.prisma.purchaseHistory.findMany({
      include: {
        item: true,
        vendor: true,
      },
    });
  }

  findOne(purchaseID: string) {
    return this.prisma.purchaseHistory.findUnique({
      where: { purchaseId: purchaseID },
      include: {
        item: true,
        vendor: true,
      },
    });
  }
}
