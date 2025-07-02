import React from "react";
import { UserHelper, Locale, ReportWithFilter, Permissions } from "@churchapps/apphelper";
import { Box, Typography, Stack } from "@mui/material";
import { VolunteerActivism as DonationIcon } from "@mui/icons-material";

export const DonationsPage = () => {

  if (!UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) return (<></>);
  
  return (
    <>
      {/* Modern Blue Header */}
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
              <DonationIcon sx={{ fontSize: 32, color: '#FFF' }} />
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
                {Locale.label("donations.donationsPage.don")}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                View donation summaries and analyze giving trends
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <ReportWithFilter keyName="donationSummary" autoRun={true} />
      </Box>
    </>
  );
}
