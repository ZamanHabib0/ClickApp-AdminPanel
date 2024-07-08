import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const baseUrl = import.meta.env.VITE_APP_API_URL
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
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FieldArray } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { ThemeMode, Gender } from 'config';
import { openSnackbar } from 'api/snackbar';
import { insertCustomer, updateCustomer } from 'api/customer';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Camera, CloseCircle, Trash } from 'iconsax-react';
import axios from 'axios';
import { insertOffer, updateOffer } from 'api/offer';

const skills = [
    'Adobe XD',
    'After Effect',
    'Angular',
    'Animation',
    'ASP.Net',
    'Bootstrap',
    'C#',
    'CC',
    'Corel Draw',
    'CSS',
    'DIV',
    'Dreamweaver',
    'Figma',
    'Graphics',
    'HTML',
    'Illustrator',
    'J2Ee',
    'Java',
    'Javascript',
    'JQuery',
    'Logo Design',
    'Material UI',
    'Motion',
    'MVC',
    'MySQL',
    'NodeJS',
    'npm',
    'Photoshop',
    'PHP',
    'React',
    'Redux',
    'Reduxjs & tooltit',
    'SASS',
    'SCSS',
    'SQL Server',
    'SVG',
    'UI/UX',
    'User Interface Designing',
    'Wordpress'
];

// CONSTANT
const getInitialValues = (customer) => {
    const newCustomer = {
        title: '',
        description: '',

        vendor: '',

        offerType: '',
        expirationDate: '',
        // percentage: '',
        // buyNumber: '',
        // getNumber: '',
        image: null,
        offerForEachUser: "",
        vendorBranch: ""
    };

    if (customer) {
        return _.merge({}, newCustomer, customer);
    }

    return newCustomer;
};

