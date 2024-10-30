import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Stack, Button, TextField, InputLabel
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import useConfig from 'hooks/useConfig';
import { useTheme } from '@mui/material/styles';
import { openSnackbar } from 'api/snackbar';

const baseUrl = import.meta.env.VITE_APP_API_URL;

export default function TabSettings() {
  const [isSending, setIsSending] = useState(false);
  const { mode, themeDirection } = useConfig();
  const theme = useTheme();

  const [initialValues, setInitialValues] = useState({
    notiTitle: '',
    notiSubject: '',
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {

      const payload = {
        title : values.notiTitle,
        body : values.notiSubject
      };


      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.post(`${baseUrl}/v1/notification/sendCustomNotificationToAllUsers`, payload, config);

        if(response.status === 200){
          openSnackbar({
            open: true,
            message: response.data.msg,
            variant: 'alert',
            alert: {
              color: 'success'
            }
          });
          setIsSending(false);
        }else if(response.status === 201){
          openSnackbar({
            open: true,
            message: response.data.msg,
            variant: 'alert',
            alert: {
              color: 'error'
            }
          });
        }
        setIsSending(false);


        setIsSending(false);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  });

  const handleEditClick = async () => {

      try {
        setIsSending(true);
        formik.handleSubmit(); 
  
        
      } catch (error) {
        setIsSending(false);

      }
 
  };
  


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <MainCard title="Send Message To All User's">
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="notiTitle">Title</InputLabel>
                  <TextField
                    fullWidth
                    id="notiTitle"
                    name="notiTitle"
                    placeholder="Enter Title"
                    value={formik.values.notiTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.notiTitle && Boolean(formik.errors.notiTitle)}
                    helperText={formik.touched.notiTitle && formik.errors.notiTitle}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="notiSubject">Subject</InputLabel>
                  <TextField
                    fullWidth
                    id="notiSubject"
                    name="notiSubject"
                    placeholder="Enter body of notification"
                    value={formik.values.notiSubject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.notiSubject && Boolean(formik.errors.notiSubject)}
                    helperText={formik.touched.notiSubject && formik.errors.notiSubject}
                    multiline 
                    rows={4} 
                  />
                </Stack>
              </Grid>
           


              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <AnimateButton>
                    <Button variant="contained" onClick={handleEditClick} disabled={isSending}>
                      {isSending ? 'Sending' : 'Send'}
                    </Button>
                  </AnimateButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </MainCard>
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
       
      </Grid>
    
    </Grid>

  );
}
