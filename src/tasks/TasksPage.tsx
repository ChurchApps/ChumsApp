import React from "react";
import { Locale } from "@churchapps/apphelper";
import { TaskList } from "./components/TaskList";
import { 
  Box, 
  Typography, 
  Stack, 
  Button
} from "@mui/material";
import {
  Assignment as TaskIcon,
  SettingsSuggest as AutomationsIcon,
  CheckBoxOutlined as OpenIcon,
  CheckBox as ClosedIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export const TasksPage = () => {
  const [status, setStatus] = React.useState("Open");

  return (
    <>
      {/* Modern Blue Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
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
              <TaskIcon sx={{ fontSize: 32, color: '#FFF' }} />
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
                {Locale.label("tasks.tasksPage.tasks")}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Manage tasks, assignments, and automated workflows
              </Typography>
            </Box>
          </Stack>
          
          {/* Right side: Action Buttons */}
          <Stack 
            direction="row" 
            spacing={1} 
            flexWrap="wrap" 
            sx={{ 
              flexShrink: 0,
              justifyContent: { xs: "flex-start", md: "flex-end" },
              width: { xs: "100%", md: "auto" }
            }}
            useFlexGap
          >
            <Button
              component={Link}
              to="/tasks/automations"
              variant="outlined"
              startIcon={<AutomationsIcon />}
              data-testid="automations-button"
              aria-label="Go to automations"
              sx={{
                color: '#FFF',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: '#FFF',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {Locale.label("tasks.tasksPage.auto")}
            </Button>
            
            {status === "Open" ? (
              <Button
                variant="outlined"
                startIcon={<ClosedIcon />}
                onClick={() => setStatus("Closed")}
                data-testid="show-closed-tasks-button"
                aria-label="Show closed tasks"
                sx={{
                  color: '#FFF',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: '#FFF',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {Locale.label("tasks.tasksPage.showClosed")}
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<OpenIcon />}
                onClick={() => setStatus("Open")}
                data-testid="show-open-tasks-button"
                aria-label="Show open tasks"
                sx={{
                  color: '#FFF',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: '#FFF',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {Locale.label("tasks.tasksPage.showOpen")}
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Task List */}
      <Box sx={{ p: 3 }}>
        <TaskList status={status} />
      </Box>
    </>
  );
};