const allStatus = [
    { value: 3, label: 'True' },
    { value: 1, label: 'False' },
    // { value: 2, label: 'Pending' }
];
const alltypevendor = [
    { value: 4, label: 'VIP' },
    { value: 5, label: 'Free' },
    { value: 6, label: 'Premium' }
];

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormOfferAdd({ customer, closeModal, offer, get }) {
    console.log(offer, 'cjk----------')
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [branches, setBranches] = useState([]);

    const [avatar, setAvatar] = useState(
        getImageUrl(`avatar-${customer && customer !== null && customer?.avatar ? customer.avatar : 1}.png`, ImagePath.USERS)
    );

    // console.log("customer.vendor "+ )

    useEffect(() => {
        if (selectedImage) {
            setAvatar(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);

    useEffect(() => {
        setLoading(false);
    }, []);

    const CustomerSchema = Yup.object().shape({
        title: Yup.string().max(255).required('Title is required'),
        description: Yup.string().max(255).required('Description is required'),
        vendor: Yup.string().required('Vendor is required'),
        offerType: Yup.string().max(255).required('Offer type is required'),
        expirationDate: Yup.date().required('Expire date is required'),
        image: Yup.mixed()
            .required('An image is required')

    });


    const [openAlert, setOpenAlert] = useState(false);

    const handleAlertClose = () => {
        setOpenAlert(!openAlert);
        closeModal();
    };
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.get(`${baseUrl}/v1/vendor/getVendor?limit=9999&page=1`);

                // const dat=response.data?.data?.vendors
                // console.log(dat,'data')
                setVendors(response?.data?.data?.vendors); // Assuming response.data contains the vendor list
            } catch (error) {
                console.error('Error fetching vendors:', error);
            }
            setLoading(false);
        };

        fetchVendors();
    }, []);

    const handleVendorSelect = async (event) => {
        const selectedVendorId = event.target.value;
        setFieldValue('vendor', selectedVendorId); // Update form state with selected vendor ID

        try {
            const response = await axios.get(`${baseUrl}/v1/vendor/${selectedVendorId}/getvendorById`);
            setBranches(response?.data?.data?.branches); // Update branches state with fetched branches
        } catch (error) {
            console.error('Error fetching vendor branches:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchBranches = async (vendorId) => {
            try {
                const response = await axios.get(`${baseUrl}/v1/vendor/${vendorId}/getvendorById`);
                setBranches(response?.data?.data?.branches); // Update branches state with fetched branches
            } catch (error) {
                console.error('Error fetching vendor branches:', error);
            }
        };
        if (customer && customer.vendor) {
            fetchBranches(customer.vendor); // Fetch branches if form is in edit mode
        }
    }, [customer]);

    const handleImageChange = (event) => {
        if (event.currentTarget.files[0]) {
            setFieldValue('image', event.currentTarget.files[0].name);
            setSelectedImage(event.currentTarget.files[0]);
        }
    };
    const formik = useFormik({

        initialValues: getInitialValues(customer),
        validationSchema: CustomerSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {



            try {
                let newCustomer = { ...values }; // Create a copy of values

                const formData = new FormData();
                formData.append('vendor', values.vendor);
                formData.append('title', values.title);
                formData.append('description', values.description);
                formData.append('expirationDate', values.expirationDate);
                formData.append('offerType', values.offerType);
                formData.append('offerForEachUser', values.offerForEachUser);
                if(selectedImage){
                    formData.append('image', selectedImage);
                }
                formData.append('vendorBranch', values.vendorBranch);




                if (customer) {
                    updateOffer(values._id, formData).then(() => {
                        openSnackbar({
                            open: true,
                            message: 'Offer update successfully.',
                            variant: 'alert',

                            alert: {
                                color: 'success'
                            }
                        });
                        // window.location.reload();
                        closeModal();

                        setSubmitting(false);
                        get(false)

                    });
                } else {
                    await insertOffer(formData).then(() => {
                        openSnackbar({
                            open: true,
                            message: 'Offer added successfully.',
                            variant: 'alert',

                            alert: {
                                color: 'success'
                            }
                        });
                        // window.location.reload();
                        closeModal();

                        setSubmitting(false);
                        get(true)

                    });
                }
            } catch (error) {
                // console.error(error);
            }
        }
    });

    //     const vendorId = customer.vendor;


    //   const matchedVendor = vendors.find(vendor => vendor._id === vendorId);
    //   console.log("matchingVendorNames" + matchedVendor + vendors[0].name )



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
                        <DialogTitle>{customer ? 'Edit Offer' : 'New Offer'}</DialogTitle>
                        <Divider />
                        <DialogContent >
                            <Grid container spacing={3} justifyContent={"center"}>


                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="customer-firstName">Title</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="title"
                                                    placeholder="Enter Title"
                                                    {...getFieldProps('title')}
                                                    error={Boolean(touched.title && errors.title)}
                                                    helperText={touched.title && errors.title}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="customer-lastName">description</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="description"
                                                    placeholder="Enter description"
                                                    {...getFieldProps('description')}
                                                    error={Boolean(touched.description && errors.description)}
                                                    helperText={touched.description && errors.description}
                                                />
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="vendor">Vendor</InputLabel>
                                                <FormControl fullWidth>
                                                    <Select
                                                        id="vendor"
                                                        displayEmpty
                                                        {...getFieldProps('vendor')}
                                                        onChange={
                                                            handleVendorSelect} // Attach the function to the onChange event
                                                        input={<OutlinedInput id="select-vendor" />}
                                                    >
                                                        <MenuItem value="">Select Vendor</MenuItem>
                                                        {vendors?.map((vendor) => (
                                                            <MenuItem key={vendor._id} value={vendor._id}>
                                                                {vendor.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {touched?.vendor && errors.vendor && (
                                                        <FormHelperText error>{errors.vendor}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="vendor">Branch</InputLabel>
                                                <FormControl fullWidth>
                                                    <Select
                                                        id="vendorBranch"
                                                        displayEmpty
                                                        value={formik.values.vendorBranch}
                                                        onChange={(event) => setFieldValue('vendorBranch', event.target.value)} // Update form state with selected branch value
                                                        input={<OutlinedInput id="vendorBranch" />}
                                                    >
                                                        <MenuItem value="">Select Branch</MenuItem>
                                                        {branches?.map((branch) => (
                                                            <MenuItem key={branch._id} value={branch._id}>
                                                                {branch.address}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {touched?.vendorBranch && errors.vendorBranch && (
                                                        <FormHelperText error>{errors.vendorBranch}</FormHelperText>
                                                    )}
                                                    {touched?.vendor && errors.vendor && (
                                                        <FormHelperText error>{errors.vendor}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="offerType">Offer Type</InputLabel>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        id="offerType"
                                                        placeholder="Enter Offer Type"
                                                        {...getFieldProps('offerType')}
                                                        variant="outlined"
                                                        error={touched?.offerType && !!errors.offerType}
                                                        helperText={touched?.offerType && errors.offerType}
                                                    />
                                                </FormControl>
                                            </Stack>
                                        </Grid>


                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>

                                                <InputLabel htmlFor="image">Upload Image</InputLabel>
                                                <TextField
                                                    id="image"
                                                    type="file"
                                                    onChange={handleImageChange}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                                {touched.image && errors.image && (
                                                    <FormHelperText error>{errors.image}</FormHelperText>
                                                )}


                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>

                                                <InputLabel htmlFor="image">Expiration Date</InputLabel>
                                                <TextField
                                                    fullWidth

                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    {...getFieldProps('expirationDate')}
                                                    error={touched.expirationDate && Boolean(errors.expirationDate)}
                                                    helperText={touched.expirationDate && errors.expirationDate}
                                                />



                                            </Stack>
                                        </Grid>



                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="offerForEachUser">Offer For Each User</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="offerForEachUser"
                                                    placeholder="Enter offer For Each User"
                                                    {...getFieldProps('offerForEachUser')}
                                                    error={Boolean(touched.offerForEachUser && errors.offerForEachUser)}
                                                    helperText={touched.offerForEachUser && errors.offerForEachUser}
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
                                        <Tooltip title="Delete Customer" placement="top">
                                            <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
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
            {customer && <AlertCustomerDelete id={customer.id} title={customer.name} open={openAlert} handleClose={handleAlertClose} />}
        </>
    );
}

FormOfferAdd.propTypes = { customer: PropTypes.any, closeModal: PropTypes.func, offer: PropTypes.any };
