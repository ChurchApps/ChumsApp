import React, { memo } from "react";
import { UserHelper, Locale, Permissions } from "@churchapps/apphelper";
import { Box } from "@mui/material";
import { VolunteerActivism as DonationIcon } from "@mui/icons-material";
import { PageHeader } from "../components";
import { ReportWithFilter } from "../components/reporting/ReportWithFilter";

export const DonationsPage = memo(() => {
  if (!UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) return <></>;

  return (
    <>
      <PageHeader icon={<DonationIcon />} title={Locale.label("donations.donationsPage.don")} subtitle="View donation summaries and analyze giving trends" />

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <ReportWithFilter keyName="donationSummary" autoRun={true} />
      </Box>
    </>
  );
});
