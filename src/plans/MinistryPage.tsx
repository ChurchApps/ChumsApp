import React from "react";
import { Box, Typography, Stack, Button, Container } from "@mui/material";
import { Assignment as AssignmentIcon, People as PeopleIcon, Group as GroupIcon } from "@mui/icons-material";
import { PlanList } from "./components/PlanList";
import { TeamList } from "./components/TeamList";
import { useParams } from "react-router-dom";
import { type GroupInterface, Locale, Loading } from "@churchapps/apphelper";
import { useQuery } from "@tanstack/react-query";

export const MinistryPage = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const params = useParams();

  const ministry = useQuery<GroupInterface>({
    queryKey: [`/groups/${params.id}`, "MembershipApi"],
    enabled: !!params.id,
  });


  const tabs = [
    {
      key: "plans",
      icon: <AssignmentIcon />,
      label: Locale.label("plans.ministryPage.plans"),
      component: ministry.data ? <PlanList key="plans" ministry={ministry.data} /> : null,
    },
    {
      key: "teams",
      icon: <PeopleIcon />,
      label: Locale.label("plans.ministryPage.teams"),
      component: ministry.data ? <TeamList key="teams" ministry={ministry.data} /> : null,
    },
  ];

  if (ministry.isLoading) return <Loading />;
  if (!ministry.data) return null;

  return (
    <>
      {/* Modern Banner Header */}
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
              <GroupIcon sx={{ fontSize: 32, color: "#FFF" }} />
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
                {ministry.data.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Manage plans and teams for this ministry
              </Typography>
            </Box>
          </Stack>

          {/* Right side: Tab Buttons */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexShrink: 0,
              justifyContent: { xs: "flex-start", md: "flex-end" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            {tabs.map((tab, index) => (
              <Button
                key={tab.key}
                variant={selectedTab === index ? "contained" : "outlined"}
                startIcon={tab.icon}
                onClick={() => setSelectedTab(index)}
                sx={{
                  color: selectedTab === index ? "var(--c1l2)" : "#FFF",
                  backgroundColor: selectedTab === index ? "#FFF" : "transparent",
                  borderColor: selectedTab === index ? "#FFF" : "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "#FFF",
                    backgroundColor: selectedTab === index ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)",
                    color: selectedTab === index ? "var(--c1l2)" : "#FFF",
                  },
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>{tabs[selectedTab]?.component}</Box>
    </>
  );
};
