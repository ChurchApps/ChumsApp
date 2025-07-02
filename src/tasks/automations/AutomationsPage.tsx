import { 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Stack, 
  Box, 
  Container, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText 
} from "@mui/material";
import React from "react";
import { Locale } from "@churchapps/apphelper";
import { useMountedState } from "@churchapps/apphelper";
import { ApiHelper, type AutomationInterface } from "@churchapps/apphelper";
import { AutomationDetails } from "./components/AutomationDetails";
import { AutomationEdit } from "./components/AutomationEdit";
import {
  SettingsSuggest as AutomationsIcon,
  Add as AddIcon,
  PlayCircle as ActiveIcon,
  PauseCircle as InactiveIcon
} from "@mui/icons-material";

export const AutomationsPage = () => {
  const isMounted = useMountedState();
  const [automations, setAutomations] = React.useState<AutomationInterface[]>([])
  const [showAdd, setShowAdd] = React.useState(false);
  const [editAutomation, setEditAutomation] = React.useState(null);

  const loadData = () => {
    if (isMounted()) {
      ApiHelper.get("/automations", "DoingApi").then(data => {
        if (isMounted()) setAutomations(data);
      });
    }
  }

  const getAutomationsList = () => {
    if (automations.length === 0) {
      return (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <AutomationsIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
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
                border: '1px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                {automation.active ? (
                  <ActiveIcon sx={{ color: 'success.main' }} />
                ) : (
                  <InactiveIcon sx={{ color: 'grey.400' }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    {automation.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {automation.active ? 'Active' : 'Inactive'} • Recurs: {automation.recurs}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }

  const handleAdded = (automation: AutomationInterface) => {
    setShowAdd(false);
    setEditAutomation(automation);
    loadData();
  }

  const handleDelete = () => {
    setEditAutomation(null);
    loadData();
  }

  React.useEffect(loadData, [isMounted]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Modern Header */}
      <Box sx={{ 
        backgroundColor: 'var(--c1l2)', 
        color: '#FFF', 
        p: 3, 
        borderRadius: 2,
        mb: 3
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <AutomationsIcon sx={{ fontSize: 32 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: "1.75rem", md: "2.125rem" }
            }}
          >
            {Locale.label("tasks.automationsPage.manageAuto")}
          </Typography>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <CardContent>
              {/* Header */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AutomationsIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {Locale.label("tasks.automationsPage.auto")}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => { setShowAdd(true); setEditAutomation(null); }}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Add Automation
                </Button>
              </Stack>

              {/* Content */}
              {getAutomationsList()}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          {showAdd && <AutomationEdit automation={{ title: "", active: true, recurs: "never" }} onCancel={() => { setShowAdd(false); }} onSave={handleAdded} />}
          {editAutomation && <AutomationDetails automation={editAutomation} onChange={loadData} onDelete={handleDelete} />}
        </Grid>
      </Grid>
    </Container>
  );
};
