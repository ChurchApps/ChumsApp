import React, { useState } from "react";
import { type ChurchInterface, ApiHelper, UserHelper, Permissions, Locale } from "@churchapps/apphelper"
import { Navigate } from "react-router-dom";
import { Box, Typography, Stack, Button } from "@mui/material";
import { Settings as SettingsIcon, Lock as LockIcon, PlayArrow as PlayArrowIcon, Language as LanguageIcon, LocationOn as LocationOnIcon } from "@mui/icons-material";
import { RolesTab } from "./components/RolesTab";

export const ManageChurch = () => {
  const [selectedTab, setSelectedTab] = React.useState("roles");
  const [church, setChurch] = useState<ChurchInterface | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>("");


  const jwt = ApiHelper.getConfig("MembershipApi").jwt;
  const churchId = UserHelper.currentUserChurch.church.id;


  const getCurrentTab = () => {
    if (church) {
      switch (selectedTab) {
        case "roles": return <RolesTab church={church} />;
        default: return <div></div>;
      }
    }
    return <div></div>;
  }

  const getDisplayAddress = () => {
    const result: string[] = [];
    if (church !== null) {
      if (!isEmpty(church.address1)) result.push(church.address1);
      if (!isEmpty(church.address2)) result.push(church.address2);
      if (!isEmpty(church.city)) {
        const cityStateZip = `${church.city}${church.state ? ', ' + church.state : ''}${church.zip ? ' ' + church.zip : ''}`;
        result.push(cityStateZip);
      }
      if (!isEmpty(church.country)) result.push(church.country);
    }
    return result.join(', ');
  }

  const isEmpty = (value: any) => value === undefined || value === null || value === ""



  const loadData = () => {
    //const churchId = params.id;
    if (!UserHelper.checkAccess(Permissions.membershipApi.settings.edit)) setRedirectUrl("/");
    ApiHelper.get("/churches/" + churchId + "?include=permissions", "MembershipApi").then(data => setChurch(data));
  }

  React.useEffect(loadData, [UserHelper.currentUserChurch.church.id]); //eslint-disable-line

  React.useEffect(() => {
    if (selectedTab === "" || selectedTab === "settings") setSelectedTab("roles");
  }, [selectedTab]);

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  if (!church) return <div>Loading...</div>;
  
  return (
    <>
      {/* Modern Banner Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={{ xs: 2, md: 4 }} 
          alignItems={{ xs: "flex-start", md: "center" }} 
          sx={{ width: "100%" }}
        >
          {/* Left side: Title and Icon */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '12px', 
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SettingsIcon sx={{ fontSize: 32, color: '#FFF' }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  fontSize: { xs: '1.75rem', md: '2.125rem' }
                }}
              >
                {church?.name}
              </Typography>
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <LanguageIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.9)' }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  {church?.subDomain ? `${church.subDomain}.churchapps.org` : 'Church Management'}
                </Typography>
              </Stack>
              {getDisplayAddress() && (
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center"
                >
                  <LocationOnIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: { xs: '0.75rem', md: '0.875rem' }
                    }}
                  >
                    {getDisplayAddress()}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>
          
          {/* Right side: Navigation Buttons */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              flexShrink: 0,
              justifyContent: { xs: "flex-start", md: "flex-end" },
              width: { xs: "100%", md: "auto" }
            }}
          >
            <Button
              variant={selectedTab === "roles" ? "contained" : "outlined"}
              startIcon={<LockIcon />}
              onClick={() => setSelectedTab("roles")}
              sx={{
                color: selectedTab === "roles" ? "var(--c1l2)" : "#FFF",
                backgroundColor: selectedTab === "roles" ? "#FFF" : "transparent",
                borderColor: selectedTab === "roles" ? "#FFF" : "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: selectedTab === "roles" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)",
                  color: selectedTab === "roles" ? "var(--c1l2)" : "#FFF"
                }
              }}
            >
              {Locale.label("settings.roles.roles")}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PlayArrowIcon />}
              href={`https://transfer.chums.org/login?jwt=${jwt}&churchId=${churchId}`}
              target="_blank"
              rel="noreferrer noopener"
              sx={{
                color: "#FFF",
                backgroundColor: "transparent",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#FFF"
                }
              }}
            >
              {Locale.label("settings.manageChurch.imEx")}
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Tab Content */}
      {selectedTab === "roles" && (
        <Box sx={{ p: 3 }}>
          {getCurrentTab()}
        </Box>
      )}
    </>
  );
}

