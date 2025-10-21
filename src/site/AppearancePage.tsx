import React, { useCallback } from "react";
import { Box } from "@mui/material";
import { Palette as PaletteIcon } from "@mui/icons-material";
import { UserHelper, Permissions, PageHeader } from "@churchapps/apphelper";
import { Navigate } from "react-router-dom";
import { StylesManager } from "./components";

export const AppearancePage = () => {
  const [redirectUrl, setRedirectUrl] = React.useState<string>("");

  const checkAccess = useCallback(() => {
    if (!UserHelper.checkAccess(Permissions.contentApi.content.edit)) setRedirectUrl("/");
  }, []);

  React.useEffect(checkAccess, [checkAccess]);

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;

  return (
    <>
      <PageHeader
        icon={<PaletteIcon />}
        title="Appearance"
        subtitle="Customize the look and feel of your website"
      />
      <Box sx={{ p: 3 }}>
        {UserHelper.currentUserChurch && UserHelper.checkAccess(Permissions.contentApi.content.edit) && (
          <StylesManager />
        )}
      </Box>
    </>
  );
};
