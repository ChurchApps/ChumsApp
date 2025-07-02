import React from "react";
import { Locale } from "@churchapps/apphelper";
import { 
  Grid, 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Card,
  CardContent 
} from "@mui/material";
import { 
  Church as ChurchIcon, 
  ShowChart as UsageIcon, 
  Book as TranslationIcon,
  Settings as AdminIcon 
} from "@mui/icons-material";
import { PageHeader } from "../components";
import { UsageTrendsTab } from "./components/UsageTrendTab";
import { ChurchesTab } from "./components/ChurchesTab";
import { TranslationTab } from "./components/TranslationTab";

export const AdminPage = () => {
  const [selectedTab, setSelectedTab] = React.useState("churches");

  const getCurrentTab = () => {
    switch (selectedTab) {
      case "churches": return <ChurchesTab key="churches" />;
      case "usage": return <UsageTrendsTab key="usage" />;
      case "translation": return <TranslationTab key="translation" />;
      default: return <div></div>;
    }
  }

  const navigationItems = [
    { 
      key: "churches", 
      icon: <ChurchIcon />, 
      label: Locale.label("serverAdmin.adminPage.churches") 
    },
    { 
      key: "usage", 
      icon: <UsageIcon />, 
      label: Locale.label("serverAdmin.adminPage.usageTrends") 
    },
    { 
      key: "translation", 
      icon: <TranslationIcon />, 
      label: "Translation Lookups" 
    }
  ];

  return (
    <>
      <PageHeader
        icon={<AdminIcon />}
        title={Locale.label("serverAdmin.adminPage.servAdmin")}
        subtitle="Manage server administration settings and monitor usage"
      />
      
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent sx={{ p: 0 }}>
                <List sx={{ py: 0 }}>
                  {navigationItems.map((item) => (
                    <ListItem key={item.key} disablePadding>
                      <ListItemButton
                        selected={selectedTab === item.key}
                        onClick={() => setSelectedTab(item.key)}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            },
                            '& .MuiListItemIcon-root': {
                              color: 'primary.contrastText',
                            },
                          },
                        }}
                      >
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Box>
              {getCurrentTab()}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
