import { Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from 'src/@generated/role/role.model';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query(() => [Role], { name: 'roles' })
  findAll() {
    return this.rolesService.findAll();
  }
}
