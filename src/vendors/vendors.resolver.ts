import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VendorsService } from './vendors.service'; // Corrected service name
import { Vendor } from 'src/@generated/vendor/vendor.model';
import { VendorCreateInput } from 'src/@generated/vendor/vendor-create.input';
import { VendorUpdateInput } from 'src/@generated/vendor/vendor-update.input';

@Resolver(() => Vendor)
export class VendorsResolver {
  constructor(private readonly vendorsService: VendorsService) {}

  @Mutation(() => Vendor)
  createVendor(
    @Args('vendorCreateInput') vendorCreateInput: VendorCreateInput,
  ) {
    return this.vendorsService.create(vendorCreateInput);
  }

  @Mutation(() => Vendor)
  updateVendor(
    @Args('vendorUpdateInput') vendorUpdateInput: VendorUpdateInput,
    @Args('vendorID') vendorID: string,
  ) {
    return this.vendorsService.update(vendorID, vendorUpdateInput);
  }

  @Mutation(() => Vendor)
  removeVendor(@Args('vendorID') vendorID: string) {
    return this.vendorsService.remove(vendorID);
  }

  @Query(() => [Vendor], { name: 'vendors' })
  findAll() {
    return this.vendorsService.findAll();
  }

  @Query(() => Vendor, { name: 'vendor' })
  findOne(@Args('vendorID') vendorID: string) {
    return this.vendorsService.findOne(vendorID);
  }
}
