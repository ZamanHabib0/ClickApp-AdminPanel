import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';



// project-imports
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';

// assets
import { Speaker, Profile2User, User, ShoppingBag } from 'iconsax-react';
import WelcomeBanner from 'sections/dashboard/default/WelcomeBanner';

export default function DashboardDefault() {
  const theme = useTheme();
  const [counts, setCounts] = useState({
    vendorCount: 0,
    userCount: 0,
    offerCount: 0,
    advertisementCount: 0
  });



  useEffect(() => {
    // Fetch the counts from the API
    const fetchCounts = async () => {

      let baseUrl = import.meta.env.VITE_APP_API_URL
      
      try {

        console.log("baseUrl" +baseUrl)

        console.log("hi bro counter here")

        const token = localStorage.getItem('authToken');

        // Configure request headers with token
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`, // Assuming token is in the format 'Bearer <token>'
          }
        };


        const response = await axios.get(`${baseUrl}/v1/adminpanel/dashboard` ,config); // Update the URL to match your API endpoint
        setCounts(response.data.data);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <WelcomeBanner />
      </Grid>

      {/* row 1 */}
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Total Vendors"
          count={counts.vendorCount}
          iconPrimary={<Profile2User />}
        >
          <EcommerceDataChart color={theme.palette.primary.main} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Total Users"
          count={counts.userCount}
          iconPrimary={<User color={theme.palette.warning.dark} />}
        >
          <EcommerceDataChart color={theme.palette.warning.dark} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Total Offers"
          count={counts.offerCount}
          iconPrimary={<ShoppingBag color={theme.palette.success.darker} />}
        >
          <EcommerceDataChart color={theme.palette.success.darker} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Total Advertisements"
          count={counts.advertisementCount}
          iconPrimary={<Speaker color={theme.palette.error.dark} />}
        >
          <EcommerceDataChart color={theme.palette.error.dark} />
        </EcommerceDataCard>
      </Grid>
    </Grid>
  );
}
