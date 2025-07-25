import React, { memo } from "react";
import { useParams } from "react-router-dom";
import { Locale } from "@churchapps/apphelper";
import {
  Box, Typography, Stack, Container, Card, CardContent, Skeleton, Breadcrumbs, Link as MuiLink
} from "@mui/material";
import { Summarize as SummarizeIcon, ArrowBack as BackIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ReportWithFilter } from "../components/reporting/ReportWithFilter";
import { type ReportInterface } from "@churchapps/helpers";

export const ReportPage = memo(() => {
  const params = useParams();

  const report = useQuery<ReportInterface>({
    queryKey: ["/reports/" + params.keyName, "ReportingApi"],
    placeholderData: null,
    enabled: !!params.keyName,
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }} separator="›">
          <MuiLink
            component={Link}
            to="/reports"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <BackIcon sx={{ mr: 0.5, fontSize: 16 }} />
            {Locale.label("reports.reportsPage.reports")}
          </MuiLink>
          <Typography color="text.primary">{report.isLoading ? <Skeleton width={150} /> : report.data?.displayName || Locale.label("reports.reportPage.report")}</Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <SummarizeIcon
              sx={{
                fontSize: 32,
                color: "primary.main",
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {report.isLoading ? <Skeleton width={300} /> : report.data?.displayName || Locale.label("reports.reportPage.report")}
            </Typography>
          </Stack>

          {!report.isLoading && report.data?.description && (
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
              {report.data.description}
            </Typography>
          )}
        </Box>

        {/* Report Content */}
        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            minHeight: 400,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {report.isLoading ? (
              <Box sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Skeleton variant="rectangular" height={60} />
                  <Skeleton variant="rectangular" height={200} />
                  <Stack direction="row" spacing={2}>
                    <Skeleton variant="rectangular" width={120} height={40} />
                    <Skeleton variant="rectangular" width={120} height={40} />
                  </Stack>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ "& .report-container": { p: 0 } }}>
                <ReportWithFilter keyName={params.keyName} autoRun={false} />
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
});
