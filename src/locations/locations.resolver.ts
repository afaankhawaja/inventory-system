import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import { Location } from 'src/@generated/location/location.model';
import { LocationCreateInput } from 'src/@generated/location/location-create.input';
import { LocationUpdateInput } from 'src/@generated/location/location-update.input';

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Mutation(() => Location)
  createLocation(
    @Args('locationCreateInput') locationCreateInput: LocationCreateInput,
  ) {
    return this.locationsService.create(locationCreateInput);
  }

  @Mutation(() => Location)
  updateLocation(
    @Args('locationUpdateInput') locationUpdateInput: LocationUpdateInput,
    @Args('locationID') locationID: string,
  ) {
    return this.locationsService.update(locationID, locationUpdateInput);
  }

  @Mutation(() => Location)
  removeLocation(@Args('locationID') locationID: string) {
    return this.locationsService.remove(locationID);
  }

  @Query(() => [Location], { name: 'locations' })
  findAll(
    @Args('rootsOnly', { type: () => Boolean, nullable: true })
    rootsOnly: boolean,
  ) {
    return this.locationsService.findAll(rootsOnly);
  }

  @Query(() => Location, { name: 'location' })
  findOne(@Args('locationID') locationID: string) {
    return this.locationsService.findOne(locationID);
  }

  @Query(() => [Location], { name: 'locationPath' })
  async locationPath(@Args('locationID') locationID: string) {
    return this.locationsService.getLocationPath(locationID);
  }
}
