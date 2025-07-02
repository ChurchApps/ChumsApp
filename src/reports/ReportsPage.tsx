import React from "react";
import { Locale } from "@churchapps/apphelper";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Paper
} from "@mui/material";
import {
  Summarize as SummarizeIcon,
  CakeOutlined as BirthdayIcon,
  TrendingUp as TrendIcon,
  Groups as GroupsIcon,
  Today as DailyIcon,
  VolunteerActivism as DonationIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export const ReportsPage = () => {
  const reportItems = [
    {
      path: "/reports/birthdays",
      label: Locale.label("reports.reportsPage.bDays"),
      icon: <BirthdayIcon />,
      description: "View upcoming birthdays and anniversaries"
    },
    {
      path: "/reports/attendanceTrend",
      label: Locale.label("reports.reportsPage.attTrend"),
      icon: <TrendIcon />,
      description: "Analyze attendance patterns over time"
    },
    {
      path: "/reports/groupAttendance",
      label: Locale.label("reports.reportsPage.groupAtt"),
      icon: <GroupsIcon />,
      description: "Review group attendance statistics"
    },
    {
      path: "/reports/dailyGroupAttendance",
      label: Locale.label("reports.reportsPage.dailyGroupAtt"),
      icon: <DailyIcon />,
      description: "Daily breakdown of group attendance"
    },
    {
      path: "/reports/donationSummary",
      label: Locale.label("reports.reportsPage.donSum"),
      icon: <DonationIcon />,
      description: "Financial giving and donation summaries"
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <SummarizeIcon 
              sx={{ 
                fontSize: 32, 
                color: 'primary.main' 
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary' 
              }}
            >
              {Locale.label("reports.reportsPage.reports")}
            </Typography>
          </Stack>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ maxWidth: 600 }}
          >
            Generate detailed reports and analytics for your church management needs. 
            Choose from various report types to gain insights into attendance, membership, and giving patterns.
          </Typography>
        </Box>

        {/* Reports Grid */}
        <Card 
          elevation={2}
          sx={{ 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <List sx={{ p: 0 }}>
              {reportItems.map((item, index) => (
                <React.Fragment key={item.path}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      sx={{
                        py: 2.5,
                        px: 3,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          transform: 'translateX(4px)',
                          '& .MuiListItemIcon-root': {
                            color: 'primary.main',
                            transform: 'scale(1.1)'
                          }
                        }
                      }}
                    >
                      <ListItemIcon 
                        sx={{ 
                          minWidth: 48,
                          color: 'text.secondary',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 500,
                              color: 'text.primary'
                            }}
                          >
                            {item.label}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {item.description}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < reportItems.length - 1 && (
                    <Box 
                      sx={{ 
                        height: 1, 
                        backgroundColor: 'divider',
                        mx: 3 
                      }} 
                    />
                  )}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Paper 
          sx={{ 
            mt: 3, 
            p: 3, 
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ textAlign: 'center' }}
          >
            Need help with reports? Each report includes filters and export options to customize your data view.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
