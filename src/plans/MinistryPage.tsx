import React from "react";
import { Tabs as MaterialTabs, Tab } from "@mui/material";
import { PlanList } from "./components/PlanList";
import { TeamList } from "./components/TeamList";
import { useParams } from "react-router-dom";
import { ApiHelper, GroupInterface, Locale } from "@churchapps/apphelper";

export const MinistryPage = () => {

  const [selectedTab, setSelectedTab] = React.useState("plans");
  const [tabIndex, setTabIndex] = React.useState(0);
  const params = useParams();
  const [ministry, setMinistry] = React.useState<GroupInterface>(null);

  const getCurrentTab = () => {

    let currentTab = <div></div>;
    if (ministry) {
      switch (selectedTab) {
        case "plans": currentTab = <PlanList ministry={ministry} />; break;
        case "teams": currentTab = <TeamList ministry={ministry} />; break;
      }
    }
    return currentTab;
  }

  const getTab = (index: number, keyName: string, text: string) => (
    <Tab key={index} style={{ textTransform: "none", color: "#000" }} onClick={() => { setSelectedTab(keyName); setTabIndex(index); }} label={<>{text}</>} />
  )

  const getTabs = () => {
    let tabs = [];
    tabs.push(getTab(0, "plans", Locale.label("plans.ministryPage.plans")));
    tabs.push(getTab(1, "teams", Locale.label("plans.ministryPage.teams")));
    return tabs;
  }

  const loadData = () => {
    ApiHelper.get("/groups/" + params.id, "MembershipApi").then((data) => { setMinistry(data); });
  };

  React.useEffect(loadData, [params.id]);

  return (<>

    <MaterialTabs value={tabIndex} style={{ borderBottom: "1px solid #CCC" }} data-cy="group-tabs">
      {getTabs()}
    </MaterialTabs>

    {getCurrentTab()}

  </>);
}

