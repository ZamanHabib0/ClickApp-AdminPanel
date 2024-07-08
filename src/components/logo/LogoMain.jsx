import { useTheme } from '@mui/material/styles';
 // Replace with the correct path to your dark mode logo
import logo from './LogoIcon' // Replace with the correct path to your light mode logo

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    <img
      src={theme.palette.mode === 'dark' ? logo : logo}
      alt="icon logo"
      width="100"
    />
  );
}