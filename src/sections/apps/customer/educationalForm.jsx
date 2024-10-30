import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import DialogTitle from '@mui/material/DialogTitle';

import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';


import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FieldArray } from 'formik';

// project imports
import AlertCustomerDelete from './AlertInstituateDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { ThemeMode, Gender } from 'config';
import { openSnackbar } from 'api/snackbar';
import { insertCustomer, updateCustomer } from 'api/educational.institute';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Camera, CloseCircle, Trash } from 'iconsax-react';
import axios from 'axios';

// CONSTANT
const getInitialValues = (customer) => {
    const newCustomer = {
        name: "",
        type: ""
    };

    if (customer) {
        return _.merge({}, newCustomer, customer);
    }

    return newCustomer;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormCategoryAdd({ customer, closeModal  }) {
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(undefined);
    const [avatar, setAvatar] = useState(
        getImageUrl(`avatar-${customer && customer !== null && customer?.avatar ? customer.avatar : 1}.png`, ImagePath.USERS)
    );

    useEffect(() => {
        if (selectedImage) {
            setAvatar(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);

    const handleImageChange = (event) => {
        if (event.currentTarget.files[0]) {
            setFieldValue('image', event.currentTarget.files[0]);
            setSelectedImage(event.currentTarget.files[0]);
        }
    };
    
    useEffect(() => {
        setLoading(false);
    }, []);

    const CustomerSchema = Yup.object().shape({
        name: Yup.string().max(255).required('Institute Name is required'),
        type: Yup.mixed()
            .required('Institute type is required')
      
    });

    const [openAlert, setOpenAlert] = useState(false);

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
        closeModal();
    };

    const formik = useFormik({
        initialValues: getInitialValues(customer),
        validationSchema: CustomerSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let formData = new FormData();
                formData.append('name', values.name);
                formData.append('type', values.type);
           

                let newCustomer = { ...values }; 
           

                if (customer) {
                
                    updateCustomer(customer._id, newCustomer).then(() => {
                        openSnackbar({
                            open: true,
                            message: 'Educational Institute updated successfully.',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                        // fetchData();
                        // window.location.reload();
                        setSubmitting(false);
                        closeModal();
                    });
                } else {
                    await insertCustomer(newCustomer).then(() => {
                        openSnackbar({
                            open: true,
                            message: 'Educational Institute added successfully.',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            }
                        });
                        setSubmitting(false);
                        // window.location.reload();
                        closeModal();
                        // fetchData()
                    });
                }

                // fetchData(); 
            } catch (error) {
                console.error(error);
                setSubmitting(false);
            }
        }
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

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
            <FormikProvider value={formik}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <DialogTitle>{customer ? 'Edit Educational Institute' : 'New Educational Institute'}</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 2.5 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={2}>

                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="customer-firstName">Institute Name</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="name"
                                                    placeholder="Enter Institute Name"
                                                    {...getFieldProps('name')}
                                                    error={Boolean(touched.name && errors.name)}
                                                    helperText={touched.name && errors.name}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={12} >
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-status">Select Type</InputLabel>
                        <FormControl >

                          <Select
                            id="type"
                            displayEmpty
                            {...getFieldProps('type')}
                            onChange={(event) => setFieldValue('type', event.target.value)}
                            input={<OutlinedInput id="select-isActive" placeholder="Sort by" />}

                          >
                            <MenuItem value="">Select Type</MenuItem>
                            <MenuItem value="College">College</MenuItem>
                            <MenuItem value="University">University</MenuItem>
                          </Select>
                        </FormControl>
                        {touched.type && errors.type && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.type}
                          </FormHelperText>
                        )}
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
                                            <IconButton onClick={() => {  setOpenAlert(true) }} size="large" color="error">
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
                                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                                            {customer ? 'Edit' : 'Add'}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Form>
                </LocalizationProvider>
            </FormikProvider>
            {customer && <AlertCustomerDelete id={customer._id} title={customer.name} open={openAlert} handleClose={handleAlertClose} />}
        </>
    );
}

FormCategoryAdd.propTypes = { customer: PropTypes.any, closeModal: PropTypes.func };
