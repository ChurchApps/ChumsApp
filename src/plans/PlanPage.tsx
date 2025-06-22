import React from "react";
import { useParams } from "react-router-dom";
import { ApiHelper, Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { Assignment } from "./components/Assignment";
import { Grid, Icon } from "@mui/material";
import { ServiceOrder } from "./components/ServiceOrder";

export interface PlanInterface { id?: string, churchId?: string, name?: string, ministryId?: string, serviceDate?: Date, notes?: string, serviceOrder?: boolean }

export const PlanPage = () => {
  const params = useParams();
  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [selectedTab, setSelectedTab] = React.useState("assignments");

  const loadData = async () => {
    ApiHelper.get("/plans/" + params.id, "DoingApi").then(data => { setPlan(data); });
  }

  React.useEffect(() => { loadData(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps


  const getTabs = () => {
    const tabs = [];
    tabs.push({ key: "assignments", icon: "assignment", label: Locale.label("plans.planPage.assignments") });
    if (plan && plan.serviceOrder) {
      tabs.push({ key: "order", icon: "album", label: Locale.label("plans.planPage.serviceOrder") });
    }
    console.log("Plan is:", plan);

    if (selectedTab === "") setSelectedTab("assignments");
    return tabs;
  }


  const getItem = (tab: any) => {
    if (tab.key === selectedTab) return (<li className="active"><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
    return (<li><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
  }

  return (<>
    <Banner><h1>{(plan?.name) ? plan.name : Locale.label("plans.planPage.servicePlan")}</h1></Banner>
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <div className="sideNav" style={{ height: "100vh", borderRight: "1px solid #CCC" }}>
          <ul>
            {getTabs().map((tab, index) => getItem(tab))}
          </ul>
        </div>
      </Grid>
      <Grid item xs={12} md={10}>
        <div id="mainContent">
          {plan && selectedTab === "assignments" && <Assignment plan={plan} />}
          {plan && selectedTab === "order" && <ServiceOrder plan={plan} />}
        </div>
      </Grid>
    </Grid>

  </>)
};

