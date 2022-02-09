import {colors, PaletteOptions} from "@mui/material";

const white = 'rgb(216, 218, 222)';
const black = '#000000';

const theme: PaletteOptions =  {
  primary: {
    main: '#00ab55',
    contrastText: 'rgb(255, 255, 255)',
  },
  secondary: {
    main: '#ffc107',
  },
  common: {
    white,
    black
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  info: {
    main: '#04297a',
  },
  text: {
    primary: white,
    secondary: 'rgb(134, 137, 152)',
  },
  background: {
    default: '#111318',
    paper: "#1e212a"
  },
  divider: "#2b2f3c"
};

export default theme