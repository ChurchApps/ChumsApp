import { createTheme } from "@mui/material";

export class Themes {
  static BaseTheme = createTheme({
    palette: { secondary: { main: "#444444" } },
    components: {
      MuiTextField: { defaultProps: { margin: "normal" } },
      MuiFormControl: { defaultProps: { margin: "normal" } }
    }
  });

  static NavBarStyle = { "& .selected .MuiListItemButton-root": { backgroundColor: "#333333" } }

}
