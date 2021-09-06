import { createTheme } from '@material-ui/core/styles';
import { defaultTheme } from "react-admin";

const Theme = createTheme({
    ...defaultTheme,
    palette: {
        type: 'dark', // Switching the dark mode on is a single property value change.
        primary: {
            main: '#cd1417'
        },
        secondary: {
            main: '#444444',
        },
        background: {
            // default: '#ffffff',
        },
    },
});

export default Theme