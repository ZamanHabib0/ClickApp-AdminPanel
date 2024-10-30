import PropTypes from 'prop-types';
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui

import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import { Add, Edit, Eye, Trash, Lock, Unlock } from 'iconsax-react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from 'components/@extended/IconButton';
import OfferModal from './FormModal';
import axios from 'axios'
const baseUrl = import.meta.env.VITE_APP_API_URL;
import { openSnackbar } from 'api/snackbar';

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

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';
// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Transitions from 'components/@extended/Transitions';
import InvoiceUserList from '../../../sections/apps/invoice/InvoiceCard'
import DOMPurify from 'dompurify';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import ScrollX from 'components/ScrollX';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';

// data
import { useGetCustomer } from 'api/offer';
import CustomerPreview from './CustomerPreview';
import AlertOfferDelete from './AlertOfferDelete';

// ==============================|| CUSTOMER - VIEW ||============================== //

function ReactTable({ columns, modalToggler, OfferData, open }) {
  const theme = useTheme();
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: OfferData,
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
          placeholder={`Search ${OfferData.length} records...`}
        />
        <Stack direction="row" alignItems="center" spacing={2}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
            Add Offer
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

ReactTable.propTypes = { OfferData: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func, open: PropTypes.any };



export default function CustomerView({ data }) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));


  function chunkArray(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, index * size + size)
    );
  }

  const chunkedMenu = data?.menu ? chunkArray(data.menu, 4) : [];
  const chunkedGallery = data?.gallery ? chunkArray(data.gallery, 4) : [];

  const sanitizedHTML = DOMPurify.sanitize(data.termsAndCondition);
  const [open, setOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  // const { customers, customersLoading, customersError, customersValidating } = useGetCustomer({ vendorId: "66956a9415e8ef861baabdb1" });
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState(null);
  const [customersValidating, setCustomersValidating] = useState(false);
  const [customersEmpty, setCustomersEmpty] = useState(true);

  const vendorId = data._id;
  const customerData = useGetCustomer({ vendorId });

  useEffect(() => {
    setCustomers(customerData.customers);
    setCustomersLoading(customerData.customersLoading);
    setCustomersError(customerData.customersError);
    setCustomersValidating(customerData.customersValidating);
    setCustomersEmpty(customerData.customersEmpty);
  }, [customerData]);

  const OfferData = customers || [];

  const handleClickOpen = () => {

    setOpen(true);
  };

  const [customerDeleteId, setCustomerDeleteId] = useState('');
  const [customerTitle, setCustomerTitle] = useState('');
  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customer, setCustomer] = useState({});




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

  const editCustomer = () => {
    setSelectedCustomer(selectedCustomer);
    setCustomerModal(true);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Offer Image',
        accessorKey: 'image',
        cell: ({ cell }) => <img src={cell.getValue()} alt="Offer Image" style={{ width: '70px', height: '70px', borderRadius: '10px' }} />
      },
      {
        header: 'Offer Name',
        accessorKey: 'title'
      },
      {
        header: 'OFFER TYPE',
        accessorKey: 'offerType'
      },
      {
        header: 'QR CODE',
        accessorKey: 'qrCode',
        cell: ({ cell }) => <img src={cell.getValue()} alt="Qr Code" style={{ width: '70px', height: '70px', borderRadius: '10px' }} />
      },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const [isBlocked, setIsBlocked] = useState(row.original.isDisable);


          const handleBlockUnblock = async () => {

            const offerId = row.original._id;
            const isDisable = !isBlocked;
            try {
              const token = localStorage.getItem('authToken');
        
              const config = {
                headers: {
                  'Authorization': `Bearer ${token}`, // Assuming token is in the format 'Bearer <token>'
                  'Content-Type': 'application/json'
                }
              };
              const response = await axios.patch(`${baseUrl}/v1/vendor/${offerId}/updateOfferStatus`, {
        
                isDisable
              }, config);
              if (response.status === 200) {
                openSnackbar({
                  open: true,
                  message: response.data.msg,
                  variant: 'alert',
        
                  alert: {
                      color: 'success'
                  }
              });
                // window.location.reload();
                setIsBlocked(isDisable);
               
              }else{
                openSnackbar({
                  open: true,
                  message: 'Your Offer is Expired Kiendly update the date first',
                  variant: 'alert',
        
                  alert: {
                      color: 'error'
                  }
              });
              }
            } catch (error) {
              // Handle error
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
                  color={isBlocked ? 'primary' : 'secondary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBlockUnblock();
                  }}
                >
                  {isBlocked ?  <Unlock  /> : <Lock /> }
                </IconButton>
              </Tooltip>
              <Tooltip title="View">
                <IconButton color="secondary"
                  //  onClick={handleClickOpen}
                  onClick={() => {
                    // e.stopPropagation();
                    setCustomer(row.original);
                    // handleClickOpen();
                    setOpenPreview(true);

                  }}
                >
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
                    setCustomerDeleteId(row.original._id);
                    setCustomerTitle(row.original.title);
                    handleClose();
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
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
    <Transitions type="slide" direction="down" in={true}>
      <Grid container spacing={1} sx={{ pl: { xs: 0, sm: 4, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12} sm={7} md={7} lg={3} xl={3}>
          <MainCard title="Profile">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack spacing={2.5} alignItems="center">
                  <Avatar
                    alt="Avatar 1"
                    size="xl"
                    src={data?.logo}
                    sx={{
                      width: 120, // Adjust size as needed
                      height: 100, // Adjust size as needed
                      borderRadius: 2 // This ensures a square shape
                    }}
                  />
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5">{data.fatherName}</Typography>
                    <Typography color="secondary">{data.role}</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>


              <Grid item xs={12} spacing={0.5}>

                <Stack spacing={0.5}>
                  <Typography color="secondary" variant='h5'>Instagram Page</Typography>
                  <Typography>{(data.instagramPage) ? data?.instagramPage : "no page avaliable"}</Typography>
                </Stack>

                <Stack spacing={0.5}>
                  <Typography color="secondary" variant='h5'>Facebook Page</Typography>
                  <Typography>{(data.facebookPage) ? data?.facebookPage : "no page avaliable"}</Typography>
                </Stack>

                <Stack spacing={0.5}>
                  <Typography color="secondary" variant='h5'>Website </Typography>
                  <Typography>{(data.website) ? data?.website : "no website avaliable"}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={9}>
          <Stack spacing={2.5}>
            <MainCard title="Vendor Details">
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" variant='h5'>Full Name</Typography>
                        <Typography>{data?.name}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" variant='h5'>Description</Typography>
                        <Typography>
                          {data.description}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" variant='h5'>Category Name</Typography>
                        <Typography>{data?.category?.categoryName

                        }</Typography>
                      </Stack>

                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" variant='h5'>Vendor Type</Typography>
                        <Typography>
                          {data.vendorType}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </MainCard>
            <MainCard title="Branches">
              {data?.branches?.map((branch) => (
                <List key={branch.id}>
                  <ListItem divider={!matchDownMD}>
                    <Grid container spacing={3} alignItems="flex-start">
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary" variant='h5'>
                            Branch Address
                          </Typography>
                          <Typography>{branch?.address}</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary" variant='h5'>
                            Contact
                          </Typography>
                          <Typography>{branch?.telephone}</Typography>
                        </Stack>
                      </Grid>

                    </Grid>

                  </ListItem>
                </List>
              ))}
            </MainCard>



            <Grid item xs={12}>
              <InvoiceUserList availableServices={data.availableServices} />
            </Grid>


            <MainCard title="Menu Images">
              <Stack spacing={2}> {/* Stack for vertical spacing */}
                {chunkedMenu.map((chunk, index) => (
                  <Stack key={index} spacing={2} direction="row"> {/* Stack to display three items horizontally */}
                    {chunk.map((imageUrl, idx) => (
                      <List key={`${index}-${idx}`}>
                        <ListItem divider>
                          <Grid item xs={12}>
                            <Stack spacing={0.5} direction="row" alignItems="center">
                              <Link target="_blank" href={`${imageUrl}`} passHref>
                                <Avatar
                                  alt={`Menu Image ${index * 3 + idx + 1}`}
                                  variant="rounded"
                                  src={imageUrl}
                                  sx={{
                                    width: 100,
                                    height: 100,
                                    border: '2px solid #ccc',  // Example border style, adjust as needed
                                  }}
                                /></Link>
                            </Stack>
                          </Grid>
                        </ListItem>
                      </List>
                    ))}
                  </Stack>
                ))}
              </Stack>
            </MainCard>


            <MainCard title="Gallery Images">
              <Stack spacing={2}>
                {chunkedGallery.map((chunk, index) => (
                  <Stack key={index} spacing={2} direction="row">
                    {chunk.map((imageUrl, idx) => (
                      <List key={`${index}-${idx}`}>
                        <ListItem divider>
                          <Grid item xs={12}>
                            <Stack spacing={0.5} direction="row" alignItems="center">
                              {/* Wrap Avatar with Link or <a> tag */}
                              <Link target="_blank" href={`${imageUrl}`} passHref>
                                <a > {/* Opens link in a new tab */}
                                  <Avatar
                                    alt={`Menu Image ${index * 3 + idx + 1}`}
                                    variant="rounded"
                                    src={imageUrl}
                                    sx={{
                                      width: 100,
                                      height: 100,
                                      border: '2px solid #ccc',  // Example border style, adjust as needed
                                    }}
                                  />
                                </a>
                              </Link>
                            </Stack>
                          </Grid>
                        </ListItem>
                      </List>
                    ))}
                  </Stack>
                ))}
              </Stack>
            </MainCard>



            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: "20px" }}>
              <MainCard title="Terms & Conditions">
                <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
              </MainCard>
            </div>


          </Stack>
        </Grid>
      </Grid>

      {/* offer table  */}

      <ReactTable
        {...{
          columns,
          open,
          OfferData,
          modalToggler: () => {
            setCustomerModal(true);
            setSelectedCustomer(null);
          }
        }}
      />

      <AlertOfferDelete
        id={customerDeleteId}
        title={customerTitle}
        open={open}
        handleClose={handleClose}
        handleDelete={() => handleDeleteCustomer(customerDeleteId)}
      />

      <OfferModal
        open={customerModal}
        modalToggler={setCustomerModal}
        customer={selectedCustomer}
      // handleCustomerUpdate={updateCustomer}
      // handleCustomerInsert={insertCustomer}
      />
      <CustomerPreview
        open={openPreview}
        customer={customer}
        onClose={() => setOpenPreview(false)}
      />
    </Transitions>
  );
}

CustomerView.propTypes = { data: PropTypes.any };
