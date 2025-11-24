import React from "react";
import { MinistryList } from "./components/MinistryList";
import { Locale, PageHeader } from "@churchapps/apphelper";
import { Box, Button } from "@mui/material";
import { Assignment as AssignmentIcon, Add as AddIcon } from "@mui/icons-material";

export const PlansPage = () => {
  const [showAdd, setShowAdd] = React.useState(false);

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);

  return (
    <>
      <PageHeader icon={<AssignmentIcon />} title={Locale.label("plans.plansPage.selMin")} subtitle={Locale.label("plans.plansPage.subtitle")}>
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
          }}>
          {Locale.label("plans.plansPage.addMinistry")}
        </Button>
      </PageHeader>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <MinistryList showAdd={showAdd} onCloseAdd={handleCloseAdd} />
      </Box>
    </>
  );
};
