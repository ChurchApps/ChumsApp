import React from "react";
import { useParams } from "react-router-dom";
import { ReportWithFilter, type ReportInterface, ApiHelper, Locale } from "@churchapps/apphelper";
import {
 Box, Typography, Stack, Container, Card, CardContent, Skeleton, Breadcrumbs, Link as MuiLink 
} from "@mui/material";
import { Summarize as SummarizeIcon, ArrowBack as BackIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

export const ReportPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [report, setReport] = React.useState<ReportInterface>(null);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(() => {
    if (params.keyName) {
      setLoading(true);
      ApiHelper.get("/reports/" + params.keyName, "ReportingApi")
        .then((data) => {
          setReport(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [params.keyName]);

  React.useEffect(loadData, [loadData]);

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
          <Typography color="text.primary">{loading ? <Skeleton width={150} /> : report?.displayName || Locale.label("reports.reportPage.report")}</Typography>
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
              {loading ? <Skeleton width={300} /> : report?.displayName || Locale.label("reports.reportPage.report")}
            </Typography>
          </Stack>

          {!loading && report?.description && (
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
              {report.description}
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
            {loading ? (
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
};
