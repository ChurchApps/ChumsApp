import React, { useState, useCallback } from "react";
import { type ChurchInterface, UserHelper, Permissions, Locale, ApiHelper, Loading, PageHeader } from "@churchapps/apphelper";
import { Navigate } from "react-router-dom";
import { Box, Stack, Button, IconButton } from "@mui/material";
import { Settings as SettingsIcon, Lock as LockIcon, PlayArrow as PlayArrowIcon, Edit as EditIcon } from "@mui/icons-material";
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
      <PageHeader 
        icon={<SettingsIcon />} 
        title={church.data?.name || "Church Management"} 
        subtitle={church.data?.subDomain ? `${church.data.subDomain}.churchapps.org` : "Church Settings"}
      >
        <Stack direction="row" spacing={1}>
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
              <EditIcon />
            </IconButton>
          )}
          <Button
            variant={selectedTab === "roles" ? "contained" : "outlined"}
            startIcon={<LockIcon />}
            onClick={() => setSelectedTab("roles")}
            sx={{
              color: selectedTab === "roles" ? "primary.main" : "#FFF",
              backgroundColor: selectedTab === "roles" ? "#FFF" : "transparent",
              borderColor: "#FFF",
              "&:hover": {
                backgroundColor: selectedTab === "roles" ? "#FFF" : "rgba(255,255,255,0.2)",
                color: selectedTab === "roles" ? "primary.main" : "#FFF",
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
              borderColor: "#FFF",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#FFF",
              },
            }}
          >
            {Locale.label("settings.manageChurch.imEx")}
          </Button>
        </Stack>
      </PageHeader>

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
