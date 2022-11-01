import {
  Grid,
  Table,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { PaginationRequest, Response } from 'models';
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router';

interface useTableProps {
  rs: Response<any>;
  headCells: any;
  filter: PaginationRequest;
  onPageChange: (newPage: number) => void;
  onRowPerPageChange: (perPage: number) => void;
  onSortChange: (colName: string, sortType: number) => void;
}
// global const
const PAGES = [10, 15, 20, 50];
const SORT_TYPE_ASC = 0;
const SORT_TYPE_DESC = 1;

export function useTable({
  rs,
  headCells,
  filter,
  onPageChange,
  onRowPerPageChange,
  onSortChange,
}: useTableProps) {
  const { colName, sortType } = filter;
  let order: any;
  sortType === SORT_TYPE_ASC ? (order = 'asc') : (order = 'desc');

  const TblContainer: any = (props: any) => (
    <Table className="items-center w-full bg-transparent border-collapse" size="small">
      {props.children}
    </Table>
  );
  const { pageNumber, pageSize, totalNumberOfRecords } = rs;
  const navigate = useNavigate();
  const location = useLocation();
  localStorage.setItem('page', pageNumber.toString());
  React.useEffect(() => {
    navigate(`${location.pathname}?page=${pageNumber}`);
  }, [pageNumber, location.pathname]);
  // functions
  const handelPageChange = (event, newPage: number) => {
    onPageChange(newPage);
  };
  const handelRowPerPageChange = (event) => {
    onRowPerPageChange(event.target.value);
  };
  // const handelPagingNumberChange = (e: any, page: number) => {
  //   onPageChange(page - 1);
  // };
  const TblHead: any = (props) => {
    const handleSortRequest = (cellId) => {
      order === 'desc' ? (order = 'asc') : (order = 'desc');
      const isAsc = colName === cellId && order === 'asc';
      const sort = isAsc ? SORT_TYPE_ASC : SORT_TYPE_DESC;
      onSortChange(cellId, sort);
    };
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              sortDirection={colName === headCell.id ? order : false}
              style={{ color: 'primary', textAlign: headCell.align ? headCell.align : 'left' }}
            >
              {headCell.disableSorting ? (
                headCell.label
              ) : (
                <TableSortLabel
                  hideSortIcon
                  active={colName === headCell.id}
                  direction={colName === headCell.id ? order : 'asc'}
                  onClick={() => {
                    handleSortRequest(headCell.id);
                  }}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };
  const TblPagination: any = (props) => (
    <Grid container justifyContent="center" alignContent="center" alignItems="center">
      {/* <Grid item xs={12} md={6}>
        <Pagination
          color="standard"
          count={totalNumberOfPages}
          page={pageNumber}
          showFirstButton
          showLastButton
          onChange={handelPagingNumberChange}
        />
      </Grid> */}
      <Grid item xs={12} md={12}>
        <TablePagination
          onPageChange={handelPageChange}
          component="div"
          rowsPerPageOptions={PAGES}
          page={pageNumber - 1}
          rowsPerPage={pageSize}
          count={totalNumberOfRecords}
          onRowsPerPageChange={handelRowPerPageChange}
        />
      </Grid>
    </Grid>
  );
  return { TblContainer, TblHead, TblPagination };
}
