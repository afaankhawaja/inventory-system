import { Injectable } from '@nestjs/common';
import { UserCreateInput } from './../@generated/user/user-create.input';
import { UserUpdateInput } from './../@generated/user/user-update.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserInput: UserCreateInput) {
    return this.prisma.user.create({
      data: {
        userId: createUserInput.userId,
        username: createUserInput.username,
        password_hash: createUserInput.password_hash,
        phone: createUserInput.phone,
        email: createUserInput.email,
        first_name: createUserInput.first_name,
        last_name: createUserInput.last_name,
        is_active: createUserInput.is_active,
        age: createUserInput.age,
        cnic: createUserInput.cnic,
        image_path: createUserInput.image_path,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(userID: string) {
    return this.prisma.user.findUnique({
      where: { userId: userID },
    });
  }

  update(userID: string, updateUserInput: UserUpdateInput) {
    return this.prisma.user.update({
      where: {
        userId: userID,
      },
      data: {
        username: updateUserInput.username,
        email: updateUserInput.email,
        phone: updateUserInput.phone,
        first_name: updateUserInput.first_name,
        last_name: updateUserInput.last_name,
        is_active: updateUserInput.is_active,
        age: updateUserInput.age,
        cnic: updateUserInput.cnic,
        image_path: updateUserInput.image_path,
      },
    });
  }

  remove(userID: string) {
    return this.prisma.user.delete({
      where: {
        userId: userID,
      },
    });
  }
}
