import { Assignment as AssignmentIcon, People as PeopleIcon } from "@mui/icons-material";
import React, { memo, useMemo } from "react";
import { NavigationTabs, type NavigationTab } from "../../components/ui";
import { Locale } from "@churchapps/apphelper";

interface Props {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export const MinistryNavigation = memo((props: Props) => {
  const { selectedTab, onTabChange } = props;

  const tabs: NavigationTab[] = useMemo(
    () => [
      { value: "types", label: Locale.label("plans.ministryPage.planTypes") || "Plan Types", icon: <AssignmentIcon /> },
      { value: "plans", label: Locale.label("plans.ministryPage.plans"), icon: <AssignmentIcon /> },
      { value: "teams", label: Locale.label("plans.ministryPage.teams"), icon: <PeopleIcon /> },
    ],
    []
  );

  return <NavigationTabs selectedTab={selectedTab} onTabChange={onTabChange} tabs={tabs} />;
});
