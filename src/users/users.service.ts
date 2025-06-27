import { Injectable } from '@nestjs/common';
import { UserCreateInput } from './../@generated/user/user-create.input';
import { UserUpdateInput } from './../@generated/user/user-update.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { encrypt } from 'src/helpers/crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserInput: UserCreateInput) {
    let encryptedPassword;
    if (createUserInput?.password_hash) {
      encryptedPassword = encrypt(createUserInput?.password_hash);
    }

    return this.prisma.user.create({
      data: {
        userId: createUserInput.userId,
        username: createUserInput.username,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password_hash: encryptedPassword,
        phone: createUserInput.phone,
        email: createUserInput.email,
        first_name: createUserInput.first_name,
        last_name: createUserInput.last_name,
        is_active: createUserInput.is_active,
        age: createUserInput.age,
        cnic: createUserInput.cnic,
        image_path: createUserInput.image_path,
        role: createUserInput.role
          ? {
              ...(createUserInput.role.create && {
                create: createUserInput.role.create,
              }),
              ...(createUserInput.role.connect && {
                connect: createUserInput.role.connect,
              }),
            }
          : undefined,
      },
      include: { role: true },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(userID: string) {
    return this.prisma.user.findUnique({
      where: { userId: userID },
      include: { role: true },
    });
  }
  findOneByUserName(username: string) {
    return this.prisma.user.findUnique({
      where: { username: username },
      include: { role: true },
    });
  }

  update(userID: string, updateUserInput: UserUpdateInput) {
    let encryptedPassword: string | undefined;
    const pwd_field = updateUserInput.password_hash;
    if (pwd_field?.set) {
      encryptedPassword = encrypt(pwd_field?.set);
    }
    return this.prisma.user.update({
      where: {
        userId: userID,
      },
      include: { role: true },
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password_hash: encryptedPassword,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        refresh_token: updateUserInput.refresh_token,
        role: updateUserInput.role
          ? {
              ...(updateUserInput.role.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: updateUserInput.role.connect,
              }),
              ...(updateUserInput.role.disconnect && {
                disconnect: updateUserInput.role.disconnect,
              }),
              ...(updateUserInput.role.update && {
                update: updateUserInput.role.update,
              }),
            }
          : undefined,
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
