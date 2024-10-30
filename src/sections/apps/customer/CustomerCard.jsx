import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const baseUrl = import.meta.env.VITE_APP_API_URL
// const moment = require('moment');
import moment from 'moment';
// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

// third-party
import { PatternFormat } from 'react-number-format';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
import CustomerModal from './CustomerModal';
import CustomerPreview from './CustomerPreview';
import AlertCustomerDelete from './AlertCustomerDelete';
import ListSmallCard from './export-pdf/ListSmallCard';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import axios from 'axios';
import { openSnackbar } from 'api/snackbar';


// assets
import { CallCalling, Link2, Location, Sms } from 'iconsax-react';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import OfferModal from './FormModal';
import AlertOfferDelete from './AlertOfferDelete';

// ==============================|| CUSTOMER - CARD ||============================== //

export default function CustomerCard({ customer, get }) {
  const [open, setOpen] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const editCustomer = () => {
    setSelectedCustomer(customer);
    setCustomerModal(true);
  };
  // customer.expirationDate

  const formattedDate = moment(customer.expirationDate).format('YYYY-MM-DD');
  customer.expirationDate = formattedDate;


  const [isBlocked, setIsBlocked] = useState(customer.isDisable);

  const handleBlockUnblock = async () => {

    const offerId = customer._id;
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
      console.log("he offer status update here")
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


  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <img src={customer.image} alt='cardimage' style={{ width: "100%", height: '180px', borderRadius: "10px" }}>

            </img>

          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant='h4'> <strong>Title :</strong> <Typography variant='p'>{customer?.title}</Typography></Typography>

          </Grid>
          <Grid item xs={12}>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='p'>  <strong>Vendor Name :</strong>  <Typography variant='p'>{customer.vendorDetails?.name}</Typography></Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Offer Status:</strong>    {(customer.isDisable === false) ? "Active" : "InActive"}
            </Typography>
          </Grid>



          <Grid item xs={12}>
            <Typography variant='p'> <strong>Expiration Date :</strong> <Typography variant='p'>{customer?.expirationDate}</Typography></Typography>
          </Grid>



          <Grid item xs={12}>
            <Typography variant='p'> <strong>Offer Type :</strong> <Typography variant='p'>{customer?.offerType}</Typography></Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='p'> <strong>Offer for each user :</strong> <Typography variant='p'>{customer?.offerForEachUser}</Typography></Typography>
          </Grid>


          <Grid item xs={12}>
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 0.5, m: 0 }} component="ul">
                {customer?.skills?.map((skill, index) => (
                  <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    <Chip color="secondary" variant="outlined" size="small" label={skill} sx={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Button variant="outlined" size="small" onClick={handleClickOpen}>
            Preview
          </Button>
          <Button variant="outlined" size="small" onClick={editCustomer} sx={{
            color: 'green',
            borderColor: 'green'
          }}>
            Update
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleAlertClose}
            sx={{ color: 'red', borderColor: 'red' }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleBlockUnblock}
            sx={{
              color: customer.isDisable ? 'red' : 'green',
              borderColor: customer.isDisable ? 'red' : 'green'
            }}
          >
            {(customer.isDisable === false) ? "Active" : "InActive"}
          </Button>

        </Stack>
      </MainCard>

      <CustomerPreview customer={customer} open={open} onClose={handleClose} editCustomer={editCustomer} />
      <AlertOfferDelete id={customer._id} title={customer.title} open={openAlert} handleClose={handleAlertClose} get={get} />
      <OfferModal open={customerModal} modalToggler={setCustomerModal} customer={selectedCustomer} get={get} />
    </>
  );
}

CustomerCard.propTypes = { customer: PropTypes.any, get: PropTypes.any };
