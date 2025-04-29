import React from "react";
import { Grid, Icon, Tabs as MaterialTabs, Tab } from "@mui/material";
import { PlanList } from "./components/PlanList";
import { TeamList } from "./components/TeamList";
import { useParams } from "react-router-dom";
import { ApiHelper, GroupInterface, Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";

export const MinistryPage = () => {

  const [selectedTab, setSelectedTab] = React.useState("plans");
  const params = useParams();
  const [ministry, setMinistry] = React.useState<GroupInterface>(null);

  const getCurrentTab = () => {

    let currentTab = <div></div>;
    if (ministry) {
      switch (selectedTab) {
        case "plans": currentTab = <PlanList key="plans" ministry={ministry} />; break;
        case "teams": currentTab = <TeamList key="teams" ministry={ministry} />; break;
      }
    }
    return currentTab;
  }


  const getItem = (tab: any) => {
    if (tab.key === selectedTab) return (
      <li key={tab.key} className="active">
        <a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}>
          <Icon>{tab.icon}</Icon> {tab.label}
        </a>
      </li>
    );
    return (
      <li key={tab.key}>
        <a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}>
          <Icon>{tab.icon}</Icon> {tab.label}
        </a>
      </li>
    );
  }

  const getTabs = () => {
    let tabs = [];
    tabs.push({ key: "plans", icon: "assignment", label: Locale.label("plans.ministryPage.plans") });
    tabs.push({ key: "teams", icon: "people", label: Locale.label("plans.ministryPage.teams") });

    if (selectedTab === "") setSelectedTab("plans");
    return tabs;
  }


  const loadData = () => {
    ApiHelper.get("/groups/" + params.id, "MembershipApi").then((data) => { setMinistry(data); });
  };

  React.useEffect(loadData, [params.id]);

  return (<>
    <Banner><h1>{ministry?.name}</h1></Banner>
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <div className="sideNav" style={{ height: "100vh", borderRight: "1px solid #CCC" }}>
          <ul>{getTabs().map((tab) => getItem(tab))}</ul>
        </div>
      </Grid>
      <Grid item xs={12} md={10}>
        <div id="mainContent">
          {getCurrentTab()}
        </div>
      </Grid>
    </Grid>

  </>);
}

