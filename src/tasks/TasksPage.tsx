import React from "react";
import { Locale, PageHeader } from "@churchapps/apphelper";
import { TaskList } from "./components/TaskList";
import { Box, Button } from "@mui/material";
import { Assignment as TaskIcon, SettingsSuggest as AutomationsIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const TasksPage = () => {
  const [status, setStatus] = React.useState("Open");

  return (
    <>
      <PageHeader
        icon={<TaskIcon />}
        title={Locale.label("tasks.tasksPage.tasks")}
        subtitle="Manage tasks, assignments, and automated workflows"
      >
        <Button
          component={Link}
          to="/tasks/automations"
          variant="outlined"
          startIcon={<AutomationsIcon />}
          data-testid="automations-button"
          aria-label="Go to automations"
          sx={{
            color: "#FFF",
            borderColor: "rgba(255,255,255,0.5)",
            "&:hover": {
              borderColor: "#FFF",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          {Locale.label("tasks.tasksPage.auto")}
        </Button>
      </PageHeader>

      {/* Task List */}
      <Box sx={{ p: 3 }}>
        <TaskList status={status} onStatusChange={setStatus} />
      </Box>
    </>
  );
};
