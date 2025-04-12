import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// Material UI
import { useTheme } from '@mui/material/styles';
import {
    Box, Grid, Stack, Button, Divider, MenuItem, TextField,
    InputLabel, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete";
// Third-party libraries
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// import { openSnackbar } from 'api/snackbar';
import { userManagement } from 'api/userTable';
import { openSnackbar } from 'api/snackbar';

// Function to get initial values
const getInitialValues = (customer) => ({
    fullName: customer?.fullName || "",
    email: customer?.email || "",
    phone: customer?.phoneNumber ||"",
    remainingOffers : customer?.offerCard.remainingOffers,
    password : ""
});

// Validation schema
const getValidationSchema = (isEdit) =>
    Yup.object().shape({
        fullName: Yup.string().max(255).required('Full Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        remainingOffers: Yup.string().max(255).required('Remaining Offers is required'),
        phone: Yup.string().max(255).required('Phone No is required'),
        password: isEdit
            ? Yup.string().min(8, 'Password must be at least 8 characters')
            : Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
    });

export default function FormCategoryAdd({ customer, closeModal }) {
    useEffect(() => {
        console.log(customer);
        setLoading(false);
    }, []);

    const [loading, setLoading] = useState(false);
    const isEdit = Boolean(customer?._id);


    const formik = useFormik({
        initialValues: getInitialValues(customer),
        validationSchema: getValidationSchema(isEdit),
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let newCustomer = { ...values };

                if (customer?._id) {
                    await userManagement(customer?._id, newCustomer).then(() => {
                        openSnackbar({
                            open: true,
                            anchorOrigin: { vertical: 'top', horizontal: 'right' },
                            message: 'User updated successfully.',
                            variant: 'alert',
                            alert: { color: 'success' }
                        });
                        setSubmitting(false);
                        closeModal();
                    });
                } 
            } catch (error) {
                console.error(error);
                setSubmitting(false);
            }
        }
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

    if (loading)
        return (
            <Box sx={{ p: 5 }}>
                <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                </Stack>
            </Box>
        );

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <DialogTitle>{customer ? 'Edit User' : 'New User'}</DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 2.5 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <Grid container spacing={3}>
                                {/* Full Name */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="fullName">Full Name</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="fullName"
                                            placeholder="Enter Full Name"
                                            {...getFieldProps('fullName')}
                                            error={Boolean(touched.fullName && errors.fullName)}
                                            helperText={touched.fullName && errors.fullName}
                                        />
                                    </Stack>
                                </Grid>

                                {/* Email */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            placeholder="Enter Email"
                                            {...getFieldProps('email')}
                                            error={Boolean(touched.email && errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="phone">Phone No</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="phone"
                                            placeholder="Enter phone No"
                                            {...getFieldProps('phone')}
                                            error={Boolean(touched.phone && errors.phone)}
                                            helperText={touched.phone && errors.phone}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="remainingOffers">Remaining Offers</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="remainingOffers"
                                            placeholder="Remaining Offers"
                                            {...getFieldProps('remainingOffers')}
                                            error={Boolean(touched.remainingOffers && errors.remainingOffers)}
                                            helperText={touched.remainingOffers && errors.remainingOffers}
                                        />
                                    </Stack>
                                </Grid>


                                {/* Password */}
                                <Grid item xs={12} sm={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="password">New Password</InputLabel>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            id="password"
                                            placeholder="Enter New Password"
                                            {...getFieldProps('password')}
                                            error={Boolean(touched.password && errors.password)}
                                            helperText={touched.password && errors.password}
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
        </FormikProvider>
    );
}

FormCategoryAdd.propTypes = {
    customer: PropTypes.any,
    closeModal: PropTypes.func
};
