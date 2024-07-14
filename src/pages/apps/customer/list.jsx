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
import { openSnackbar } from 'api/snackbar';
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
import AlertCustomerDelete from 'sections/apps/customer/AlertCustomerDelete';
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

import { useGetCustomer } from 'api/customer';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add, Edit, Eye, Trash ,Lock ,Unlock} from 'iconsax-react';
import axios from 'axios';
import { height, width } from '@mui/system';

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler, open, setData }) {
  const theme = useTheme();
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    open,
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

  const headers = columns.map((column) => ({
    label: typeof column.header === 'string' ? column.header : '#',
    key: column.accessorKey
  }));

  return (

   <>
   <>
       <Breadcrumb
  title={true}
/></>
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
            Add Vendor
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
   </>
  );
}
// ==============================|| CUSTOMER LIST ||============================== //

export default function CustomerListPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDeleteId, setCustomerDeleteId] = useState('');
  const [customerDeleteName, setCustomerDeleteName] = useState('');

  const { customers, customersLoading, customersError } = useGetCustomer();
  const [data, setData] = useState(customers || []);

  useEffect(() => {
    if (customers) {
      setData(customers);
    }
  }, [customers]);
  

  const lists = customers;

  const handleClose = () => {
    setOpen(!open);
  };

  const handleViewClick = async (vendorId) => {
    try {
      const vendorOffer = await getOfferOfVendor(vendorId);
      console.log('Vendor Offer:', vendorOffer);
    } catch (error) {
      console.error('Failed to fetch vendor offer:', error);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Vendor Name',
        accessorKey: 'name',
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              alt="Avatar"
              size="sm"
              sx={{ borderRadius: "10px",height : "60px" ,width : "60px"}}
              src={row.original.logo} // Assuming `logo` is the field in your data containing the logo URL
            />
            <Stack spacing={0}>
              <Typography variant="subtitle1">{getValue()}</Typography>
              <Typography color="text.secondary">{row.original.email}</Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Description',
        accessorKey: 'description'
      },
      {
        header: 'Category',
        accessorKey: 'category.categoryName'
      },
      // {
      //   header: 'Status',
      //   accessorKey: 'isActive',
      //   cell: ({ row }) => {
      //     return row.original.isActive
      //       ? <Chip color="success" label="Active" size="small" variant="light" />
      //       : <Chip color="error" label="Inactive" size="small" variant="light" />;
      //   }
      // },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const [isBlocked, setIsBlocked] = useState(row.original.isActive);
  
          const handleBlockUnblock = async () => {
            const userId = row.original._id;
            const isActive = !isBlocked;
            try {
              const token = localStorage.getItem('authToken');
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              };
  
              const response = await axios.patch(`${baseUrl}/v1/vendor/${userId}/status`, { isActive }, config);
              if (response.status === 200 && !response.data.error) {
                const updatedVendor = response.data.data;
                setIsBlocked(isActive);
  
                // Update the state with the new data
                setData((prevData) => prevData.map((vendor) =>
                  vendor._id === updatedVendor._id ? updatedVendor : vendor
                ));
                openSnackbar({
                  open: true,
                  message: `Vendor has successfully ${(isActive) ? "UnBlocked" : "Blocked"}`,
                  variant: 'alert',
  
                  alert: {
                      color: 'success'
                  }
              });
  
                // Optionally refetch the data using SWR
                mutate(`${baseUrl}/v1/vendor/getVendorAdmin?limit=9999&page=1`);
              
              }
            } catch (error) {
              console.error('Failed to block/unblock user', error);
            }
          };
  
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? (
              <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
            ) : (
              <Eye />
            );
  
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title={isBlocked ? 'Unblock' : 'Block'}>
                <IconButton
                  color={isBlocked ? 'secondary' : 'primary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBlockUnblock();
                  }}
                >
                  {isBlocked ? <Unlock /> : <Lock />}
                </IconButton>
              </Tooltip>
              <Tooltip title="View">
                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>
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
                    handleClose();
                    setCustomerDeleteId(row.original._id);
                    setCustomerDeleteName(row.original?.name);
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ], // eslint-disable-next-line
    [theme]
  );
  

  if (customersLoading) return <EmptyReactTable />;

  return (
    <>
      <ReactTable
        {...{
          data: lists,
          open:open,
          columns,
          modalToggler: () => {
            setCustomerModal(true);
            setSelectedCustomer(null);
          }
        }}
      />
      <AlertCustomerDelete id={customerDeleteId} title={customerDeleteName} open={open} handleClose={handleClose} />
      <CustomerModal open={customerModal} modalToggler={setCustomerModal} customer={selectedCustomer} />
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func,open :PropTypes.any};
