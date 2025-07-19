import React from "react";
import { UserHelper, Locale, Permissions } from "@churchapps/apphelper";
import { ReportWithFilter } from "../components";
import { Box } from "@mui/material";
import { VolunteerActivism as DonationIcon } from "@mui/icons-material";
import { PageHeader } from "../components";

export const DonationsPage = () => {
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
};
