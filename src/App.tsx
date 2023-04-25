import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ControlPanel } from "./ControlPanel";
import { UserProvider } from "./UserContext";
import { CookiesProvider } from "react-cookie";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "./appBase/components/markdownEditor/editor.css";
import {Helmet} from "react-helmet";
import { EnvironmentHelper } from "./helpers";

const mdTheme = createTheme({
  palette: {
    secondary: {
      main: "#444444"
    }
  },
  components: {
    MuiTextField: { defaultProps: { margin: "normal" } },
    MuiFormControl: { defaultProps: { margin: "normal" } }
  }
});

const App: React.FC = () => (
  <UserProvider>
    <CookiesProvider>
      <ThemeProvider theme={mdTheme}>
        <CssBaseline />
        <Helmet>
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

        </Helmet>
        <Router>
          <Routes>
            <Route path="/*" element={<ControlPanel />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </CookiesProvider>
  </UserProvider>
);
export default App;
