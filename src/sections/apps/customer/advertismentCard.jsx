import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from 'moment';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_APP_API_URL;

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import MainCard from 'components/MainCard';
import { useGetCustomer } from 'api/customer';

import AlertOfferDelete from './alertAdvertismentDelete';
import OfferModal from './advertismentModal';
import { openSnackbar } from 'api/snackbar';



export default function CustomerCard({ customer, get }) {
    const [openAlert, setOpenAlert] = useState(false);
    const [customerModal, setCustomerModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isBlocked, setIsBlocked] = useState(customer.isActive);

    const handleClickOpen = async () => {
        const adId = customer._id;
        const newIsBlocked = !isBlocked;

        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.put(
                `${baseUrl}/v1/advertisement/advertisements/${adId}/toggle`,
                { isBlock: newIsBlocked },
                config
            );

            if (response.status === 200) {
                setIsBlocked(newIsBlocked); // Update local state
                customer.isActive = newIsBlocked; // Update customer object status
                openSnackbar({
                    open: true,
                    message: response.data.msg,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                });
            }else{
                openSnackbar({
                    open: true,
                    message: 'Your Advertisment is Expired Kiendly update the date first',
                    variant: 'alert',
          
                    alert: {
                        color: 'error'
                    }
                });
                }
        } catch (error) {
            console.error('Failed to block/unblock advertisement', error);
        }
    };

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
    };

    const editCustomer = () => {
        setSelectedCustomer(customer);
        setCustomerModal(true);
    };

    const formattedDate = moment(customer.expirationDate).format('YYYY-MM-DD');
    customer.expirationDate = formattedDate;

    return (
        <>
            <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
                <Grid container spacing={2.25}>
                    <Grid item xs={12}>
                        <img src={customer.image} alt='cardimage' style={{ width: "100%", height: '180px', borderRadius: "10px" }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h4'>
                            <strong>Title :</strong> <Typography variant='p'>{customer.title}</Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='p'>
                            <strong>Description :</strong> <Typography variant='p'>{customer?.description}</Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='p'>
                            <strong>Expiration Date :</strong> <Typography variant='p'>{customer.expirationDate}</Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            <strong>Banner Status:</strong> {isBlocked ? "Inactive" : "Active"}
                        </Typography>
                    </Grid>
                </Grid>
                <Stack
                    direction="row"
                    className="hideforPDf"
                    alignItems="center"
                    spacing={1}
                    justifyContent="left"
                    sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
                >
                    <Button variant="outlined" size="small" onClick={editCustomer}>
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
                        onClick={handleClickOpen}
                        sx={{ color: isBlocked ? 'green' : 'red', borderColor: isBlocked ? 'green' : 'red' }}
                    >
                        {isBlocked ? "Active" : "Inactive"}
                    </Button>
                </Stack>
            </MainCard>
            <AlertOfferDelete id={customer._id} title={customer.title} open={openAlert} handleClose={handleAlertClose} get={get} />
            <OfferModal open={customerModal} modalToggler={setCustomerModal} customer={selectedCustomer} get={get} />
        </>
    );
}

CustomerCard.propTypes = {
    customer: PropTypes.any,
    get: PropTypes.any,
};
