import { createTheme } from "@mui/material";

export class Themes {
  static BaseTheme = createTheme({
    palette: {
      mode: "light",
      secondary: { main: "#444444" },
      background: {
        default: "#fafafa",
        paper: "#ffffff",
      },
    },
    components: {
      MuiTextField: {
        defaultProps: { margin: "normal" },
        styleOverrides: { root: { "& .MuiOutlinedInput-root": { backgroundColor: "rgba(255, 255, 255, 0.8)" } } },
      },
      MuiFormControl: { defaultProps: { margin: "normal" } },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 6,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
    shape: { borderRadius: 6 },
  });

  static NavBarStyle = {
    "& .selected .MuiListItemButton-root": {
      backgroundColor: "#555555",
      borderRadius: 4,
    },
  };
}
