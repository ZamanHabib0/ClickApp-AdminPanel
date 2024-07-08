import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import { APP_DEFAULT_PATH } from 'config';

import logoDark from '../../assets/simple_logo.png'; // Replace with the correct path to your dark mode logo
import logo from '../../assets/applogo.png'; // Replace with the correct path to your light mode logo

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection({ isIcon, sx, to }) {
  const theme = useTheme();
  const { isLoggedIn } = useAuth();

  return (
    <ButtonBase
      disableRipple
      {...(isLoggedIn && { component: Link, to: !to ? APP_DEFAULT_PATH : to, sx })}
    >
      <img
        src={theme.palette.mode === 'dark' ? logoDark : logo}
        alt="logo"
        width="50"
      />
    </ButtonBase>
  );
}

LogoSection.propTypes = {
  isIcon: PropTypes.bool,
  sx: PropTypes.any,
  to: PropTypes.any,
};