import React from "react";
import { MinistryList } from "./components/MinistryList";
import { Locale, PageHeader } from "@churchapps/apphelper";
import { Box, Typography, Stack, Button } from "@mui/material";
import { Assignment as AssignmentIcon, Add as AddIcon } from "@mui/icons-material";

export const PlansPage = () => {
  const [showAdd, setShowAdd] = React.useState(false);

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);

  return (
    <>
      <PageHeader
        icon={<AssignmentIcon />}
        title={Locale.label("plans.plansPage.selMin")}
        subtitle="Manage your ministry teams, service plans, and team assignments"
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleShowAdd}
          sx={{
            color: "#FFF",
            borderColor: "rgba(255,255,255,0.5)",
            "&:hover": {
              borderColor: "#FFF",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Add Ministry
        </Button>
      </PageHeader>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <MinistryList showAdd={showAdd} onCloseAdd={handleCloseAdd} />
      </Box>
    </>
  );
};
