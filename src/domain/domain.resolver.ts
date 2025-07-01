import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DomainsService } from './domain.service';
import { Domain } from 'src/@generated/domain/domain.model';
import { DomainCreateInput } from 'src/@generated/domain/domain-create.input';
import { DomainUpdateInput } from 'src/@generated/domain/domain-update.input';
import { UserDomain } from 'src/@generated/user-domain/user-domain.model';

@Resolver(() => Domain)
export class DomainsResolver {
  constructor(private readonly domainsService: DomainsService) {}

  @Mutation(() => Domain)
  createDomain(
    @Args('createDomainInput') createDomainInput: DomainCreateInput,
  ) {
    return this.domainsService.create(createDomainInput);
  }

  @Query(() => [Domain], { name: 'domains' })
  findAll() {
    return this.domainsService.findAll();
  }

  @Query(() => Domain, { name: 'domain' })
  findOne(@Args('domainID', { type: () => String }) domainID: string) {
    return this.domainsService.findOne(domainID);
  }

  @Mutation(() => Domain)
  updateDomain(
    @Args('domainID', { type: () => String }) domainID: string,
    @Args('updateDomainInput') updateDomainInput: DomainUpdateInput,
  ) {
    return this.domainsService.update(domainID, updateDomainInput);
  }

  @Mutation(() => Domain)
  removeDomain(@Args('domainID', { type: () => String }) domainID: string) {
    return this.domainsService.remove(domainID);
  }

  // Many-to-many relationship between user and domain
  @Mutation(() => UserDomain)
  assignUserToDomain(
    @Args('userId', { type: () => String }) userId: string,
    @Args('domainId', { type: () => String }) domainId: string,
  ) {
    return this.domainsService.assignUserToDomain(userId, domainId);
  }

  @Mutation(() => UserDomain)
  removeUserFromDomain(
    @Args('userId', { type: () => String }) userId: string,
    @Args('domainId', { type: () => String }) domainId: string,
  ) {
    return this.domainsService.removeUserFromDomain(userId, domainId);
  }

  // Queries for many-to-many relationships
  @Query(() => [UserDomain], { name: 'usersInDomain' })
  getUsersInDomain(@Args('domainId', { type: () => String }) domainId: string) {
    return this.domainsService.getUsersInDomain(domainId);
  }

  @Query(() => [UserDomain], { name: 'domainsForUser' })
  getDomainsForUser(@Args('userId', { type: () => String }) userId: string) {
    return this.domainsService.getDomainsForUser(userId);
  }
}
