import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {grey, blueGrey} from '@material-ui/core/colors';

const customTheme = createMuiTheme({
    "palette": {
        "common": {
            "black": "#000000",
            "white": "#ffffff",
            "grey": grey[600]
        },
        "background": {
            "paper": grey[100],
            "default": "#ffffff"
        },
        "primary": {
            "light": blueGrey[200],
            "main": blueGrey[300],
            "dark": blueGrey[500],
            "contrastText": "#ffffff"
        },
        "secondary": {
            "light": blueGrey[600],
            "main": blueGrey[800],
            "dark": blueGrey[900],
            "contrastText": "#ffffff"
        },
        "error": {
            "light": "#e57373",
            "main": "rgba(235, 150, 23, 1)",
            "dark": "#d32f2f",
            "contrastText": "#fff"
        },
        "text": {
            "primary": "rgba(0, 0, 0, 0.87)",
            "secondary": "rgba(0, 0, 0, 0.54)",
            "disabled": "rgba(0, 0, 0, 0.38)",
            "hint": "rgba(33, 119, 142, 1)"
        }
    }
});

export default customTheme;