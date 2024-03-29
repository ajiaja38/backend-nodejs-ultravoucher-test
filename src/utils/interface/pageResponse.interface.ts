export interface PaginationResponseInterface<T> {
  totalPages: number;
  page: number;
  totalData: number;
  data: T[];
}
