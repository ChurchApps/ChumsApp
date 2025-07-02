import React, { useEffect, useCallback, memo, useMemo } from "react";
import { 
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Fab,
  Paper,
  Chip,
  Avatar,
  Button
} from "@mui/material";
import { 
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarIcon,
  Edit as EditIcon,
  EventNote as EventNoteIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ApiHelper, ArrayHelper, DateHelper, type GroupInterface, Locale, Loading } from "@churchapps/apphelper";
import { PlanEdit } from "./PlanEdit";
import { MinistryList } from "./MinistryList";

interface Props { ministry: GroupInterface }

export interface PlanInterface { id?: string, churchId?: string, name?: string, ministryId?: string, serviceDate?: Date, notes?: string, serviceOrder?: boolean }

export const PlanList = memo((props: Props) => {
  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [plans, setPlans] = React.useState<PlanInterface[]>(null);

  const addPlan = useCallback(() => {
    const date = DateHelper.getLastSunday();
    date.setDate(date.getDate() + 7);
    const name = DateHelper.prettyDate(date);
    setPlan({ ministryId: props.ministry.id, serviceDate: date, name, notes: "", serviceOrder: true });
  }, [props.ministry.id]);

  const loadData = useCallback(() => {
    setPlan(null);
    ApiHelper.get("/plans", "DoingApi").then((data: any[]) => { 
      setPlans(ArrayHelper.getAll(data, "ministryId", props.ministry.id)); 
    });
  }, [props.ministry.id]);

  useEffect(() => { loadData(); }, [loadData]);

  if (plan) {
    return <PlanEdit plan={plan} plans={plans || []} updatedFunction={loadData} />;
  }

  if (!plans) {
    return <Loading />;
  }

  if (plans.length === 0) {
    return (
      <Box>
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            backgroundColor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            mb: 3
          }}
        >
          <EventNoteIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No service plans yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first service plan to get started with planning
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addPlan}
            data-testid="add-plan-button"
            sx={{ 
              fontSize: '1rem',
              py: 1.5,
              px: 3
            }}
          >
            Create Service Plan
          </Button>
        </Paper>
        <MinistryList />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AssignmentIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {Locale.label("plans.planList.plans")}
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addPlan}
            data-testid="add-plan-button"
            sx={{ 
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: 2
              }
            }}
          >
            New Plan
          </Button>
        </Stack>
      </Box>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {plans.map((p) => (
          <Card 
            key={p.id} 
            sx={{ 
              transition: 'all 0.2s ease-in-out',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
                borderColor: 'primary.main'
              }
            }}
          >
            <CardContent sx={{ pb: '16px !important' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48
                    }}
                  >
                    <CalendarIcon />
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="h6" 
                      component={Link}
                      to={`/plans/${p.id}`}
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontSize: '1.1rem',
                        '&:hover': {
                          textDecoration: 'underline'
                        },
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {p.name}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                      {p.serviceDate && (
                        <Chip
                          icon={<CalendarIcon />}
                          label={DateHelper.formatHtml5Date(p.serviceDate)}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            color: 'text.secondary',
                            borderColor: 'grey.400',
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                      {p.serviceOrder && (
                        <Chip
                          label="Service Order"
                          variant="outlined"
                          size="small"
                          sx={{ 
                            color: 'success.main',
                            borderColor: 'success.main',
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>
                
                <Box sx={{ ml: 2 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setPlan(p)}
                    variant="outlined"
                    sx={{ 
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        borderColor: 'primary.dark'
                      }
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <MinistryList />
    </Box>
  );
});

