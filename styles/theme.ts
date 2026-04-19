import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    allVariants: {
      color: "#28293D",
    },
    body1: {
      fontFamily: "Poppins",
      fontSize: "1rem",
    },
    h1: {
      fontFamily: "Poppins",
      fontSize: "1.5rem",
    },
    caption: {
      fontFamily: "Poppins",
      fontWeight: "600",
    },
  },
  transitions: {
    duration: {
      shortest: 200,
      shorter: 250,
      short: 300,
      // most basic recommended timing
      standard: 350,
      // this is to be used in complex animations
      complex: 425,
      // recommended when something is entering screen
      enteringScreen: 275,
      // recommended when something is leaving screen
      leavingScreen: 245,
    },
  },
  /*palette: {
    primary: {
        main: "#FFFFFF",
    }
  }*/
});

// Enable responsive typography.
const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
