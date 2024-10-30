import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from 'moment';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

// third-party
import { PatternFormat } from 'react-number-format';
import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
import AlertCustomerDelete from './AlertCustomerDelete';
import ListCard from './export-pdf/ListCard';

import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';
import { PopupTransition } from 'components/@extended/Transitions';

import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { DocumentDownload, Edit, Trash } from 'iconsax-react';

// ==============================|| CUSTOMER - PREVIEW ||============================== //

export default function CustomerPreview({ customer, open, onClose }) {
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [openAlert, setOpenAlert] = useState(false);


  const handleClose = () => {
    setOpenAlert(!openAlert);
    onClose();
  };

  const matchedBranch = customer.vendorDetails?.branches.find(branch => branch._id === customer.vendorBranch);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={PopupTransition}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ '& .MuiDialog-paper': { width: 1024, maxWidth: 1, m: { xs: 1.75, sm: 2.5, md: 4 } } }}
      >
        <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1 }}>

          <DialogContent sx={{ px: 0 }}>
            <SimpleBar sx={{ height: 'calc(100vh - 290px)' }}>
              <Grid container spacing={3}>

                <Grid item xs={12} sm={4} xl={3}>
                  <Box mb={2}>
                    <MainCard>
                      <Typography variant='h5' color="primary" sx={{ paddingBottom: '10px' }}>
                        Banner Image
                      </Typography>
                      <img src={customer?.image} alt='customerimage' style={{ width: '100%', height: '200px', borderRadius: "10px" }} />
                    </MainCard>
                  </Box>

                  <Box mb={2}>
                    <MainCard>
                      <Typography variant='h5' color="primary" sx={{ paddingBottom: '10px' }}>
                        QR Code
                      </Typography>
                      <img src={customer?.qrCode} alt='customerimage' style={{ width: '100%', height: '200px', borderRadius: "10px" }} />
                    </MainCard>
                  </Box>
                </Grid>


                <Grid item xs={12} sm={8} xl={9}>
                  <Grid container spacing={2.25}>
                    <Grid item xs={12}>
                      <MainCard>
                        <Typography color="primary" variant='h3'>
                          {customer?.title}
                        </Typography>
                      </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                      <MainCard >
                        <List sx={{ py: 0 }}>
                          <ListItem >
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="primary" variant='h5'>Description </Typography>
                                  <Typography color="secondary">{customer?.description}</Typography>

                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="primary" variant='h5'>
                                    Expiration Date</Typography>
                                  <Typography>
                                    {moment(customer.expirationDate).format('YYYY-MM-DD')}</Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                          <ListItem divider>
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="primary" variant='h5'>
                                    OfferType
                                  </Typography>
                                  <Typography>{customer.
                                    offerType
                                  }</Typography>

                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="primary" variant='h5'>
                                    Offer For Each User
                                  </Typography>
                                  <Typography>{customer.
                                    offerForEachUser
                                  }</Typography>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="primary" variant='h5'>
                                    Status
                                  </Typography>
                                  <Typography>
                                    {(customer.isDisable) ? "InActive" : "Active"}</Typography>
                                </Stack>
                                
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="primary" variant='h5'>
                                    Offer Redeem Code
                                  </Typography>
                                  <Typography>
                                    {customer.offerRedeemCode}</Typography>
                                </Stack>
                                
                              </Grid>
                            </Grid>
                          </ListItem>
                          <ListItem >
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="primary" variant='h5'>Vendor Name </Typography>
                                  <Typography color="secondary">{customer?.vendorDetails?.name}</Typography>

                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="primary" variant='h5'>
                                    Offer Branch</Typography>
                                  <Typography>{matchedBranch?.address}</Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItem>
                          <ListItem >
                            <Grid container spacing={matchDownMD ? 0.5 : 3}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={0.5}>
                                  <Typography color="primary" variant='h5'>
                                    Branch Contact
                                  </Typography>
                                  <Typography>{matchedBranch?.telephone
                                  }</Typography>

                                </Stack>
                              </Grid>

                            </Grid>
                          </ListItem>
                        </List>
                      </MainCard>
                    </Grid>

                  </Grid>
                </Grid>

              </Grid>
            </SimpleBar>
          </DialogContent>

          <DialogActions>
            <Button color="error" variant="contained" onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <AlertCustomerDelete id={customer.id} title={customer.name} open={openAlert} handleClose={handleClose} />
    </>
  );
}

CustomerPreview.propTypes = { customer: PropTypes.any, open: PropTypes.bool, onClose: PropTypes.func, editCustomer: PropTypes.func };
