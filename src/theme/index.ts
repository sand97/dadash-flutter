import overrides from './overrides';
import typography from "./typography";
import palette from "./palette";
import {ThemeOptions} from "@mui/material";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const theme: ThemeOptions = ({
    palette,
    //@ts-ignore
    typography,
    components: {
        ...overrides
    },
})

const index = createTheme(theme);

export default index;