import React, { memo } from "react";
import { UserHelper, Permissions, PageHeader, Locale } from "@churchapps/apphelper";
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
    { value: "services", label: Locale.label("sermons.liveStreamTimes.services"), icon: <PlayArrowIcon /> },
    { value: "settings", label: Locale.label("sermons.liveStreamTimes.settings"), icon: <SettingsIcon /> }
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
      <PageHeader icon={<ScheduleIcon />} title={Locale.label("sermons.liveStreamTimes.title")} subtitle={Locale.label("sermons.liveStreamTimes.subtitle")} />
      <NavigationTabs selectedTab={selectedTab} onTabChange={setSelectedTab} tabs={tabs} />
      <Box sx={{ p: 3 }}>
        {getCurrentTab()}
      </Box>
    </>
  );
});
