import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import IconButton from 'components/@extended/IconButton';
import { openSnackbar } from 'api/snackbar';
import { Trash } from 'iconsax-react';
import { useGetCustomer } from 'api/membershupNumber';

const baseUrl = import.meta.env.VITE_APP_API_URL;

export default function FormCategoryAdd({ customer, closeModal }) {
  const theme = useTheme();
  const [memberShipNumber, setMemberShipNumber] = useState(''); // Set initial state to an empty string
  const { mutate } = useSWRConfig();
  const { customersLoading: loading, customers: lists } = useGetCustomer();

  const createMembershipNumber = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post(`${baseUrl}/v1/memberShipNumber/createNumber`, {}, config);
      setMemberShipNumber(response.data.data.memberShipNumber);

      mutate(
        `${baseUrl}/v1/memberShipNumber/getMemberShipNumbers`,
        async (lists) => {
          const updatedList = [...(lists.data || []), response.data.data];
          return { data: updatedList };
        },
        false
      );

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    createMembershipNumber();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(memberShipNumber);
    openSnackbar({
      open: true,
      message: 'Membership number copied to clipboard!',
      variant: 'alert',
      alert: {
        color: 'success'
      }
    });
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DialogTitle>MemberShip Number</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={2} />
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={1}>
                    <TextField
                      fullWidth
                      id="name"
                      placeholder="VUWI DKFL BQI0 PO15"
                      value={memberShipNumber}
                      disabled
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {customer && (
                <Tooltip title="Delete Category" placement="top">
                  <IconButton onClick={() => { setOpenAlert(true) }} size="large" color="error">
                    <Trash variant="Bold" />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button color="error" onClick={closeModal}>
                  Cancel
                </Button>
                <Button onClick={copyToClipboard} variant="contained">
                  Copy to clipboard
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogActions>
      </LocalizationProvider>
    </>
  );
}

FormCategoryAdd.propTypes = { customer: PropTypes.any, closeModal: PropTypes.func };
