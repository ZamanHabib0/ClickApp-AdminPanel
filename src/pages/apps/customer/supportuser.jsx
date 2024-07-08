import PropTypes from 'prop-types';
import { useMemo, useState, Fragment, useEffect } from 'react';

const baseUrl = import.meta.env.VITE_APP_API_URL
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
import AlertCustomerDelete from 'sections/apps/customer/supportDelete';
import CustomerView from 'sections/apps/customer/CustomerView';
import EmptyReactTable from 'pages/tables/react-table/empty';
import { useGetCustomer } from 'api/support';


import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add, Edit, Eye, Trash ,Lock ,Unlock} from 'iconsax-react';
import axios from 'axios';

function ReactTable({ columns, modalToggler }) {
  const theme = useTheme();
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState([]);

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

  const { customers, customersLoading, customersError } = useGetCustomer();
  useEffect(() => {
    if (customers) {
      setData(customers);
    }
  }, [customers]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
   
  //   const token = localStorage.getItem('authToken');
        
  //      // Configure request headers with token
  //      const config = {
  //       headers: {
  //         'Authorization': `Bearer ${token}`, // Assuming token is in the format 'Bearer <token>'
  //         'Content-Type': 'application/json'
  //       }
  //     };

  //       const response = await axios.get(`${baseUrl}/v1/adminpanel/getFeedback`,config);
  //       setData(response.data.data); // Adjust according to the structure of your API response

  //       console.log("data" + data)
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
        />

      
        {/* <CSVExport
            {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'customer-list.csv' }}
          /> */}
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


export default function CustomerListPage() {
  const theme = useTheme();
  const { customersLoading: loading, customers: lists, setCustomers } = useGetCustomer();

  const [open, setOpen] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDeleteId, setCustomerDeleteId] = useState('');

  const handleClose = () => {
      setOpen(!open);
  };

  const handleCustomerSubmit = async (newCustomer) => {
      try {
          let response;
          if (newCustomer._id) {
              response = await updateCustomer(newCustomer._id, newCustomer);
              openSnackbar({ open: true, message: 'Category updated successfully.', variant: 'alert', alert: { color: 'success' } });
          } else {
              response = await insertCustomer(newCustomer);
              openSnackbar({ open: true, message: 'Category added successfully.', variant: 'alert', alert: { color: 'success' } });
          }

          // Fetch updated customers list after a successful operation
          const updatedCustomers = await fetchCustomersAPI();
          setCustomers(updatedCustomers.data);
      } catch (error) {
          console.error(error);
      }
  };

  const columns = useMemo(() => [
      {
          header: 'Name',
          accessorKey: 'fullName',
      },
      {
          header: 'Email',
          accessorKey: 'email',
      },
      {
        header: 'Message',
        accessorKey: 'message',
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
                          }}
                      >
                          <Trash />
                      </IconButton>
                  </Tooltip>
              </>
          )
      }
  ], [theme]);

  if (loading) return <EmptyReactTable />;

  return (
      <>
          <ReactTable
              {...{
                  columns,
                  data: lists,
                  modalToggler: () => {
                      setCustomerModal(true);
                      setSelectedCustomer(null);
                  }
              }}
          />
          <AlertCustomerDelete id={customerDeleteId} title={customerDeleteId} open={open} handleClose={handleClose} />
          <CategoryModal open={customerModal} modalToggler={setCustomerModal} customer={selectedCustomer} onSubmit={handleCustomerSubmit} />
      </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func };

