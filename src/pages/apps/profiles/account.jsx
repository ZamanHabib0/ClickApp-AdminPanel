import { useEffect, useState } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// project-imports
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';

// assets
import { DocumentText, Lock, Profile, Profile2User, Setting3, TableDocument } from 'iconsax-react';

// ==============================|| PROFILE - ACCOUNT ||============================== //

export default function AccountProfile() {
  const { pathname } = useLocation();

  let selectedTab = 0;
  let breadcrumbTitle = '';
  let breadcrumbHeading = '';
  switch (pathname) {
    case '/profiles/account/settings':
    default:
      breadcrumbTitle = 'Account Settings';
      breadcrumbHeading = 'Account Settings';
      selectedTab = 0;
      break;
      
    case '/profiles/account/support-list':
      breadcrumbTitle = 'Support';
      breadcrumbHeading = 'Support';
      selectedTab = 1;
      break;
  }

  const [value, setValue] = useState(selectedTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Account Profile', to: '/profiles/account/settings' },
    { title: breadcrumbTitle }
  ];

  useEffect(() => {
    if (pathname === '/profiles/account/settings') {
      setValue(0);
    } else if (pathname === '/profiles/account/support-list') {
      setValue(1);
    }
  }, [pathname]);

  return (
    <>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <MainCard border={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="Settings" component={Link} to="/profiles/account/settings" icon={<Setting3 />} iconPosition="start" />
            <Tab label="Support" component={Link} to="/profiles/account/support-list" icon={<Profile2User />} iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Outlet />
        </Box>
      </MainCard>
    </>
  );
}
