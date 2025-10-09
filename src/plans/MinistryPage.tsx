import React from "react";
import { Box } from "@mui/material";
import { Group as GroupIcon } from "@mui/icons-material";
import { PlanList } from "./components/PlanList";
import { PlanTypeList } from "./components/PlanTypeList";
import { TeamList } from "./components/TeamList";
import { MinistryNavigation } from "./components/MinistryNavigation";
import { useParams } from "react-router-dom";
import { type GroupInterface, Loading, PageHeader } from "@churchapps/apphelper";
import { useQuery } from "@tanstack/react-query";

export const MinistryPage = () => {
  const [selectedTab, setSelectedTab] = React.useState("types");
  const params = useParams();

  const ministry = useQuery<GroupInterface>({
    queryKey: [`/groups/${params.id}`, "MembershipApi"],
    enabled: !!params.id,
  });

  const getCurrentTab = () => {
    if (!ministry.data) return null;
    if (selectedTab === "types") return <PlanTypeList key="types" ministry={ministry.data} />;
    if (selectedTab === "plans") return <PlanList key="plans" ministry={ministry.data} />;
    if (selectedTab === "teams") return <TeamList key="teams" ministry={ministry.data} />;
    return null;
  };

  if (ministry.isLoading) return <Loading />;
  if (!ministry.data) return null;

  return (
    <>
      <PageHeader icon={<GroupIcon />} title={ministry.data.name} subtitle="Manage plan types, plans, and teams for this ministry" />
      <MinistryNavigation selectedTab={selectedTab} onTabChange={setSelectedTab} />

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>{getCurrentTab()}</Box>
    </>
  );
};
