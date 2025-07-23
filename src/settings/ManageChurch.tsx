import React, { useState, useCallback } from "react";
import { type ChurchInterface, UserHelper, Permissions, Locale, ApiHelper, Loading } from "@churchapps/apphelper";
import { Navigate } from "react-router-dom";
import { Box, Typography, Stack, Button, IconButton } from "@mui/material";
import { Settings as SettingsIcon, Lock as LockIcon, PlayArrow as PlayArrowIcon, Language as LanguageIcon, LocationOn as LocationOnIcon, Edit as EditIcon } from "@mui/icons-material";
import { RolesTab, ChurchSettingsEdit } from "./components";
import { useQuery } from "@tanstack/react-query";

export const ManageChurch = () => {
  const [selectedTab, setSelectedTab] = React.useState("roles");
  const [showChurchSettings, setShowChurchSettings] = React.useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  const jwt = ApiHelper.getConfig("MembershipApi").jwt;
  const churchId = UserHelper.currentUserChurch.church.id;

  const church = useQuery<ChurchInterface>({
    queryKey: [`/churches/${churchId}?include=permissions`, "MembershipApi"],
    enabled: !!churchId,
  });

  const checkAccess = useCallback(() => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.settings.edit)) {
      setRedirectUrl("/");
    }
  }, []);

  const getCurrentTab = useCallback(() => {
    if (church.data) {
      switch (selectedTab) {
        case "roles":
          return <RolesTab church={church.data} />;
        default:
          return <div></div>;
      }
    }
    return <div></div>;
  }, [church.data, selectedTab]);

  const getDisplayAddress = useCallback(() => {
    const result: string[] = [];
    if (church.data) {
      if (!isEmpty(church.data.address1)) result.push(church.data.address1);
      if (!isEmpty(church.data.address2)) result.push(church.data.address2);
      if (!isEmpty(church.data.city)) {
        const cityStateZip = `${church.data.city}${church.data.state ? ", " + church.data.state : ""}${church.data.zip ? " " + church.data.zip : ""}`;
        result.push(cityStateZip);
      }
      if (!isEmpty(church.data.country)) result.push(church.data.country);
    }
    return result.join(", ");
  }, [church.data]);

  const isEmpty = (value: any) => value === undefined || value === null || value === "";

  const handleUpdated = useCallback(() => {
    setShowChurchSettings(false);
    church.refetch();
  }, [church]);

  React.useEffect(checkAccess, [checkAccess]);

  React.useEffect(() => {
    if (selectedTab === "" || selectedTab === "settings") setSelectedTab("roles");
  }, [selectedTab]);

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  if (church.isLoading) return <Loading />;
  if (!church.data) return <div>No church data available</div>;

  return (
    <>
      {/* Modern Banner Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: "flex-start", md: "center" }} sx={{ width: "100%" }}>
          {/* Left side: Title and Icon */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SettingsIcon sx={{ fontSize: 32, color: "#FFF" }} />
            </Box>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: { xs: "1.75rem", md: "2.125rem" },
                  }}
                >
                  {church.data?.name}
                </Typography>
                {UserHelper.checkAccess(Permissions.membershipApi.settings.edit) && (
                  <IconButton
                    size="small"
                    onClick={() => setShowChurchSettings(true)}
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      "&:hover": {
                        color: "#FFF",
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <LanguageIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.9)" }} />
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  }}
                >
                  {church.data?.subDomain ? `${church.data.subDomain}.churchapps.org` : "Church Management"}
                </Typography>
              </Stack>
              {getDisplayAddress() && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
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
              width: { xs: "100%", md: "auto" },
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
                  color: selectedTab === "roles" ? "var(--c1l2)" : "#FFF",
                },
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
                  color: "#FFF",
                },
              }}
            >
              {Locale.label("settings.manageChurch.imEx")}
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Church Settings Modal/Component */}
      {showChurchSettings && (
        <Box sx={{ p: 3 }}>
          <ChurchSettingsEdit church={church.data} updatedFunction={handleUpdated} />
        </Box>
      )}

      {/* Tab Content */}
      {selectedTab === "roles" && <Box sx={{ p: 3 }}>{getCurrentTab()}</Box>}


    </>
  );
};
