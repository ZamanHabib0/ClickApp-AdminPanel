// CustomerListPage.js
import React, { useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { useGetCustomer } from 'api/membershupNumber';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import {
  Stack,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Divider,
  Box,
} from '@mui/material';
import { Add, Trash } from 'iconsax-react';
import { flexRender } from '@tanstack/react-table';
import DebouncedInput from 'components/third-party/react-table/DebouncedInput';
import SelectColumnSorting from 'components/third-party/react-table/SelectColumnSorting';
import RowSelection from 'components/third-party/react-table/RowSelection';
import TablePagination from 'components/third-party/react-table/TablePagination';
import IconButton from 'components/@extended/IconButton';
import CategoryModal from 'sections/apps/customer/memberShipNumberModel';
import AlertCustomerDelete from 'sections/apps/customer/membershipnumberDelete';
import CustomerView from 'sections/apps/customer/CustomerView';

import {
  // flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import Breadcrumb from 'components/@extended/Breadcrumbs';


import {
  // CSVExport,
  // DebouncedInput,
  CSVExport,
  CSVImportExport,
  HeaderSort,
  IndeterminateCheckbox,
  // RowSelection,
  // SelectColumnSorting,
  // TablePagination
} from 'components/third-party/react-table';

// import { useGetCustomer } from 'api/membershupNumber';
// import { ImagePath, getImageUrl } from 'utils/getImageUrl';

const CustomerListPage = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDeleteId, setCustomerDeleteId] = useState('');
  const [customerTitle, setCustomerTitle] = useState('');
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const { customers, customersLoading, customersError } = useGetCustomer();

  const handleClose = () => {
    setOpen(!open);
  };

  const headers = [
    { label: "Membership Number", key: "memberShipNumber" },
    { label: "isRedeem", key: "isRedeem" }
  ];

  const columns = useMemo(() => [
    {
      header: 'MemberShip Number',
      accessorKey: 'memberShipNumber',
    },
    {
      header: 'isRedeem',
      accessorKey: 'isRedeem',
    },
    {
      header: 'Actions',
      meta: {
        className: 'cell-center'
      },
      disableSortBy: true,
      cell: ({ row }) => (
        <>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
                setCustomerDeleteId(row.original._id);
                setCustomerTitle(row.original.memberShipNumber);
              }}
            >
              <Trash />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ], [theme]);

  const data = customers || [];

  if (customersLoading) return <div>Loading...</div>;
  if (customersError) return <div>Error loading data...</div>;

  const ReactTable = ({ columns, data }) => {
    const table = useReactTable({
      data,
      columns,
      state: {
        columnFilters,
        sorting,
        rowSelection,
        globalFilter
      },
      enableRowSelection: true,
      onSortingChange: setSorting,
      onRowSelectionChange: setRowSelection,
      onGlobalFilterChange: setGlobalFilter,
      onColumnFiltersChange: setColumnFilters,
      getRowCanExpand: () => true,
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      debugTable: true
    });

    return (
      <MainCard content={false} >
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
          <DebouncedInput
            value={globalFilter ?? ''}
            onFilterChange={(value) => setGlobalFilter(String(value))}
            placeholder={`Search ${data.length} records...`}
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
            <Button variant="contained" startIcon={<Add />} onClick={() => setCustomerModal(true)} size="large">
              Generate Number
            </Button>
            <CSVImportExport {...{ data: data, headers, filename: 'Report.csv' }} />
            <CSVExport {...{ data: data, headers, filename: 'Report.csv' }} />
          </Stack>
          
        </Stack>
        <ScrollX>
          <Stack>
            <RowSelection selected={Object.keys(rowSelection).length} />
            <TableContainer>
              <Table>
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell
                          key={header.id} 
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() && header.column.columnDef.meta === undefined && {
                            className: 'cursor-pointer prevent-select'
                          })}
                        >
                          {header.isPlaceholder ? null : (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                              {header.column.getCanSort() && <HeaderSort column={header.column} />}
                            </Stack>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.getIsExpanded() && (
                        <TableRow sx={{ bgcolor: alpha(theme.palette.primary.lighter, 0.1), '&:hover': { bgcolor: `${alpha(theme.palette.primary.lighter, 0.1)} !important` }, overflow: 'hidden' }}>
                          <TableCell colSpan={row.getVisibleCells().length} sx={{ p: 2.5, overflow: 'hidden' }}>
                            <CustomerView data={row.original} />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <>
              <Divider />
              <Box sx={{ p: 2 }}>
                <TablePagination
                  {...{
                    setPageSize: table.setPageSize,
                    setPageIndex: table.setPageIndex,
                    getState: table.getState,
                    getPageCount: table.getPageCount
                  }}
                />
              </Box>
            </>
          </Stack>
        </ScrollX>
      </MainCard>
    );
  };

  return (
    <>
         <>
    <Breadcrumb
  title={true}
/></>
      <ReactTable columns={columns} data={data} />
      <AlertCustomerDelete id={customerDeleteId} title={customerTitle} open={open} handleClose={handleClose} />
      <CategoryModal open={customerModal} modalToggler={setCustomerModal} customer={selectedCustomer} />
    </>
  );
};

export default CustomerListPage;
