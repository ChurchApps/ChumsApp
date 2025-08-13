import React from "react";
import { Box, Stack, Button } from "@mui/material";
import { Assignment as AssignmentIcon, People as PeopleIcon, Group as GroupIcon } from "@mui/icons-material";
import { PlanList } from "./components/PlanList";
import { PlanTypeList } from "./components/PlanTypeList";
import { TeamList } from "./components/TeamList";
import { useParams } from "react-router-dom";
import { type GroupInterface, Locale, Loading, PageHeader } from "@churchapps/apphelper";
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
      key: "types",
      icon: <AssignmentIcon />,
      label: Locale.label("plans.ministryPage.planTypes") || "Plan Types",
      component: ministry.data ? <PlanTypeList key="types" ministry={ministry.data} /> : null,
    },
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
      <PageHeader icon={<GroupIcon />} title={ministry.data.name} subtitle="Manage plan types, plans, and teams for this ministry">
        <Stack direction="row" spacing={1}>
          {tabs.map((tab, index) => (
            <Button
              key={tab.key}
              variant={selectedTab === index ? "contained" : "outlined"}
              startIcon={tab.icon}
              onClick={() => setSelectedTab(index)}
              sx={{
                color: selectedTab === index ? "primary.main" : "#FFF",
                backgroundColor: selectedTab === index ? "#FFF" : "transparent",
                borderColor: "#FFF",
                "&:hover": {
                  backgroundColor: selectedTab === index ? "#FFF" : "rgba(255,255,255,0.2)",
                  color: selectedTab === index ? "primary.main" : "#FFF",
                },
              }}>
              {tab.label}
            </Button>
          ))}
        </Stack>
      </PageHeader>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>{tabs[selectedTab]?.component}</Box>
    </>
  );
};
