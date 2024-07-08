import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Badge from '@mui/material/Badge';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Transitions from 'components/@extended/Transitions';

import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Link2, Location, Mobile, Facebook } from 'iconsax-react';

// ==============================|| CUSTOMER - VIEW ||============================== //

export default function CustomerView({ data }) {
  console.log(data, 'de------------')
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));


  function chunkArray(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, index * size + size)
    );
  }

  const chunkedMenu = data?.menu ? chunkArray(data.menu, 3) : [];
  const chunkedGallery = data?.gallery ? chunkArray(data.gallery, 3) : [];



  return (
    <Transitions type="slide" direction="down" in={true}>
      <Grid container spacing={1} sx={{ pl: { xs: 0, sm: 4, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12} sm={7} md={7} lg={3} xl={3}>
          <MainCard title="Social Links">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack spacing={2.5} alignItems="center">
                  <Avatar
                    alt="Avatar 1"
                    size="xl"
                    src={data?.logo}
                    sx={{
                      width: 120, // Adjust size as needed
                      height: 100, // Adjust size as needed
                      borderRadius: 2 // This ensures a square shape
                    }}
                  />
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5">{data.fatherName}</Typography>
                    <Typography color="secondary">{data.role}</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>


              <Grid item xs={12} spacing={0.5}>

              <Stack spacing={0.5}>
                  <Typography color="secondary" variant='h5'>Instagram Page</Typography>
                  <Typography>{(data.instagramPage) ? data?.instagramPage : "no page avaliable"}</Typography>
                </Stack>

                <Stack spacing={0.5}>
                  <Typography color="secondary" variant='h5'>Facebook Page</Typography>
                  <Typography>{(data.facebookPage) ? data?.facebookPage : "no page avaliable"}</Typography>
                </Stack>

                <Stack spacing={0.5}>
                  <Typography color="secondary" variant='h5'>Website </Typography>
                  <Typography>{(data.website) ? data?.website : "no website avaliable"}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={9}>
          <Stack spacing={2.5}>
            <MainCard title="Vendor Details">
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" variant='h5'>Full Name</Typography>
                        <Typography>{data?.name}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" variant='h5'>Description</Typography>
                        <Typography>
                          {data.description}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" variant='h5'>Category Name</Typography>
                        <Typography>{data?.category?.categoryName

                        }</Typography>
                      </Stack>

                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" variant='h5'>Vendor Type</Typography>
                        <Typography>
                          {data.vendorType}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                {/* <ListItem>
                  <Grid container spacing={3}>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                      <Typography color="secondary" variant='h5'>Contact Number</Typography>
                        <Typography>{data?.telephone  }</Typography>
                      </Stack>

                    </Grid>

                    <Grid item xs={12} md={6}>
                      <ListItem>
                        <Stack spacing={0.5}>
                        <Stack spacing={0.5}>
                     
                      </Stack>
                        
                        </Stack>
                      </ListItem>

                    </Grid>
                  </Grid>
                </ListItem> */}
                {/* <ListItem>
                  <Grid container spacing={3}>

                    <Grid item xs={12} md={6}>
                    
                    <Typography color="secondary" variant='h5'>Location</Typography>
                          <Typography>{data?.location

                          }</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItem>
                        <Stack spacing={0.5}>
                          <Typography color="secondary" variant='h5'>
                            vendorType
                          </Typography>
                          <Typography>{data?.
                            vendorType


                          }</Typography>
                        </Stack>
                      </ListItem>

                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={3}>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" variant='h5'>
                          website
                        </Typography>
                        <Typography>{data?.
                          website


                        }</Typography>
                      </Stack>

                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItem>
                        <Stack spacing={0.5}>
                          <Typography color="secondary" variant='h5'>
                            FaceBook Page
                          </Typography>
                          <Typography>{data?.
                            facebookPage


                          }</Typography>
                        </Stack>
                      </ListItem>

                    </Grid>
                  </Grid>
                </ListItem> */}
              </List>
            </MainCard>
            <MainCard title="Branches">
              {data?.branches?.map((branch) => (
                <List key={branch.id}>
                  <ListItem divider={!matchDownMD}>
                    <Grid container spacing={3} alignItems="flex-start">
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary" variant='h5'>
                            Branch Address
                          </Typography>
                          <Typography>{branch?.address}</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary" variant='h5'>
                            Contact
                          </Typography>
                          <Typography>{branch?.telephone}</Typography>
                        </Stack>
                      </Grid>

                    </Grid>

                  </ListItem>
                </List>
              ))}
            </MainCard>
            <MainCard title="Menu Images">
      <Stack spacing={2}> {/* Stack for vertical spacing */}
        {chunkedMenu.map((chunk, index) => (
          <Stack key={index} spacing={2} direction="row"> {/* Stack to display three items horizontally */}
            {chunk.map((imageUrl, idx) => (
              <List key={`${index}-${idx}`}>
                <ListItem divider>
                  <Grid item xs={12}>
                    <Stack spacing={0.5} direction="row" alignItems="center">
                      <Avatar 
                        alt={`Menu Image ${index * 3 + idx + 1}`} 
                        variant="rounded" 
                        src={imageUrl} 
                        sx={{ width: 150, height: 150 }} // Increase the size of the Avatar
                      />
                    </Stack>
                  </Grid>
                </ListItem>
              </List>
            ))}
          </Stack>
        ))}
      </Stack>
    </MainCard>

    <MainCard title="Gallery Images">
      <Stack spacing={2}> 
        {chunkedGallery.map((chunk, index) => (
          <Stack key={index} spacing={2} direction="row"> 
            {chunk.map((imageUrl, idx) => (
              <List key={`${index}-${idx}`}>
                <ListItem divider>
                  <Grid item xs={12}>
                    <Stack spacing={0.5} direction="row" alignItems="center">
                      <Avatar 
                        alt={`Menu Image ${index * 3 + idx + 1}`} 
                        variant="rounded" 
                        src={imageUrl} 
                        sx={{ width: 150, height: 150 }} // Increase the size of the Avatar
                      />
                    </Stack>
                  </Grid>
                </ListItem>
              </List>
            ))}
          </Stack>
        ))}
      </Stack>
    </MainCard>

          </Stack>
        </Grid>
      </Grid>
    </Transitions>
  );
}

CustomerView.propTypes = { data: PropTypes.any };
