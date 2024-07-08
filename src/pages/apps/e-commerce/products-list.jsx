import PropTypes from 'prop-types';
import { useMemo, useState, Fragment, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import moment from 'moment';

 
const baseUrl = import.meta.env.VITE_APP_API_URL
// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import capitalize from '@mui/utils/capitalize';
import { openSnackbar } from 'api/snackbar';

// third-party
import { NumericFormat } from 'react-number-format';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import ProductView from 'sections/apps/e-commerce/product-list/ProductView';
import {
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

import { APP_DEFAULT_PATH } from 'config';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

import { useGetCustomer } from 'api/userTable';


// assets
import { Add, Edit, Eye, Trash,Lock,Unlock } from 'iconsax-react';
import axios from 'axios';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({  columns }) {
  const theme = useTheme();

  const [sorting, setSorting] = useState([
    {
      id: 'name',
      desc: false
    }
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [data,setData]=useState([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: fuzzyFilter,
    debugTable: true
  });

  const { customers, customersLoading, customersError } = useGetCustomer();

  useEffect(() => {
    if (customers) {
      setData(customers);
    }
  }, [customers]);

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

  const history = useNavigate();

  const handleAddProduct = () => {
    history(`/apps/e-commerce/add-new-product`);
  };

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data?.length} records...`}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          {/* <Button variant="contained" startIcon={<Add />} onClick={handleAddProduct} size="large">
            Add Product
          </Button> */}
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          {/* <RowSelection selected={Object.keys(rowSelection).length} /> */}
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
                      <TableRow sx={{ '&:hover': { bgcolor: `${backColor} !important` } }}>
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <ProductView data={row.original} />
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
                  getPageCount: table.getPageCount,
                  initialPageSize: 10
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| PRODUCT LIST ||============================== //

export default function ProductList() {
  const products = useLoaderData();

  const columns = useMemo(
    () => [
    
      {
        header: 'fullName',
        accessorKey: 'belongTo.fullName',
        meta: {
          className: 'cell-left'  // Remove this line or change 'cell-right' to align left
        },
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center" >
            <Avatar
              variant="rounded"
              alt={getValue()}
              color="secondary"
              size="sm"
              src={getImageUrl(`thumbs/${!row.original.image ? 'prod-11.png' : row.original.image}`, ImagePath.ECOMMERCE)}
            />
            <Stack spacing={0}>
              <Typography variant="subtitle1">{getValue()}</Typography>
              <Typography variant="caption" color="text.secondary">
                {row.original.description}
              </Typography>
            </Stack>
          </Stack>
        )
      },
      {
        header: 'Email',
        accessorKey: 'belongTo.email',
        meta: {
          className: 'cell-left'  // Remove this line or change 'cell-right' to align left
        }
      },
      {
        header: 'Remaining Offers',
        accessorKey: 'remainingOffers',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Expiration Date',
        accessorKey: 'expirationDate',
        meta: {
          className: 'cell-center'
        },
        cell: ({ getValue }) => moment(getValue()).format('YYYY-MM-DD')
      },
    //   {
    //     header: 'Status',
    //     accessorKey: 'belongTo.isBlock',
    //     meta: {
    //       className: 'cell-center'
    //     },
      
    // cell: ({ getValue }) => getValue() ? 'Inactive' : 'Active'
    //   },
      
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        cell: ({ row }) => {
          const [isBlocked, setIsBlocked] = useState(row.original.belongTo.isBlock);

          const handleBlockUnblock = async () => {
            const userId = row.original.belongTo._id;
            const isBlock = !isBlocked;
            try {
              const token = localStorage.getItem('authToken');

              const config = {
                headers: {
                  'Authorization': `Bearer ${token}`, // Assuming token is in the format 'Bearer <token>'
                  'Content-Type': 'application/json'
                }
              };
              const response = await axios.patch(`${baseUrl}/v1/adminUser/${userId}/block`, {
                userId,
                isBlock
              },config);
              if (response.status === 200) {
                setIsBlocked(isBlock);
              }  openSnackbar({
                open: true,
                message: `User has successfully ${(isBlock) ? "Blocked" : "Unblocked"}`,
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
     
            } catch (error) {
              // Handle error
              console.error('Failed to block/unblock user', error);
            }
          };

          const collapseIcon = row.getCanExpand() && row.getIsExpanded() ? <Add style={{ transform: 'rotate(45deg)' }} /> : <Eye />;
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title={isBlocked ? 'Block' : 'Unblock' }>
                <IconButton
                  color={isBlocked ? 'primary' : 'secondary' }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBlockUnblock();
                  }}
                >
                  {isBlocked ? <Lock/> : < Unlock/>}
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    []
  );

  return (
    <>
      {/* <Breadcrumbs custom heading="Users List" links={breadcrumbLinks} /> */}
      <ReactTable {...{ data: products, columns }} />
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array };
