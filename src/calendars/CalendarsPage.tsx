import React, { useState, useEffect } from "react";
import { ApiHelper, UserHelper, Loading, PageHeader } from "@churchapps/apphelper";
import { Permissions, type CuratedCalendarInterface } from "@churchapps/helpers";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TableContainer,
  Paper,
  Tooltip
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Event as EventIcon,
  Description as DescriptionIcon
} from "@mui/icons-material";
import { CalendarEdit } from "./components";

export const CalendarsPage = () => {
  const [calendars, setCalendars] = useState<CuratedCalendarInterface[]>([]);
  const [currentCalendar, setCurrentCalendar] = useState<CuratedCalendarInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    ApiHelper.get("/curatedCalendars", "ContentApi").then((data: any) => {
      setCalendars(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  const getRows = () => calendars.map((calendar) => (
      <TableRow
        key={calendar.id}
        sx={{
          '&:hover': {
            backgroundColor: 'action.hover',
            cursor: 'pointer'
          },
          transition: 'background-color 0.2s ease'
        }}
        onClick={() => navigate("/calendars/" + calendar.id)}
      >
        <TableCell>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: 1,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 40,
                height: 40
              }}
            >
              <CalendarIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {calendar.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Curated Calendar
              </Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Chip
            icon={<EventIcon />}
            label="Active"
            size="small"
            sx={{
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              fontWeight: 600
            }}
          />
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip title="Manage Events" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/calendars/" + calendar.id);
                }}
                sx={{
                  color: 'primary.main',
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
                data-testid={`manage-calendar-${calendar.id}`}
              >
                <EventIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            {UserHelper.checkAccess(Permissions.contentApi.content.edit) && (
              <Tooltip title="Edit" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCalendar(calendar);
                  }}
                  sx={{
                    color: 'primary.main',
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                  data-testid={`edit-calendar-${calendar.id}`}
                >
                  <EditIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </TableCell>
      </TableRow>
    ));

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <PageHeader
        icon={<CalendarIcon />}
        title="Event Calendars"
        subtitle={
          calendars.length > 0
            ? `Manage ${calendars.length} curated ${calendars.length === 1 ? 'calendar' : 'calendars'} for your church`
            : "Create curated calendars to organize and share events across your church"
        }
      >
        {UserHelper.checkAccess(Permissions.contentApi.content.edit) && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCurrentCalendar({} as CuratedCalendarInterface)}
            sx={{
              color: "#FFF",
              borderColor: "rgba(255,255,255,0.5)",
              "&:hover": {
                borderColor: "#FFF",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            data-testid="add-calendar"
          >
            Add Calendar
          </Button>
        )}
      </PageHeader>

      <Box sx={{ p: 3 }}>
        {!currentCalendar ? (
          <>
            {loading ? (
              <Loading data-testid="calendars-loading" />
            ) : calendars.length === 0 ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  backgroundColor: "grey.50",
                  border: "1px dashed",
                  borderColor: "grey.300",
                  borderRadius: 2,
                }}
              >
                <CalendarIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Calendars Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create your first curated calendar to organize and share events
                </Typography>
                {UserHelper.checkAccess(Permissions.contentApi.content.edit) && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCurrentCalendar({} as CuratedCalendarInterface)}
                    data-testid="empty-state-add-calendar"
                  >
                    Create Calendar
                  </Button>
                )}
              </Paper>
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                        Calendar
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                        Status
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{getRows()}</TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        ) : (
          <Grid container spacing={3} sx={{ width: "100%" }}>
            <Grid size={{ xs: 12, md: 8 }}>
              {loading ? (
                <Loading data-testid="calendars-loading" />
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                          Calendar
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                          Status
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{getRows()}</TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CalendarEdit
                calendar={currentCalendar}
                updatedCallback={() => {
                  setCurrentCalendar(null);
                  loadData();
                }}
              />
            </Grid>
          </Grid>
        )}

        {calendars.length > 0 && !currentCalendar && (
          <Card sx={{ mt: 3, borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <DescriptionIcon sx={{ color: "primary.main", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    About Curated Calendars
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Each group has its own calendar which can be managed by group leaders. You can also create curated calendars to share with the entire church.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    For example, create a calendar for all small groups, youth events, or a whole church events calendar highlighting major events.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You can create as many curated calendars as you like and add events from any group to any calendar.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default CalendarsPage;
