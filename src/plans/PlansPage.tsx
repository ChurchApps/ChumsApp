import React from "react";
import { MinistryList } from "./components/MinistryList";
import { Locale } from "@churchapps/apphelper";
import { 
  Box, 
  Typography, 
  Stack,
  Button
} from "@mui/material";
import { 
  Assignment as AssignmentIcon,
  Add as AddIcon
} from "@mui/icons-material";

export const PlansPage = () => {
  const [showAdd, setShowAdd] = React.useState(false);

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);

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
                {Locale.label("plans.plansPage.selMin")}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Manage your ministry teams, service plans, and team assignments
              </Typography>
            </Box>
          </Stack>
          
          {/* Right side: Add Button */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleShowAdd}
            sx={{
              color: '#FFF',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                borderColor: '#FFF',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Add Ministry
          </Button>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <MinistryList showAdd={showAdd} onCloseAdd={handleCloseAdd} />
      </Box>
    </>
  );
};

