import * as React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ApiHelper, UserHelper } from "@churchapps/apphelper";
import UserContext from "./UserContext";
import { LoginPage, Permissions } from "@churchapps/apphelper";
import { Alert, Box, Button, Grid, Icon } from "@mui/material";

export const OAuthPage: React.FC = (props: any) => {
  const [errors] = React.useState<string[]>([])
  const [cookies] = useCookies();
  const location = useLocation();
  const [clientName, setClientName] = React.useState<string>("");

  const context = React.useContext(UserContext);

  let search = new URLSearchParams(window.location.search);
  const clientId = search.get("client_id");
  const redirectUri = search.get("redirect_uri");
  const scope = search.get("scope");
  const responseType = search.get("response_type");
  const state = search.get("state");

  React.useEffect(() => {
    if (clientId) {
      ApiHelper.get(`/oauth/clients/clientId/${clientId}`, "MembershipApi").then(client => {
        if (client) setClientName(client.name);
      });
    }
  }, [clientId]);

  const handleAllow = async () => {
    try {
      const response = await ApiHelper.post("/oauth/authorize", {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: responseType,
        scope: scope,
        state: state
      }, "MembershipApi");

      if (response?.code) {
        // Redirect back to the client with the authorization code
        const redirectUrl = new URL(redirectUri || "");
        redirectUrl.searchParams.append("code", response.code);
        if (state) redirectUrl.searchParams.append("state", state);
        window.location.href = redirectUrl.toString();
      }
    } catch (error) {
      console.error("Authorization error:", error);
    }
  };

  return (<Box sx={{ display: "flex", backgroundColor: "#EEE", minHeight: "100vh" }}>
    <div style={{ marginLeft: "auto", marginRight: "auto", paddingTop: 20 }}>
      <Box sx={{ width: 500, minHeight: 100, backgroundColor: "#FFF", border: "1px solid #CCC", borderRadius: "5px", padding: "10px" }} px="16px" mx="auto">

        <div style={{ textAlign: "center", margin: 50 }}><img src={"/images/logo-login.png"} alt="logo" /></div>
        <Alert severity="info" style={{ fontWeight: "bold" }}>AUTHORIZATION REQUIRED</Alert>
        <div style={{ marginLeft: 50, marginRight: 50 }}>
          <div style={{ textAlign: "center" }}>

            <Icon style={{ fontSize: 120, marginTop: 30, color: "#777" }}>lock</Icon>
            <h2>{clientName || "Loading..."}</h2>
            <p>Would you like to access the following data from <b>{UserHelper.currentUserChurch.church.name}</b> in the above application?</p>
          </div>

          <ul>
            <li>Plans</li>
          </ul>
        </div>
        <div style={{ backgroundColor: "rgb(229, 246, 253)", padding: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} style={{ textAlign: "center" }}>
              <Button fullWidth variant="contained" color="error" onClick={() => { window.location.href = redirectUri || "/"; }}>Deny</Button>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "center" }}>
              <Button fullWidth variant="contained" color="primary" onClick={handleAllow}>Allow</Button>
            </Grid>
          </Grid>
        </div>


      </Box>
    </div>
  </Box>);
};
