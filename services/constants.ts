export enum ApiRoutes {
  APARTMENTS = '/apartments',
  SALE_APART = '/saleApart',
  OWNERS = '/owners',
  USERS = '/users',
}

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
