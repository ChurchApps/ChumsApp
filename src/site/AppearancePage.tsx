import React, { useCallback } from "react";
import { Box } from "@mui/material";
import { Style as StyleIcon } from "@mui/icons-material";
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
        icon={<StyleIcon />}
        title="Site Styles"
        subtitle="Below is a preview of a sample site with your colors, fonts and logos. This is not your actual site content."
      />
      <Box sx={{ p: 3 }}>
        {UserHelper.currentUserChurch && UserHelper.checkAccess(Permissions.contentApi.content.edit) && (
          <StylesManager />
        )}
      </Box>
    </>
  );
};
