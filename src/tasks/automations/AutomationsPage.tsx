import {
 Grid, Typography, Card, CardContent, Stack, Box, Container, Button, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText 
} from "@mui/material";
import React from "react";
import { Locale } from "@churchapps/apphelper";
import { useMountedState } from "@churchapps/apphelper";
import { ApiHelper, type AutomationInterface } from "@churchapps/apphelper";
import { AutomationDetails } from "./components/AutomationDetails";
import { AutomationEdit } from "./components/AutomationEdit";
import { SettingsSuggest as AutomationsIcon, Add as AddIcon, PlayCircle as ActiveIcon, PauseCircle as InactiveIcon } from "@mui/icons-material";

export const AutomationsPage = () => {
  const isMounted = useMountedState();
  const [automations, setAutomations] = React.useState<AutomationInterface[]>([]);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editAutomation, setEditAutomation] = React.useState(null);

  const loadData = () => {
    if (isMounted()) {
      ApiHelper.get("/automations", "DoingApi").then((data) => {
        if (isMounted()) setAutomations(data);
      });
    }
  };

  const getAutomationsList = () => {
    if (automations.length === 0) {
      return (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "grey.50",
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          <AutomationsIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No automations configured. Create your first automation to get started!
          </Typography>
        </Paper>
      );
    }

    return (
      <List sx={{ p: 0 }}>
        {automations.map((automation) => (
          <ListItem key={automation.id} disablePadding>
            <ListItemButton
              onClick={() => setEditAutomation(automation)}
              sx={{
                borderRadius: 1,
                mb: 1,
                border: "1px solid",
                borderColor: "grey.200",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon>{automation.active ? <ActiveIcon sx={{ color: "success.main" }} /> : <InactiveIcon sx={{ color: "grey.400" }} />}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                    {automation.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {automation.active ? "Active" : "Inactive"} • Recurs: {automation.recurs}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  };

  const handleAdded = (automation: AutomationInterface) => {
    setShowAdd(false);
    setEditAutomation(automation);
    loadData();
  };

  const handleDelete = () => {
    setEditAutomation(null);
    loadData();
  };

  React.useEffect(loadData, [isMounted]);

  return (
    <>
      {/* Modern Blue Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: "flex-start", md: "center" }} sx={{ width: "100%" }}>
          {/* Left side: Title and Icon */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AutomationsIcon sx={{ fontSize: 32, color: "#FFF" }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                }}
              >
                {Locale.label("tasks.automationsPage.manageAuto") || "Automations"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Automate tasks and workflows for your organization
              </Typography>
            </Box>
          </Stack>

          {/* Right side: Action Buttons */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexShrink: 0,
              justifyContent: { xs: "flex-start", md: "flex-end" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                setShowAdd(true);
                setEditAutomation(null);
              }}
              sx={{
                color: "#FFF",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Add Automation
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Automations Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: editAutomation || showAdd ? 8 : 12 }}>
            <Card
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <CardContent>
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <AutomationsIcon sx={{ color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                    {Locale.label("tasks.automationsPage.auto") || "Automated Tasks"}
                  </Typography>
                </Stack>

                {/* Content */}
                {getAutomationsList()}
              </CardContent>
            </Card>
          </Grid>

          {(showAdd || editAutomation) && (
            <Grid size={{ xs: 12, md: 4 }}>
              {showAdd && (
                <AutomationEdit
                  automation={{ title: "", active: true, recurs: "never" }}
                  onCancel={() => {
                    setShowAdd(false);
                  }}
                  onSave={handleAdded}
                />
              )}
              {editAutomation && <AutomationDetails automation={editAutomation} onChange={loadData} onDelete={handleDelete} />}
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};
