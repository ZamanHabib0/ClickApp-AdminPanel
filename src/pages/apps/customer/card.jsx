import { useState, useEffect } from 'react';

const baseUrl = import.meta.env.VITE_APP_API_URL
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Breadcrumb from 'components/@extended/Breadcrumbs';

// project-imports
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import { DebouncedInput } from 'components/third-party/react-table';
import CustomerCard from 'sections/apps/customer/CustomerCard';
import CustomerModal from 'sections/apps/customer/CustomerModal';
 
import usePagination from 'hooks/usePagination';
import { useGetCustomer } from 'api/offer';

// assets
import { Add, SearchNormal1 } from 'iconsax-react';
import OfferModal from 'sections/apps/customer/FormModal';
import axios from 'axios';


function dataSort(data, sortBy) {
  return data.sort(function (a, b) {
    if (sortBy === 'title') return a.name.localeCompare(b.name);
    if (sortBy === 'Email') return a.email.localeCompare(b.email);
    if (sortBy === 'Contact') return a.contact.localeCompare(b.contact);
    if (sortBy === 'Age') return b.age < a.age ? 1 : -1;
    if (sortBy === 'Country') return a.country.localeCompare(b.country);
    if (sortBy === 'Status') return a.status.localeCompare(b.status);
    return a;
  });
}

// ==============================|| CUSTOMER - CARD ||============================== //

export default function CustomerCardPage() {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const { customers, customersLoading, customersError } = useGetCustomer({vendorId: "66956a9415e8ef861baabdb1"});


  

  const [sortBy, setSortBy] = useState('Default');
  const [globalFilter, setGlobalFilter] = useState('');
  const [userCard, setUserCard] = useState([]);
  const [page, setPage] = useState(1);
  const [get, setGet] = useState(false);
  // const [customerLoading, setCustomerLoading] = useState(true);
  const [customerModal, setCustomerModal] = useState(false);
  // const [offers, setOffers] = useState([]);

  const offers = customers;




  const handleChange = (event) => {
    setSortBy(event.target.value);
  };
  // search
  useEffect(() => {
    if (offers.length > 0) {
      let filteredOffers = [...offers];
      if (globalFilter) {
        filteredOffers = filteredOffers.filter((offer) =>
          offer?.name?.toLowerCase()?.includes(globalFilter?.toLowerCase())
        );
      }
      setUserCard(dataSort(filteredOffers, sortBy).reverse());
    }
  }, [globalFilter, sortBy, offers]);

  const PER_PAGE = 6;
  const count = Math.ceil(userCard.length / PER_PAGE);
  const paginatedData = usePagination(userCard, PER_PAGE);
  
  // Handle page change
  const handleChangePage = (event, page) => {
    setPage(page);
    paginatedData.jump(page);
  };

  return (
    <>
       <>
       <Breadcrumb
  title={true}
/></>
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onFilterChange={(value) => setGlobalFilter(String(value))}
              placeholder={`Search ${userCard.length} records...`}
              startAdornment={<SearchNormal1 size={18} />}
            />
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <FormControl sx={{ m: '8px !important', minWidth: 120 }}>
               
              </FormControl>
              <Button variant="contained" onClick={() => setCustomerModal(true)} size="large" startIcon={<Add />}>
                Add Offer
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {customersLoading ? (
          <EmptyUserCard title="Loading..." />
        ) : offers.length === 0 ? (
          <EmptyUserCard title="No offers found." />
        ) : (
          paginatedData.currentData().map((offer, index) => (
            <Slide key={index} direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomerCard customer={offer} get={setGet}/>
                {/* Assuming CustomerCard accepts an 'offer' prop */}
              </Grid>
            </Slide>
          ))
        )}
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <Pagination
          sx={{ '& .MuiPaginationItem-root': { my: 0.5 } }}
          count={count}
          size="medium"
          page={page}
          showFirstButton
          showLastButton
          variant="combined"
          color="primary"
          onChange={handleChangePage}
        />
      </Stack>
      <OfferModal open={customerModal} modalToggler={setCustomerModal} offer={offers}/>
    </>
  );
}
