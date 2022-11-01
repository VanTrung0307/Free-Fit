import { Table, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import * as React from 'react';

interface useTableProps {
  headCells: any;
}
export function useTableNotPaging({ headCells }: useTableProps) {
  const TblContainer: any = (props: any) => (
    <Table className="items-center w-full bg-transparent border-collapse" size="small">
      {props.children}
    </Table>
  );
  // functions
  const TblHead: any = (props) => (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={false}
            style={{ color: 'primary', textAlign: headCell.align ? headCell.align : 'left' }}
          >
            {headCell.disableSorting ? (
              headCell.label
            ) : (
              <TableSortLabel hideSortIcon active={false} direction="asc">
                {headCell.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  return { TblContainer, TblHead };
}
