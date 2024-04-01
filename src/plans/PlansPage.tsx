import React, { useEffect } from "react";
import { Icon, Tabs as MaterialTabs, Tab } from "@mui/material";
import { PlanList } from "./components/PlanList";
import { TeamList } from "./components/TeamList";

export const PlansPage = () => {

  const [selectedTab, setSelectedTab] = React.useState("plans");
  const [tabIndex, setTabIndex] = React.useState(0);

  const getCurrentTab = () => {

    let currentTab = null;
    switch (selectedTab) {
      case "plans": currentTab = <PlanList />; break;
      case "teams": currentTab = <TeamList />; break;
      default: currentTab = <div>Not implemented</div>; break;
    }
    return currentTab
  }

  const getTab = (index: number, keyName: string, text: string) => (
    <Tab key={index} style={{ textTransform: "none", color: "#000" }} onClick={() => { setSelectedTab(keyName); setTabIndex(index); }} label={<>{text}</>} />
  )

  const getTabs = () => {
    let tabs = [];
    tabs.push(getTab(0, "plans", "Plans"));
    tabs.push(getTab(1, "teams", "Teams"));
    return tabs;
  }

  return (<>

    <MaterialTabs value={tabIndex} style={{ borderBottom: "1px solid #CCC" }} data-cy="group-tabs">
      {getTabs()}
    </MaterialTabs>

    {getCurrentTab()}

  </>);
}

