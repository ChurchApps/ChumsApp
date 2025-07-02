import React from "react";
import { useParams } from "react-router-dom";
import { ApiHelper, Locale } from "@churchapps/apphelper";
import { Assignment } from "./components/Assignment";
import { 
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  Button
} from "@mui/material";
import { 
  Assignment as AssignmentIcon, 
  Album as AlbumIcon,
  NavigateNext as NavigateNextIcon 
} from "@mui/icons-material";
import { ServiceOrder } from "./components/ServiceOrder";
import { Link, useNavigate } from "react-router-dom";

export interface PlanInterface { id?: string, churchId?: string, name?: string, ministryId?: string, serviceDate?: Date, notes?: string, serviceOrder?: boolean }

export const PlanPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const loadData = async () => {
    ApiHelper.get("/plans/" + params.id, "DoingApi").then(data => { setPlan(data); });
  }

  React.useEffect(() => { loadData(); }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Available tabs based on plan configuration
  const availableTabs = React.useMemo(() => {
    const tabs = [
      { 
        key: "assignments", 
        icon: <AssignmentIcon />, 
        label: Locale.label("plans.planPage.assignments"),
        component: <Assignment plan={plan} />
      }
    ];

    if (plan?.serviceOrder) {
      tabs.push({ 
        key: "order", 
        icon: <AlbumIcon />, 
        label: Locale.label("plans.planPage.serviceOrder"),
        component: <ServiceOrder plan={plan} />
      });
    }

    return tabs;
  }, [plan]);

  if (!plan) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">Loading plan...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      {/* Modern Banner Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 2 }}
          >
            <MuiLink
              component={Link}
              to="/plans"
              sx={{ 
                color: "rgba(255,255,255,0.8)", 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': { color: '#FFF' }
              }}
            >
              <AssignmentIcon sx={{ mr: 0.5, fontSize: 20 }} />
              Plans
            </MuiLink>
            <Typography sx={{ color: "#FFF", display: 'flex', alignItems: 'center' }}>
              {plan.name || Locale.label("plans.planPage.servicePlan")}
            </Typography>
          </Breadcrumbs>
          
          <Stack 
            direction={{ xs: "column", md: "row" }} 
            spacing={{ xs: 2, md: 4 }} 
            alignItems={{ xs: "flex-start", md: "center" }} 
            sx={{ width: "100%" }}
          >
            {/* Left side: Title and Icon */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <Box 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  borderRadius: '12px', 
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AssignmentIcon sx={{ fontSize: 32, color: '#FFF' }} />
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 0.5,
                    fontSize: { xs: '1.75rem', md: '2.125rem' }
                  }}
                >
                  {plan.name || Locale.label("plans.planPage.servicePlan")}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  Service plan details and team assignments
                </Typography>
              </Box>
            </Stack>
            
            {/* Right side: Tab Buttons */}
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                flexShrink: 0,
                justifyContent: { xs: "flex-start", md: "flex-end" },
                width: { xs: "100%", md: "auto" }
              }}
            >
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
                      color: selectedTab === index ? "var(--c1l2)" : "#FFF"
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>
        {availableTabs[selectedTab]?.component}
      </Box>
    </>
  );
};

