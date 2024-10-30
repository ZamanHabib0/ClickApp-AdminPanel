import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Stack, Button, TextField, InputLabel,InputAdornment,IconButton
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import ReactQuill from '../../../../sections/forms/plugins/ReactQuill'
import useConfig from 'hooks/useConfig';
import { useTheme } from '@mui/material/styles';
import { openSnackbar } from 'api/snackbar';
import { Eye,EyeSlash } from 'iconsax-react';

const baseUrl = import.meta.env.VITE_APP_API_URL;

const validationSchema = yup.object({
  supportEmail: yup.string().email('Enter a valid email').required('Email is required'),
  tiktokUrl: yup.string().url('Enter a valid URL').required('URL is required'),
  facebookUrl: yup.string().url('Enter a valid URL').required('URL is required'),
  instagramUrl: yup.string().url('Enter a valid URL').required('URL is required'),
  privacyPolicyUrl: yup.string().url('Enter a valid URL').required('URL is required'),
  howToUseUrl: yup.string().url('Enter a valid URL').required('URL is required'),
  buyNowUrl: yup.string().url('Enter a valid URL').required('URL is required'),
  // TermsandConditionsurl: yup.string().required('Terms & Conditions is required')
});

const passwordValidationSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(8, 'Password should be at least 8 characters long').required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function TabSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [TermsandConditionsurl, setTermsAndCondition] = useState('');
  const { mode, themeDirection } = useConfig();
  const theme = useTheme();

  const [initialValues, setInitialValues] = useState({
    supportEmail: '',
    tiktokUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    privacyPolicyUrl: '',
    howToUseUrl: '',
    buyNowUrl: '',
    // TermsandConditionsurl: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v1/adminpanel/getAccountSettings`);
        const data = response.data.data;
        setInitialValues({
          supportEmail: data.supportEmail || '',
          tiktokUrl: data.tiktokUrl || '',
          facebookUrl: data.facebookUrl || '',
          instagramUrl: data.instagramUrl || '',
          privacyPolicyUrl: data.privacyPolicyUrl || '',
          howToUseUrl: data.HowToUse || '',
          buyNowUrl: data.BuyNow || '',
        });
      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    };

    const fetchTermsAndConditions = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v1/termsandcondition/termsAndConditions`);
        const data = response.data.data.content;
        setTermsAndCondition(data || '');
      } catch (error) {
        console.error('Error fetching terms and conditions:', error);
      }
    };

    fetchData();
    fetchTermsAndConditions();
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {

      const payload = {
        ...values,
      };




      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.post(`${baseUrl}/v1/adminpanel/accountSettings`, payload, config);
        // Add the logic for opening a snackbar
        setIsEditing(false); // Disable editing after successful submission
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  });

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        await formik.handleSubmit(); // Wait for form submission to complete
        await postTermsCondition(); // Wait for terms condition post to complete
  
        // Both actions completed successfully, open snackbar
        openSnackbar({
          open: true,
          message: 'Account Settings updated successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });
      } catch (error) {
        openSnackbar({
          open: true,
          message: 'Failed to update Account Settings',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        });
      }
    } else {
      setIsEditing(true);
    }
  };
  

  const postTermsCondition = async () => {

    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    let content ={
      content : TermsandConditionsurl
    }

    try {
      const res = await axios.post(`${baseUrl}/v1/termsandcondition/termsAndConditions`, content, config, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTermsAndCondition(res.data.data.content);
      openSnackbar({
        open: true,
        message: 'Account Settings updated successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

       const respone =   await axios.post(`${baseUrl}/v1/authAdmin/reset-password`, payload, config);

       if(respone.status === 200){
        openSnackbar({
          open: true,
          message: respone.data.msg,
          variant: 'alert',
          alert: { color: 'success' }
        });
       }else if (respone.status === 201){
        openSnackbar({
          open: true,
          message: respone.data.msg,
          variant: 'alert',
          alert: { color: 'error' }
        });
       }

        passwordFormik.resetForm();
      } catch (error) {
        console.error('Error resetting password:', error);
        openSnackbar({
          open: true,
          message: 'Failed to reset password.',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
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
                    placeholder="Enter Tiktok URL"
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
                    placeholder="Enter Facebook URL"
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
                    <Button variant="contained" onClick={handleEditClick}>
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
        <MainCard title="Other Urls">
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
                  <InputLabel htmlFor="howToUseUrl">How To Use URL</InputLabel>
                  <TextField
                    fullWidth
                    id="howToUseUrl"
                    name="howToUseUrl"
                    placeholder="Enter How To Use URL"
                    value={formik.values.howToUseUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.howToUseUrl && Boolean(formik.errors.howToUseUrl)}
                    helperText={formik.touched.howToUseUrl && formik.errors.howToUseUrl}
                    disabled={!isEditing}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="buyNowUrl">Buy Now URL</InputLabel>
                  <TextField
                    fullWidth
                    id="buyNowUrl"
                    name="buyNowUrl"
                    placeholder="Enter Buy Now URL"
                    value={formik.values.buyNowUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.buyNowUrl && Boolean(formik.errors.buyNowUrl)}
                    helperText={formik.touched.buyNowUrl && formik.errors.buyNowUrl}
                    disabled={!isEditing}
                  />
                </Stack>
              </Grid>


              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <AnimateButton>
                    <Button variant="contained" onClick={handleEditClick}>
                      {isEditing ? 'Submit' : 'Edit'}
                    </Button>
                  </AnimateButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </MainCard>
      </Grid>

      <Grid container spacing={2}>
  

      <Grid item xs={12} md={6}>
        <MainCard title="Change Password">
          <form onSubmit={passwordFormik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
                  <TextField
                    fullWidth
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={passwordFormik.touched.currentPassword && Boolean(passwordFormik.errors.currentPassword)}
                    helperText={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} onMouseDown={(e) => e.preventDefault()}>
                            {showPassword ? <EyeSlash /> : <Eye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Grid>

              {/* New Password */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="newPassword">New Password</InputLabel>
                  <TextField
                    fullWidth
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                    helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} onMouseDown={(e) => e.preventDefault()}>
                            {showPassword ? <EyeSlash /> : <Eye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter confirm password"
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                    helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} onMouseDown={(e) => e.preventDefault()}>
                            {showPassword ? <EyeSlash /> : <Eye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Grid>

              {/* Submit Button for Password Reset */}
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <AnimateButton>
                    <Button variant="contained" type="submit">
                      Reset Password
                    </Button>
                  </AnimateButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </MainCard>
      </Grid>
    </Grid>
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
          <ReactQuill
            termsandCondition={TermsandConditionsurl}
            setTermsandCondition={setTermsAndCondition}
            readOnly={!isEditing}
          />
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end">
          <AnimateButton>
            <Button variant="contained" onClick={handleEditClick}>
              {isEditing ? 'Submit' : 'Edit'}
            </Button>
          </AnimateButton>
        </Stack>
      </Grid>
    </Grid>

  );
}
