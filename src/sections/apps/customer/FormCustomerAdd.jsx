import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const baseUrl = import.meta.env.VITE_APP_API_URL
// material ui
import { useTheme } from '@mui/material/styles';
import { Category, TableDocument } from 'iconsax-react';
import { Formik } from 'formik';
import * as yup from 'yup';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';

import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import MainCard from '../../../components/MainCard';

import UploadMultiFileGallery from '../../../components/third-party/dropzone/MultiFileGallery';
import UploadMultiFile from '../../../components/third-party/dropzone/MultiFile';



// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FieldArray } from 'formik';

// project imports
import AlertCustomerDelete from './AlertCustomerDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { ThemeMode, Gender, ThemeDirection } from 'config';
import { openSnackbar } from 'api/snackbar';
import { insertCustomer, updateCustomer } from 'api/customer';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import ReactQuill from '../../../sections/forms/plugins/ReactQuill'
import useConfig from 'hooks/useConfig';

// assets
import { Camera, Trash } from 'iconsax-react';
import axios from 'axios';

// CONSTANT
const getInitialValues = (customer) => {
  const newCustomer = {
    name: '',
    description: '',
    category: "",
    vendorType: '',
    facebookPage: '',
    instagramPage: '',
    isActive: '',
    telephone: '',
    website: '',
    image: null,
    branches: [{
      address: "",
      telephone: "",
    }],
    termsAndCondition : "",
    availableServices : [],
    menu: [],
    gallery: [],
    galleryImages: [],
    menuImages: []
  };

  if (customer) {
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //
export default function FormCustomerAdd({ customer, closeModal }) {

  const [Services ,setServices] =  useState([]);
  const [selectedServices, setSelectedServices] = useState([]);


  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedServices((prevSelected) => {
      if (prevSelected === undefined) {
        prevSelected = []; // Initialize as empty array if undefined
      }
      if (checked) {
        return [...prevSelected, value];
      } else {
        return prevSelected.filter((country) => country !== value);
      }
    });
  };
  




  const [list, setList] = useState(false);
  const [galleryList, setGalleryList] = useState(false);
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [vendors, setVendors] = useState([]);
  const [termsandCondition, setTermsandCondition] = useState(customer?.termsAndCondition || '');

  const [avatar, setAvatar] = useState(
    getImageUrl(`upload.svg`, ImagePath.UPLOAD)
  );

  const { mode, themeDirection } = useConfig();

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    setLoading(false);
    setSelectedServices(customer?.availableServices);
  }, []);
  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/category/getCategories?page=1&limit=9999`);

      const dat = response.data?.data.categories

      console.log(dat, 'd---------')
      setVendors(response?.data?.data?.categories); // Assuming response.data contains the vendor list
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
    setLoading(false);
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/available-Service/getService?page=1&limit=10?page=1&limit=9999`);
      setServices(response?.data?.data?.AvaliableService); // Assuming response.data contains the vendor list
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
    setLoading(false);
  };




  useEffect(() => {

    fetchServices();
    fetchVendors();
  }, []);

  const CustomerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('First Name is required'),
    category: Yup.string().max(255).required('Category is required'),
    vendorType: Yup.string().max(255).required('Vendor Type is required'),
    isActive: Yup.string().required('IsActive is required'),
    description: Yup.string().max(255).required('Description is required'),
    image: (customer != null) ? Yup.mixed().nullable() : Yup.mixed().required('Image is required'),
    branches: Yup.array().of(
      Yup.object().shape({
        address: Yup.string().required('Address is required'),
        telephone: Yup.string().required('Telephone is required'),
      })
    ),


  });



  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(customer),
    validationSchema: CustomerSchema,
    context: { isNewCustomer: !customer },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newCustomer = { ...values }; // Create a copy of values

        if (!newCustomer.gallery) {
          delete newCustomer.gallery; // Remove the image field if no new image is selected
        }

        if (!newCustomer.menu) {
          delete newCustomer.menu; // Remove the image field if no new image is selected
        }

        newCustomer.availableServices = selectedServices
        newCustomer.termsAndCondition = termsandCondition


        

        if (customer) {

          newCustomer.galleryImages = galleryImages
          newCustomer.menuImages = menuImages


          updateCustomer(newCustomer._id, newCustomer).then(() => {
            openSnackbar({
              open: true,
              message: 'Vendor update successfully.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            // window.location.reload();
            // fetchVendors()
            setSubmitting(false);
            closeModal();
          });
        } else {
          await insertCustomer(newCustomer).then(() => {
            openSnackbar({
              open: true,
              message: 'Vendor added successfully.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            // fetchVendors()
            // window.location.reload();
            closeModal();
          });
        }
      } catch (error) {
        // console.error(error);
      }
    }
  });

  const [menuImages, setMenuImages] = useState(customer?.menu || []); // Initialize with existing images if editing
  const [galleryImages, setgalleryImages] = useState(customer?.gallery || []); // Initialize with existing images if editing

  if (customer) {
    customer.menu = []
    customer.gallery = []
  }




  const onRemove = (imageUrl) => {
    const filteredImages = menuImages.filter((image) => image !== imageUrl);
    setMenuImages(filteredImages);
  };


  // Function to handle adding images
  const handleAddImage = (file) => {
    setMenuImages([...menuImages, file]);
  };

  // Function to handle removing images
  const handleRemoveImage = (index) => {
    const updatedImages = [...menuImages];
    updatedImages.splice(index, 1);
    setMenuImages(updatedImages);
  };

  // Function to handle removing images
  const handleRemoveImageGallery = (index) => {
    const updatedImages = [...galleryImages];
    updatedImages.splice(index, 1);
    setgalleryImages(updatedImages);
  };




  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  const logoFieldProps = getFieldProps('logo');

  const selectedMenu = customer?.menu

  // const selectedMenu = imageArray.split(',');

  console.log("customer.menu " + selectedMenu)

  const selectedCategory = customer?.category ? vendors.find(vendor => vendor._id === customer.category) : null;


  function chunkArray(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, index * size + size)
    );
  }

  const chunkedMenu = selectedMenu ? chunkArray(selectedMenu, 3) : [];
  // const chunkedGallery = data?.gallery ? chunkArray(data.gallery, 3) : [];


  console.log("selectedMenu " + selectedMenu)



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
            <DialogTitle>{customer ? 'Edit Vendor' : 'New Vendor'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                <Typography sx={{ color: 'secondary.dark' }}>Logo</Typography>

                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>

                    <FormLabel
                      htmlFor="change-avtar"
                      sx={{
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                      }}
                    >
                      {customer ? (
                        <img
                          alt="logo"
                          src={selectedImage ? avatar : logoFieldProps.value}
                          width="160"
                          height="160"
                          style={{ borderRadius: '4px' }}
                        />
                      ) : (
                        <img
                          alt="logo"
                          src={avatar}
                          width="160"
                          height="160"
                          style={{ borderRadius: '4px' }}
                        />
                      )}
                      {/* <img
                        alt="logo"
                        src={selectedImage ? URL.createObjectURL(selectedImage) : avatar}
                        width="160"
                        height="160"
                        style={{ borderRadius: '4px' }}
                      /> */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <Camera style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avtar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setSelectedImage(file);
                        setFieldValue('image', file);
                      }}
                    />

                  </Stack>
                  {touched.image && errors.image && (
                    <FormHelperText error>{errors.image}</FormHelperText>
                  )}


                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-firstName"> Name</InputLabel>
                        <TextField
                          fullWidth
                          id="name"
                          placeholder="Enter  Name"
                          {...getFieldProps('name')}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-category">Select Category</InputLabel>
                        <FormControl>
                          <Select
                            id="category"
                            displayEmpty
                            {...getFieldProps('category')}
                            onChange={(event) => setFieldValue('category', event.target.value)}
                            input={<OutlinedInput id="select-vendor" />}
                          >
                            <MenuItem value="">Select Category</MenuItem>
                            {vendors?.map((vendor) => (
                              <MenuItem key={vendor._id} value={vendor._id}>
                                {vendor.categoryName}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.category && errors.category && (
                            <FormHelperText error>{errors.category}</FormHelperText>
                          )}
                        </FormControl>
                      </Stack>
                    </Grid>



                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="category">Description</InputLabel>
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
                    <Grid item xs={12} sm={6}> <Stack spacing={1} >
                      <InputLabel htmlFor="vendorType">vendorType</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          id="vendorType"
                          displayEmpty
                          {...getFieldProps('vendorType')}
                          // onChange={(event) => setFieldValue('vendorType', event.target.value)}
                          input={<OutlinedInput id="select-vendorType" placeholder="Sort by" />}

                        >
                          <MenuItem value="">Select Vendor Type</MenuItem>
                          {/* <MenuItem value="VIP">VIP</MenuItem> */}
                          <MenuItem value="Standard">Standard</MenuItem>
                          <MenuItem value="Premium">Premium</MenuItem>
                        </Select>
                      </FormControl>
                      {touched.vendorType && errors.vendorType && (
                        <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                          {errors.vendorType}
                        </FormHelperText>
                      )}
                    </Stack></Grid>

                    <Grid item xs={12} sm={6} >
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-status">IsActive</InputLabel>
                        <FormControl >

                          <Select
                            id="isActive"
                            displayEmpty
                            {...getFieldProps('isActive')}
                            onChange={(event) => setFieldValue('isActive', event.target.value)}
                            input={<OutlinedInput id="select-isActive" placeholder="Sort by" />}

                          >
                            <MenuItem value="">Select Active</MenuItem>
                            <MenuItem value="true">true</MenuItem>
                            <MenuItem value="false">false</MenuItem>
                          </Select>
                        </FormControl>
                        {touched.isActive && errors.isActive && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.isActive}
                          </FormHelperText>
                        )}
                      </Stack>

                    </Grid>
                    <Grid item xs={12} >

                      <Stack spacing={1}>

                        <InputLabel htmlFor="customer-role">FaceBook Page</InputLabel>
                        <TextField
                          fullWidth
                          id="facebookPage"
                          placeholder="Enter Vendor FaceBook Page "
                          {...getFieldProps('facebookPage')}
                          error={Boolean(touched.role && errors.role)}
                          helperText={touched.role && errors.role}
                        />
                      </Stack>

                    </Grid>

                    <Grid item xs={12} >

                      <Stack spacing={1}>

                        <InputLabel htmlFor="customer-role">Instagram Page</InputLabel>
                        <TextField
                          fullWidth
                          id="instagrampage"
                          placeholder="Enter Vendor Instagram Page "
                          {...getFieldProps('instagramPage')}
                          error={Boolean(touched.role && errors.role)}
                          helperText={touched.role && errors.role}
                        />
                      </Stack>

                    </Grid>



                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-about">Website</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-about"
                          multiline
                          rows={1}
                          placeholder="Enter vendor  Website"
                          {...getFieldProps('website')}
                          error={Boolean(touched.about && errors.about)}
                          helperText={touched.about && errors.about}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <FieldArray name="branches">
                        {({ push, remove, form }) => (
                          <React.Fragment>
                            {form.values.branches.map((branch, index) => (
                              <Grid container spacing={2} key={index}>
                                <Grid item xs={12}>
                                </Grid>
                                <Grid item xs={12}>
                                  <Divider />
                                </Grid>

                                <Grid item xs={6}>
                                  <Stack spacing={1}>
                                    <InputLabel htmlFor={`branches[${index}].address`}>Branch Address</InputLabel>
                                    <TextField
                                      fullWidth
                                      placeholder="Enter Branch Address"
                                      {...getFieldProps(`branches[${index}].address`)}
                                      error={Boolean(touched.branches?.[index]?.address && errors.branches?.[index]?.address)}
                                      helperText={touched.branches?.[index]?.address && errors.branches?.[index]?.address}
                                    />
                                  </Stack>
                                </Grid>

                                <Grid item xs={6}>
                                  <Stack spacing={1}>
                                    <InputLabel htmlFor={`branches[${index}].telephone`}>Branch Telephone</InputLabel>
                                    <TextField
                                      fullWidth
                                      placeholder="Enter Branch Telephone"
                                      {...getFieldProps(`branches[${index}].telephone`)}
                                      error={Boolean(touched.branches?.[index]?.telephone && errors.branches?.[index]?.telephone)}
                                      helperText={touched.branches?.[index]?.telephone && errors.branches?.[index]?.telephone}
                                    />
                                  </Stack>
                                </Grid>


                                <Grid item xs={12}>
                                  <Button variant="outlined" onClick={() => push({ address: '', telephone: '' })}>
                                    Add Branch
                                  </Button>
                                </Grid>
                                {index >= 1 ? (
                                  <Grid item xs={12} style={{ marginBottom: '20px' }}>
                                    <Button variant="outlined" color="error" onClick={() => remove(index)}>
                                      Remove Branch
                                    </Button>
                                  </Grid>
                                ) : null}
                              </Grid>
                            ))}
                          </React.Fragment>
                        )}
                      </FieldArray>
                    </Grid>

                    <Divider />
                    <Grid
      item
      xs={12}
      sx={{
        '& .quill': {
          bgcolor: mode === 'dark' ? 'dark.main' : 'secondary.lighter',
          borderRadius: '4px',
          '& .ql-toolbar': {
            bgcolor: mode === 'dark' ? 'dark.light' : 'secondary.100',
            borderColor: theme.palette.divider,
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          },
          '& .ql-container': {
            borderColor: `${theme.palette.divider} !important`,
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
            '& .ql-editor': { minHeight: 135 }
          },
          '& .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg': {
            position: themeDirection === 'rtl' ? 'initial' : 'absolute'
          }
        }
      }}
    >
      <MainCard title="Terms and Condition">
        <ReactQuill termsandCondition={termsandCondition} setTermsandCondition={setTermsandCondition} />
      </MainCard>
    </Grid>
  

                    <Divider />

                    <Grid item xs={12}>

                      <Typography variant="h6">Select Servies You are providing</Typography>
                      <FormControl component="fieldset">
                        <FormGroup row>
                          {Services.map((AvalibleServices) => (
                            <FormControlLabel
                              key={AvalibleServices._id}
                              control={<Checkbox value={AvalibleServices._id} onChange={handleCheckboxChange} />}
                              label={AvalibleServices.serviceName}
                            />
                          ))}
                        </FormGroup>
                      </FormControl>
                    </Grid>

                    <Divider />



                    {customer && (
                      <Grid item xs={12}>
                        <MainCard title="Selected Menu Images">
                          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto' }}>
                            {menuImages.map((imageUrl, index) => (
                              <List key={index}>
                                <ListItem divider>
                                  <Grid container justifyContent="center" alignItems="center" spacing={1}>
                                    <Grid item xs={4}>
                                      <Avatar
                                        alt={`Menu Image ${index + 1}`}
                                        variant="rounded"
                                        src={imageUrl}
                                        sx={{ width: 80, height: 80 }}
                                      />
                                    </Grid>
                                    <Grid item xs={1}>
                                      <IconButton
                                        onClick={() => handleRemoveImage(index)}
                                        size="small"
                                        color="inherit"
                                      >
                                        {/* <CloseIcon /> */}
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </ListItem>
                              </List>
                            ))}
                          </Stack>
                        </MainCard>
                      </Grid>
                    )}





                    <Grid item xs={12}>
                      <MainCard
                        title="Upload Vendor Menu"
                        secondary={
                          <Stack direction="row" alignItems="center" spacing={1.25}>
                            <IconButton color={list ? 'secondary' : 'primary'} size="small" onClick={() => setList(false)}>
                              <TableDocument style={{ fontSize: '1.15rem' }} />
                            </IconButton>
                            <IconButton color={list ? 'primary' : 'secondary'} size="small" onClick={() => setList(true)}>
                              <Category style={{ fontSize: '1.15rem' }} />
                            </IconButton>
                          </Stack>

                        }
                      >

                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Stack spacing={1.5} alignItems="center">
                              <UploadMultiFile
                                showList={list}
                                setFieldValue={setFieldValue}
                                fieldName="menu"
                                files={values.menu}
                                error={touched.menu && !!errors.menu}
                              />
                            </Stack>
                            {touched.menu && errors.menu && (
                              <FormHelperText error id="standard-weight-helper-text-menu">
                                {errors.menu}
                              </FormHelperText>
                            )}
                          </Grid>
                        </Grid>
                      </MainCard>
                    </Grid>

                    {customer && (
                      <Grid item xs={12}>
                        <MainCard title="Selected Gallery Images">
                          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto' }}>
                            {galleryImages.map((imageUrl, index) => (
                              <List key={index}>
                                <ListItem divider>
                                  <Grid container justifyContent="center" alignItems="center" spacing={1}>
                                    <Grid item xs={4}>
                                      <Avatar
                                        alt={`Menu Image ${index + 1}`}
                                        variant="rounded"
                                        src={imageUrl}
                                        sx={{ width: 80, height: 80 }}
                                      />
                                    </Grid>
                                    <Grid item xs={1}>
                                      <IconButton
                                        onClick={() => handleRemoveImage(index)}
                                        size="small"
                                        color="inherit"
                                      >
                                        {/* <CloseIcon /> */}
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </ListItem>
                              </List>
                            ))}
                          </Stack>
                        </MainCard>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <MainCard
                        title="Upload Vendor Gallery"
                        secondary={
                          <Stack direction="row" alignItems="center" spacing={1.25}>
                            <IconButton color={list ? 'secondary' : 'primary'} size="small" onClick={() => setGalleryList(false)}>
                              <TableDocument style={{ fontSize: '1.15rem' }} />
                            </IconButton>
                            <IconButton color={list ? 'primary' : 'secondary'} size="small" onClick={() => setGalleryList(true)}>
                              <Category style={{ fontSize: '1.15rem' }} />
                            </IconButton>
                          </Stack>
                        }
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Stack spacing={1.5} alignItems="center">
                              <UploadMultiFileGallery
                                showList={galleryList}
                                setFieldValue={setFieldValue}
                                fieldName="gallery"
                                files={values.gallery}
                                error={touched.gallery && !!errors.gallery}
                              />
                            </Stack>
                            {touched.gallery && errors.gallery && (
                              <FormHelperText error id="standard-weight-helper-text-gallery">
                                {errors.gallery}
                              </FormHelperText>
                            )}
                          </Grid>
                        </Grid>
                      </MainCard>
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

FormCustomerAdd.propTypes = { customer: PropTypes.any, closeModal: PropTypes.func };
