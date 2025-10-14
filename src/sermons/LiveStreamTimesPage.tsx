import React, { memo } from "react";
import { UserHelper, Permissions, PageHeader } from "@churchapps/apphelper";
import { Box } from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import { Services } from "./components/Services";

export const LiveStreamTimesPage = memo(() => {
  if (!UserHelper.checkAccess(Permissions.contentApi.streamingServices.edit)) return <></>;

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <PageHeader icon={<ScheduleIcon />} title="Live Stream Times" subtitle="Configure your recurring service times" />
      </Box>

      <Box sx={{ p: 3 }}>
        <Services />
      </Box>
    </>
  );
});
