import React, { ReactNode } from "react";
import { Box, Typography, Stack } from "@mui/material";

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children?: ReactNode; // For action buttons or tabs
  statistics?: Array<{ icon: ReactNode; value: string; label: string }>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, subtitle, children, statistics }) => {
  return (
    <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: "flex-start", md: "center" }} sx={{ width: "100%" }}>
        {/* Left side: Title and Icon */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "12px",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {React.cloneElement(icon as React.ReactElement, { sx: { fontSize: 32, color: "#FFF" } })}
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                fontSize: { xs: "1.75rem", md: "2.125rem" },
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Right side: Action Buttons/Tabs */}
        {children && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexShrink: 0,
              justifyContent: { xs: "flex-start", md: "flex-end" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            {children}
          </Stack>
        )}
      </Stack>

      {/* Statistics row */}
      {statistics && statistics.length > 0 && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mt: 3 }}>
          {statistics.map((stat, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              {React.cloneElement(stat.icon as React.ReactElement, { sx: { color: "#FFF", fontSize: 20 } })}
              <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
                {stat.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
};
