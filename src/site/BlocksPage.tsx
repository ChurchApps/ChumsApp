import React, { useCallback } from "react";
import { Box, Alert } from "@mui/material";
import { Widgets as WidgetsIcon } from "@mui/icons-material";
import { UserHelper, Permissions, PageHeader } from "@churchapps/apphelper";
import { Navigate } from "react-router-dom";

export const BlocksPage = () => {
  const [redirectUrl, setRedirectUrl] = React.useState<string>("");

  const checkAccess = useCallback(() => {
    if (!UserHelper.checkAccess(Permissions.contentApi.content.edit)) setRedirectUrl("/");
  }, []);

  React.useEffect(checkAccess, [checkAccess]);

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;

  return (
    <>
      <PageHeader
        icon={<WidgetsIcon />}
        title="Blocks"
        subtitle="Create reusable content blocks for your website"
      />
      <Box sx={{ p: 3 }}>
        {UserHelper.currentUserChurch && UserHelper.checkAccess(Permissions.contentApi.content.edit) && (
          <Alert severity="info">Block editor coming soon. This will allow you to create reusable content blocks for your website.</Alert>
        )}
      </Box>
    </>
  );
};
