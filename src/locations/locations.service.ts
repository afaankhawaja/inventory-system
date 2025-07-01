import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationCreateInput } from 'src/@generated/location/location-create.input';
import { LocationUpdateInput } from 'src/@generated/location/location-update.input';
import { Prisma } from 'generated/prisma';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(locationCreateInput: LocationCreateInput) {
    return this.prisma.location.create({
      data: <Prisma.LocationCreateInput>{
        location_name: locationCreateInput.location_name,
        location_address: locationCreateInput.location_address,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        domain: locationCreateInput.domain
          ? {
              ...(locationCreateInput.domain.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: locationCreateInput.domain.connect,
              }),
              ...(locationCreateInput.domain.create && {
                create: locationCreateInput.domain.create,
              }),
            }
          : undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        parentLocation: locationCreateInput.parentLocation
          ? {
              ...(locationCreateInput.parentLocation.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: locationCreateInput.parentLocation.connect,
              }),
              ...(locationCreateInput.parentLocation.create && {
                create: locationCreateInput.parentLocation.create,
              }),
            }
          : undefined,
      },
      include: {
        domain: true,
        parentLocation: true,
        subLocations: true,
      },
    });
  }

  update(locationID: string, locationUpdateInput: LocationUpdateInput) {
    return this.prisma.location.update({
      where: { locationId: locationID },
      data: <Prisma.LocationUpdateInput>{
        location_name: locationUpdateInput.location_name,
        location_address: locationUpdateInput.location_address,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        domain: locationUpdateInput.domain
          ? {
              ...(locationUpdateInput.domain.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: locationUpdateInput.domain.connect,
              }),
              ...(locationUpdateInput.domain.disconnect && {
                disconnect: locationUpdateInput.domain.disconnect,
              }),
              ...(locationUpdateInput.domain.create && {
                create: locationUpdateInput.domain.create,
              }),
              ...(locationUpdateInput.domain.update && {
                update: locationUpdateInput.domain.update,
              }),
            }
          : undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        parentLocation: locationUpdateInput.parentLocation
          ? {
              ...(locationUpdateInput.parentLocation.connect && {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                connect: locationUpdateInput.parentLocation.connect,
              }),
              ...(locationUpdateInput.parentLocation.disconnect && {
                disconnect: locationUpdateInput.parentLocation.disconnect,
              }),
              ...(locationUpdateInput.parentLocation.create && {
                create: locationUpdateInput.parentLocation.create,
              }),
              ...(locationUpdateInput.parentLocation.update && {
                update: locationUpdateInput.parentLocation.update,
              }),
            }
          : undefined,
      },
      include: {
        domain: true,
        parentLocation: true,
        subLocations: true,
      },
    });
  }

  remove(locationID: string) {
    return this.prisma.location.delete({
      where: { locationId: locationID },
    });
  }

  findAll() {
    return this.prisma.location.findMany({
      include: {
        domain: true,
        parentLocation: true,
        subLocations: true,
      },
    });
  }

  findOne(locationID: string) {
    return this.prisma.location.findUnique({
      where: { locationId: locationID },
      include: {
        domain: true,
        parentLocation: true,
        subLocations: true,
      },
    });
  }
}
