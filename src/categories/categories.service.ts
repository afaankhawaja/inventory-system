import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryCreateInput } from 'src/@generated/category/category-create.input';
import { CategoryUpdateInput } from 'src/@generated/category/category-update.input';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(categoryCreateInput: CategoryCreateInput) {
    return this.prisma.category.create({
      data: <Prisma.CategoryCreateInput>{
        name: categoryCreateInput.name,
        description: categoryCreateInput.description,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        parent: categoryCreateInput.parent
          ? {
              ...(categoryCreateInput.parent.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: categoryCreateInput.parent.connect,
              }),
              ...(categoryCreateInput.parent.create && {
                create: categoryCreateInput.parent.create,
              }),
            }
          : undefined,
        items: categoryCreateInput.items
          ? {
              ...(categoryCreateInput.items.connect && {
                connect: categoryCreateInput.items.connect,
              }),
              ...(categoryCreateInput.items.create && {
                create: categoryCreateInput.items.create,
              }),
            }
          : undefined,
      },
      include: {
        parent: true,
        subCategories: true,
        items: true,
      },
    });
  }

  update(categoryID: string, categoryUpdateInput: CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { categoryId: categoryID },
      data: <Prisma.CategoryUpdateInput>{
        name: categoryUpdateInput.name,
        description: categoryUpdateInput.description,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        parent: categoryUpdateInput.parent
          ? {
              ...(categoryUpdateInput.parent.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: categoryUpdateInput.parent.connect,
              }),
              ...(categoryUpdateInput.parent.disconnect && {
                disconnect: categoryUpdateInput.parent.disconnect,
              }),
              ...(categoryUpdateInput.parent.create && {
                create: categoryUpdateInput.parent.create,
              }),
              ...(categoryUpdateInput.parent.update && {
                update: categoryUpdateInput.parent.update,
              }),
            }
          : undefined,
        items: categoryUpdateInput.items
          ? {
              ...(categoryUpdateInput.items.connect && {
                connect: categoryUpdateInput.items.connect,
              }),
              ...(categoryUpdateInput.items.disconnect && {
                disconnect: categoryUpdateInput.items.disconnect,
              }),
              ...(categoryUpdateInput.items.create && {
                create: categoryUpdateInput.items.create,
              }),
              ...(categoryUpdateInput.items.update && {
                update: categoryUpdateInput.items.update,
              }),
            }
          : undefined,
      },
      include: {
        parent: true,
        subCategories: true,
        items: true,
      },
    });
  }

  remove(categoryID: string) {
    return this.prisma.category.delete({
      where: { categoryId: categoryID },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        subCategories: true,
        items: true,
      },
    });
  }

  findOne(categoryID: string) {
    return this.prisma.category.findUnique({
      where: { categoryId: categoryID },
      include: {
        parent: true,
        subCategories: true,
        items: true,
      },
    });
  }
}
