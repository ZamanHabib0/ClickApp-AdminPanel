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
import { DocumentText, Lock, Profile, Profile2User, Setting3, Brodcast } from 'iconsax-react';

// ==============================|| PROFILE - ACCOUNT ||============================== //

export default function AccountProfile() {
  const { pathname } = useLocation();

  // Initialize state for selected tab based on pathname
  const [value, setValue] = useState(() => {
    switch (pathname) {
      case '/profiles/account/support-list':
        return 1;
      case '/profiles/account/Message-Brodcast':
        return 2; // Make sure this corresponds to the correct index
      case '/profiles/account/settings':
      default:
        return 0;
    }
  });

  let breadcrumbTitle = '';
  let breadcrumbHeading = '';

  switch (pathname) {
    case '/profiles/account/settings':
      breadcrumbTitle = 'Account Settings';
      breadcrumbHeading = 'Account Settings';
      break;
    case '/profiles/account/support-list':
      breadcrumbTitle = 'Support';
      breadcrumbHeading = 'Support';
      break;
    case '/profiles/account/Message-Brodcast':
      breadcrumbTitle = 'Message Brodcast';
      breadcrumbHeading = 'Message Brodcast';
      break;
  }

  let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Account Profile', to: '/profiles/account/settings' },
    { title: breadcrumbTitle }
  ];

  useEffect(() => {
    switch (pathname) {
      case '/profiles/account/settings':
        setValue(0);
        break;
      case '/profiles/account/support-list':
        setValue(1);
        break;
      case '/profiles/account/Message-Brodcast':
        setValue(2); // Set the correct index for the Message Brodcast tab
        break;
      default:
        setValue(0);
    }
  }, [pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <MainCard border={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="Settings" component={Link} to="/profiles/account/settings" icon={<Setting3 />} iconPosition="start" />
            <Tab label="Support" component={Link} to="/profiles/account/support-list" icon={<Profile2User />} iconPosition="start" />
            <Tab label="Message Brodcast" component={Link} to="/profiles/account/Message-Brodcast" icon={<Brodcast />} iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Outlet />
        </Box>
      </MainCard>
    </>
  );
}
