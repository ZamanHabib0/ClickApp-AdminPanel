import PropTypes from 'prop-types';
import { useMemo, useState, Fragment, useEffect } from 'react';

const baseUrl = import.meta.env.VITE_APP_API_URL;
// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Breadcrumb from 'components/@extended/Breadcrumbs';

// third-party
import { PatternFormat } from 'react-number-format';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import CustomerModal from 'sections/apps/customer/CustomerModal';
import CategoryModal from 'sections/apps/customer/CategoryModal';
import AlertCustomerDelete from 'sections/apps/customer/AlertCategoryDelete';
import CustomerView from 'sections/apps/customer/CustomerView';
import EmptyReactTable from 'pages/tables/react-table/empty';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

import { useGetCustomer, insertCustomer, updateCustomer, deleteCustomer } from 'api/category';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add, Edit, Eye, Trash, Lock, Unlock } from 'iconsax-react';
import axios from 'axios';

function ReactTable({ columns, modalToggler, data, open }) {
  const theme = useTheme();
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

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

  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  let headers = [];
  columns.map(
    (columns) =>
      // @ts-ignore
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-ignore
        key: columns.accessorKey
      })
  );

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
            Add Category
          </Button>
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
                    {headerGroup.headers.map((header) => {
                      if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                        Object.assign(header.column.columnDef.meta, {
                          className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                        });
                      }

                      return (
                        <TableCell
                          key={header.id}
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() &&
                            header.column.columnDef.meta === undefined && {
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
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` }, overflow: 'hidden' }}>
                        <TableCell colSpan={row.getVisibleCells().length} sx={{ p: 2.5, overflow: 'hidden' }}>
                          <CustomerView data={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
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
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func, open: PropTypes.any };

const CustomerListPage = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDeleteId, setCustomerDeleteId] = useState('');
  const [customerTitle, setCustomerTitle] = useState('');

  const { customers, customersLoading, customersError, customersValidating } = useGetCustomer();


  const data = customers || [];

  const handleClose = () => {
    setOpen(!open);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      setCustomerDeleteId('');
      setCustomerTitle('');
      handleClose();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Category Image',
        accessorKey: 'image',
        cell: ({ cell }) => <img src={cell.getValue()} alt="category" style={{ width: '50px', height: '50px', borderRadius: '10px' }} />
      },
      {
        header: 'Category Name',
        accessorKey: 'categoryName'
      },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCustomer(row.original);
                  setCustomerModal(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  setCustomerDeleteId(row.original._id);
                  setCustomerTitle(row.original.categoryName);
                  handleClose();
                }}
              >
                <Trash />
              </IconButton>
            </Tooltip>
          </>
        )
      }
    ],
    [theme]
  );

  useEffect(() => {
    if (customersValidating) return;

    if (customersLoading) {
      // Handle loading state
    } else if (customersError) {
      // Handle error state
    }
  }, [customersLoading, customersError, customersValidating]);

  return (
    <>
    <Breadcrumb
  title={true}
/>
      <ReactTable
        {...{
          columns,
          open,
          data,
          modalToggler: () => {
            setCustomerModal(true);
            setSelectedCustomer(null);
          }
        }}
      />
      <AlertCustomerDelete
        id={customerDeleteId}
        title={customerTitle}
        open={open}
        handleClose={handleClose}
        handleDelete={() => handleDeleteCustomer(customerDeleteId)}
      />
      <CategoryModal
        open={customerModal}
        modalToggler={setCustomerModal}
        customer={selectedCustomer}
        handleCustomerUpdate={updateCustomer}
        handleCustomerInsert={insertCustomer}
      />
    </>
  );
};

export default CustomerListPage;
