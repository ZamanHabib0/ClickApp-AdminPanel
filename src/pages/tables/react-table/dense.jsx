import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_APP_API_URL;

// material-ui
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';

// third-party
import { flexRender, useReactTable, getCoreRowModel } from '@tanstack/react-table';

// project import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import { CSVExport } from 'components/third-party/react-table';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

import makeData from 'data/react-table';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, title }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  let headers = [];
  table.getAllColumns().map((columns) =>
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      key: columns.columnDef.accessorKey
    })
  );

  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${baseUrl}/v1/category/getCategories?page=1&limit=9999`, config);
      setCategories(response.data?.data?.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchVendors = async () => {
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`${baseUrl}/v1/vendor/getVendorAdmin`, config);
      setVendors(response.data?.data?.vendors || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchVendors();
  }, []);

  return (
    <MainCard content={false} title={title} secondary={<CSVExport {...{ data: data, headers, filename: 'Report.csv' }} />}>
      <ScrollX>
        <Grid container>
          <Grid item xs={12} md={2}></Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}></Grid>
              {/* <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="customer-category">Select Category</InputLabel>
                  <FormControl>
                    <Select
                      id="category"
                      displayEmpty
                      value={selectedCategory}
                      onChange={(event) => setSelectedCategory(event.target.value)}
                      input={<OutlinedInput id="select-category" />}
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid> */}
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="vendor">Vendor</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      id="vendor"
                      displayEmpty
                      value={selectedVendor}
                      onChange={(event) => setSelectedVendor(event.target.value)}
                      input={<OutlinedInput id="select-vendor" />}
                    >
                      <MenuItem value="">Select Vendor</MenuItem>
                      {vendors.map((vendor) => (
                        <MenuItem key={vendor._id} value={vendor._id}>
                          {vendor.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="customer-status">Status</InputLabel>
                  <FormControl>
                    <Select
                      id="isActive"
                      displayEmpty
                      value={selectedStatus}
                      onChange={(event) => setSelectedStatus(event.target.value)}
                      input={<OutlinedInput id="select-isActive" placeholder="Sort by" />}
                    >
                      <MenuItem value="">Select Active</MenuItem>
                      <MenuItem value="true">true</MenuItem>
                      <MenuItem value="false">false</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - BASIC ||============================== //

export default function DenseTable() {
  const [offers, setOffers] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');

  const fetchOffers = async (vendorId) => {
    try {
      const response = await axios.get(`${baseUrl}/v1/vendor/searchOffers`, {
        params: { vendor: vendorId }
      });
      setOffers(response.data?.data?.offers || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  useEffect(() => {
    fetchOffers(selectedVendor);
  }, [selectedVendor]);

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title'
      },
      {
        header: 'Description',
        accessorKey: 'description'
      },
      {
        header: 'Offer Type',
        accessorKey: 'offerType'
      },
      {
        header: 'Offer Count',
        accessorKey: 'offerForEachUser'
      },
      // {
      //   header: 'Expiration Date',
      //   accessorKey: 'expirationDate',
      //   id: 'expirationDate', // Add id
      //   cell: ({ value }) => {
      //     if (!value) return '';
      //     const date = new Date(value);
      //     return isNaN(date) ? '' : date.toISOString().split('T')[0];
      //   },
      // },
      {
        header: 'Status',
        accessorKey: 'isDisable',
        id: 'isDisable', // Add id
        cell: ({ value }) => (value ? 'Inactive' : 'Active'),
      },
    ],
    []
  );

  return <ReactTable {...{ data: offers, columns, title: 'Report Table' }} />;
}

DenseTable.propTypes = { getValue: PropTypes.func };

ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array, title: PropTypes.string };
