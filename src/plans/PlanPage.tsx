import React from "react";
import { useParams } from "react-router-dom";
import { ApiHelper, Locale, PageHeader } from "@churchapps/apphelper";
import { Assignment } from "./components/Assignment";
import { Box, Stack, Button, Container, Typography } from "@mui/material";
import { Assignment as AssignmentIcon, Album as AlbumIcon } from "@mui/icons-material";
import { ServiceOrder } from "./components/ServiceOrder";

export interface PlanInterface {
  id?: string;
  churchId?: string;
  name?: string;
  ministryId?: string;
  serviceDate?: Date;
  notes?: string;
  serviceOrder?: boolean;
}

export const PlanPage = () => {
  const params = useParams();
  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const loadData = async () => {
    ApiHelper.get("/plans/" + params.id, "DoingApi").then((data) => {
      setPlan(data);
    });
  };

  React.useEffect(() => {
    loadData();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps


  // Available tabs based on plan configuration
  const availableTabs = React.useMemo(() => {
    const tabs = [
      {
        key: "assignments",
        icon: <AssignmentIcon />,
        label: Locale.label("plans.planPage.assignments"),
        component: <Assignment plan={plan} />,
      },
    ];

    if (plan?.serviceOrder) {
      tabs.push({
        key: "order",
        icon: <AlbumIcon />,
        label: Locale.label("plans.planPage.serviceOrder"),
        component: <ServiceOrder plan={plan} />,
      });
    }

    return tabs;
  }, [plan]);

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
      <PageHeader 
        icon={<AssignmentIcon />} 
        title={plan.name || Locale.label("plans.planPage.servicePlan")} 
        subtitle="Service plan details and team assignments"
        actions={
          <Stack direction="row" spacing={1}>
            {availableTabs.map((tab, index) => (
              <Button
                key={tab.key}
                variant={selectedTab === index ? "contained" : "outlined"}
                startIcon={tab.icon}
                onClick={() => setSelectedTab(index)}
                sx={{
                  color: selectedTab === index ? "var(--c1l2)" : "#FFF",
                  backgroundColor: selectedTab === index ? "#FFF" : "transparent",
                  borderColor: selectedTab === index ? "#FFF" : "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "#FFF",
                    backgroundColor: selectedTab === index ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)",
                    color: selectedTab === index ? "var(--c1l2)" : "#FFF",
                  },
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        }
      />

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>{availableTabs[selectedTab]?.component}</Box>
    </>
  );
};
