import React from "react";
import { useParams } from "react-router-dom";
import { ApiHelper, Locale, PageHeader } from "@churchapps/apphelper";
import { type PlanInterface } from "../helpers";
import { Assignment } from "./components/Assignment";
import { PlanNavigation } from "./components/PlanNavigation";
import { Box, Container, Typography } from "@mui/material";
import { Assignment as AssignmentIcon } from "@mui/icons-material";
import { ServiceOrder } from "./components/ServiceOrder";



export const PlanPage = () => {
  const params = useParams();
  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [selectedTab, setSelectedTab] = React.useState("assignments");

  const loadData = async () => {
    ApiHelper.get("/plans/" + params.id, "DoingApi").then((data) => {
      setPlan(data);
    });
  };

  React.useEffect(() => {
    loadData();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCurrentTab = () => {
    if (selectedTab === "assignments") return <Assignment plan={plan} />;
    if (selectedTab === "order") return <ServiceOrder plan={plan} />;
    return null;
  };

  if (!plan) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            Loading plan...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <PageHeader icon={<AssignmentIcon />} title={plan.name || Locale.label("plans.planPage.servicePlan")} subtitle="Service plan details and team assignments" />
      <PlanNavigation selectedTab={selectedTab} onTabChange={setSelectedTab} plan={plan} />

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>{getCurrentTab()}</Box>
    </>
  );
};
