export interface PaginationRequest {
  page?: number;
  pageSize?: number;
  keySearch?: string;
  sortType?: number;
  colName?: string;
}
export interface Response<T> {
  pageNumber: number;
  pageSize: number;
  totalNumberOfPages: number;
  totalNumberOfRecords: number;
  results: T[];
}
