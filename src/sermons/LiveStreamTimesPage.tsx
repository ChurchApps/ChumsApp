import React, { memo } from "react";
import { UserHelper, Permissions, PageHeader } from "@churchapps/apphelper";
import { Box } from "@mui/material";
import {
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";
import { Services, Links, Tabs, ExternalLinks } from "./components";
import { NavigationTabs } from "../components/ui/NavigationTabs";

export const LiveStreamTimesPage = memo(() => {
  const [selectedTab, setSelectedTab] = React.useState("services");

  if (!UserHelper.checkAccess(Permissions.contentApi.streamingServices.edit)) return <></>;

  const tabs = [
    { value: "services", label: "Services", icon: <PlayArrowIcon /> },
    { value: "settings", label: "Settings", icon: <SettingsIcon /> }
  ];

  const getCurrentTab = () => {
    switch (selectedTab) {
      case "services":
        return <Services />;
      case "settings":
        return (
          <>
            <Links category="streamingLink" />
            <Tabs />
            <ExternalLinks churchId={UserHelper.currentUserChurch.church.id} />
          </>
        );
      default:
        return <Services />;
    }
  };

  return (
    <>
      <PageHeader icon={<ScheduleIcon />} title="Live Stream Times" subtitle="Configure your recurring service times" />
      <NavigationTabs selectedTab={selectedTab} onTabChange={setSelectedTab} tabs={tabs} />
      <Box sx={{ p: 3 }}>
        {getCurrentTab()}
      </Box>
    </>
  );
});
