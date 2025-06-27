import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemCreateInput } from 'src/@generated/item/item-create.input';
import { ItemUpdateInput } from 'src/@generated/item/item-update.input';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}
  create(itemCreateInput: ItemCreateInput) {
    return this.prisma.item.create({
      data: {
        name: itemCreateInput.name,
        manufacturing_date: itemCreateInput.manufacturing_date,
        expiry_date: itemCreateInput.expiry_date,
        price: itemCreateInput.price,
        condition: itemCreateInput.condition,
        quantity_in_stock: itemCreateInput.quantity_in_stock,
        reorder_threshold: itemCreateInput.reorder_threshold,
        is_high_value: itemCreateInput.is_high_value,
        brand: itemCreateInput.brand,
        barcode: itemCreateInput.barcode,
        image_path: itemCreateInput.image_path,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        category: itemCreateInput.category
          ? {
              ...(itemCreateInput.category.create && {
                create: itemCreateInput.category.create,
              }),
              ...(itemCreateInput.category.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: itemCreateInput.category.connect,
              }),
            }
          : undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        location: itemCreateInput.location
          ? {
              ...(itemCreateInput.location.create && {
                create: itemCreateInput.location.create,
              }),
              ...(itemCreateInput.location.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: itemCreateInput.location.connect,
              }),
            }
          : undefined,
      },
      include: { category: true, location: true },
    });
  }
  update(itemID: string, itemUpdateInput: ItemUpdateInput) {
    return this.prisma.item.update({
      where: { itemId: itemID },
      data: {
        name: itemUpdateInput.name,
        manufacturing_date: itemUpdateInput.manufacturing_date,
        expiry_date: itemUpdateInput.expiry_date,
        price: itemUpdateInput.price,
        condition: itemUpdateInput.condition,
        quantity_in_stock: itemUpdateInput.quantity_in_stock,
        reorder_threshold: itemUpdateInput.reorder_threshold,
        is_high_value: itemUpdateInput.is_high_value,
        brand: itemUpdateInput.brand,
        barcode: itemUpdateInput.barcode,
        image_path: itemUpdateInput.image_path,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        category: itemUpdateInput.category
          ? {
              ...(itemUpdateInput.category.update && {
                update: itemUpdateInput.category.update,
              }),
              ...(itemUpdateInput.category.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: itemUpdateInput.category.connect,
              }),
              ...(itemUpdateInput.category.disconnect && {
                disconnect: itemUpdateInput.category.disconnect,
              }),
              ...(itemUpdateInput.category?.create && {
                create: itemUpdateInput.category.create,
              }),
            }
          : undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        location: itemUpdateInput.location
          ? {
              ...(itemUpdateInput.location.update && {
                update: itemUpdateInput.location.update,
              }),
              ...(itemUpdateInput.location.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: itemUpdateInput.location.connect,
              }),
              ...(itemUpdateInput.location.disconnect && {
                disconnect: itemUpdateInput.location.disconnect,
              }),
              ...(itemUpdateInput.location?.create && {
                create: itemUpdateInput.location.create,
              }),
            }
          : undefined,
      },
      include: { location: true, category: true },
    });
  }
  remove(itemID: string) {
    return this.prisma.item.delete({
      where: { itemId: itemID },
    });
  }
  findAll() {
    return this.prisma.item.findMany();
  }
  findOne(itemID: string) {
    return this.prisma.item.findUnique({
      where: { itemId: itemID },
    });
  }
}
