import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ControlPanel } from "./ControlPanel";
import { UserProvider } from "./UserContext";
import { CookiesProvider } from "react-cookie";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "@churchapps/apphelper-markdown/dist/components/markdownEditor/editor.css";
//TODO export the css from apphelper
import { EnvironmentHelper } from "./helpers";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

declare module "@mui/material/styles" {
  interface Palette {
    InputBox: {
      headerText: string;
    };
  }
  interface PaletteOptions {
    InputBox?: {
      headerText?: string;
    };
  }
}

const mdTheme = createTheme({
  palette: {
    mode: "light",
    InputBox: { headerText: "#333333" },
  },
  components: {
    MuiTextField: {
      defaultProps: { margin: "normal" },
      styleOverrides: {
        root: {
          marginTop: 16,
          marginBottom: 8,
          "& .MuiOutlinedInput-root": { "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" } },
        },
      },
    },
    MuiFormControl: {
      defaultProps: { margin: "normal" },
      styleOverrides: {
        root: {
          marginTop: 16,
          marginBottom: 8,
        },
      },
    },
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } }, // Disable uppercase transformation for better UX
    MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
  },
  shape: { borderRadius: 8 },
});

const App: React.FC = () => (
  <>
    {EnvironmentHelper.Common.GoogleAnalyticsTag && (
      <>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${EnvironmentHelper.Common.GoogleAnalyticsTag}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${EnvironmentHelper.Common.GoogleAnalyticsTag}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </>
    )}

    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <UserProvider>
            <Router>
              <Routes>
                <Route path="/*" element={<ControlPanel />} />
              </Routes>
            </Router>
          </UserProvider>
        </CookiesProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </>
);
export default App;
