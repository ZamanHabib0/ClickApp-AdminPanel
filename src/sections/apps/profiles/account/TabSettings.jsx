import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Stack, Button, TextField, InputLabel
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';

const baseUrl = import.meta.env.VITE_APP_API_URL


const validationSchema = yup.object({
  supportEmail: yup.string().email('Enter a valid email').required('Email is required'),
  tiktokUrl: yup.string().url('Enter a valid URL').required('URL is required'),
  facebookUrl: yup.string().url('Enter a valid URL').required('URL is required'),
  instagramUrl: yup.string().url('Enter a valid URL').required('URL is required'),
  termsConditionsUrl: yup.string().url('Enter a valid URL').required('URL is required'),
  privacyPolicyUrl: yup.string().url('Enter a valid URL').required('URL is required')

});

export default function TabSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState({
    supportEmail: 'clickapp@gmail.com',
    tiktokUrl: 'www.tiktok.com',
    facebookUrl: 'wwww.facebook.com',
    instagramUrl: 'wwww.instagram.com',
    termsConditionsUrl: 'www.termsConditionsUrl.com',
    privacyPolicyUrl: 'www.privacyPolicyUrl.com'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v1/adminpanel/getAccountSettings`);
        const data = response.data.data;
        setInitialValues({
          supportEmail: data.supportEmail,
          tiktokUrl: data.tiktokUrl,
          facebookUrl: data.facebookUrl,
          instagramUrl: data.instagramUrl,
          termsConditionsUrl: data.TermsandConditionsurl,
          privacyPolicyUrl: data.privacyPolicyUrl
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {

    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Assuming token is in the format 'Bearer <token>'
        'Content-Type': 'application/json'
      }
    };


        await axios.post(`${baseUrl}/v1/adminpanel/accountSettings`, values,config);
        console.log('Form values:', values);
        // openSnackbar({
        //   open: true,
        //   message: 'Submit Success',
        //   variant: 'alert',
        //   alert: { color: 'success' }
        // });
        setIsEditing(false); // Disable editing after successful submission
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <MainCard title="Social Profile">
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="supportEmail">Support Email</InputLabel>
                  <TextField
                    fullWidth
                    id="supportEmail"
                    name="supportEmail"
                    placeholder="Enter email address"
                    value={formik.values.supportEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.supportEmail && Boolean(formik.errors.supportEmail)}
                    helperText={formik.touched.supportEmail && formik.errors.supportEmail}
                    disabled={!isEditing}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="tiktokUrl">Tiktok URL</InputLabel>
                  <TextField
                    fullWidth
                    id="tiktokUrl"
                    name="tiktokUrl"
                    placeholder="Enter TIKTOK URL"
                    value={formik.values.tiktokUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tiktokUrl && Boolean(formik.errors.tiktokUrl)}
                    helperText={formik.touched.tiktokUrl && formik.errors.tiktokUrl}
                    disabled={!isEditing}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="facebookUrl">Facebook URL</InputLabel>
                  <TextField
                    fullWidth
                    id="facebookUrl"
                    name="facebookUrl"
                    placeholder="Enter FACEBOOK URL"
                    value={formik.values.facebookUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.facebookUrl && Boolean(formik.errors.facebookUrl)}
                    helperText={formik.touched.facebookUrl && formik.errors.facebookUrl}
                    disabled={!isEditing}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="instagramUrl">Instagram URL</InputLabel>
                  <TextField
                    fullWidth
                    id="instagramUrl"
                    name="instagramUrl"
                    placeholder="Enter Instagram URL"
                    value={formik.values.instagramUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.instagramUrl && Boolean(formik.errors.instagramUrl)}
                    helperText={formik.touched.instagramUrl && formik.errors.instagramUrl}
                    disabled={!isEditing}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <AnimateButton>
                  <Button variant="contained" type="button" onClick={isEditing ? formik.handleSubmit : handleEditClick}>
  {isEditing ? 'Submit' : 'Edit'}
</Button>
                  </AnimateButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard title="Legal Arguments">
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="privacyPolicyUrl">Privacy Policy URL</InputLabel>
                  <TextField
                    fullWidth
                    id="privacyPolicyUrl"
                    name="privacyPolicyUrl"
                    placeholder="Enter Privacy Policy URL"
                    value={formik.values.privacyPolicyUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.privacyPolicyUrl && Boolean(formik.errors.privacyPolicyUrl)}
                    helperText={formik.touched.privacyPolicyUrl && formik.errors.privacyPolicyUrl}
                    disabled={!isEditing}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="termsConditionsUrl">Terms and Conditions URL</InputLabel>
                  <TextField
                    fullWidth
                    id="termsConditionsUrl"
                    name="termsConditionsUrl"
                    placeholder="Enter Terms and Conditions URL"
                    value={formik.values.termsConditionsUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.termsConditionsUrl && Boolean(formik.errors.termsConditionsUrl)}
                    helperText={formik.touched.termsConditionsUrl && formik.errors.termsConditionsUrl}
                    disabled={!isEditing}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <AnimateButton>
              <Button variant="contained" type="button" onClick={isEditing ? formik.handleSubmit : handleEditClick}>
  {isEditing ? 'Submit' : 'Edit'}
</Button>
                 
                  </AnimateButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </MainCard>
      </Grid>
    </Grid>
  );
}
