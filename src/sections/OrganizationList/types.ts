export type OrganizationStatus = 'all' | 'active' | 'archived';

export type IOrganizationTableFilter = {
  search: string;
  status: OrganizationStatus;
};

export type IOrganizationPrismaFilter = {
  OR?: any;
  deletedAt?: any;
};
