import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import { Card, I24Support, Logout, Profile, Brodcast } from 'iconsax-react';

export default function ProfileTab({ handleLogout }) {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);

    if (route && route !== '') {
      navigate(route);
    }
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2, '/profiles/account/settings')}>
        <ListItemIcon>
          <Profile variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Account Settings" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4, '/profiles/account/Message-Brodcast')}>
        <ListItemIcon>
          <Brodcast variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Message Brodcast" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3, '/profiles/account/support-list')}>
        <ListItemIcon>
          <I24Support variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Support" />
      </ListItemButton>

    
      <ListItemButton selected={selectedIndex === 5} onClick={handleLogout}>
        <ListItemIcon>
          <Logout variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
