import React from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Fab, 
  Paper,
  Chip,
  Avatar
} from "@mui/material";
import { 
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  People as PeopleIcon
} from "@mui/icons-material";
import { ApiHelper, ArrayHelper, type GroupInterface, type GroupMemberInterface, Locale, UserHelper, Permissions, Loading } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { GroupAdd } from "../../groups/components";
import UserContext from "../../UserContext";

export const MinistryList = () => {
  const [groups, setGroups] = React.useState<GroupInterface[]>(null);
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const [groupMembers, setGroupMembers] = React.useState<GroupMemberInterface[]>([]);
  const context = React.useContext(UserContext);

  const handleAdd = () => { setShowAdd(true); }
  const handleAddUpdated = () => { setShowAdd(false); loadData(); };

  const loadData = async () => {
    const groups: GroupInterface[] = await ApiHelper.get("/groups/tag/ministry", "MembershipApi");
    setGroups(groups)
    if (groups.length > 0) ApiHelper.get("/groupMembers?groupIds=" + ArrayHelper.getIds(groups, "id"), "MembershipApi").then((data) => { setGroupMembers(data); })
  };

  React.useEffect(() => { loadData() }, []);

  if (showAdd) return (<GroupAdd updatedFunction={handleAddUpdated} tags="ministry" categoryName="Ministry" />);

  if (!groups) {
    return <Loading />;
  }

  if (groups.length === 0) {
    return (
      <Box sx={{ position: 'relative' }}>
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            backgroundColor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300',
            borderRadius: 2
          }}
        >
          <AssignmentIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {Locale.label("plans.ministryList.noMinMsg")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Get started by creating your first ministry
          </Typography>
        </Paper>
        
        {UserHelper.checkAccess(Permissions.membershipApi.groups.edit) && (
          <Fab
            color="primary"
            aria-label="Add ministry"
            onClick={handleAdd}
            data-testid="add-ministry-button"
            sx={{ 
              position: 'absolute', 
              bottom: -28, 
              right: 16,
              boxShadow: 3,
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 4
              }
            }}
          >
            <AddIcon />
          </Fab>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <AssignmentIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {Locale.label("plans.ministryList.mins")}
          </Typography>
        </Stack>
      </Box>

      <Stack spacing={2}>
        {groups.map((g) => {
          const members = ArrayHelper.getAll(groupMembers, "groupId", g.id);
          const hasAccess = members.length === 0 || ArrayHelper.getOne(members, "personId", context.person?.id) !== null || UserHelper.checkAccess(Permissions.membershipApi.roles.edit);
          const memberCount = members.length;

          return (
            <Card 
              key={g.id} 
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
                      <GroupIcon />
                    </Avatar>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        component={hasAccess ? Link : 'div'}
                        to={hasAccess ? `/plans/ministries/${g.id}` : undefined}
                        sx={{ 
                          fontWeight: 600,
                          color: hasAccess ? 'primary.main' : 'text.primary',
                          textDecoration: 'none',
                          fontSize: '1.1rem',
                          '&:hover': hasAccess ? {
                            textDecoration: 'underline'
                          } : {},
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {g.name}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        {memberCount > 0 && (
                          <Chip
                            icon={<PeopleIcon />}
                            label={`${memberCount} ${memberCount === 1 ? 'member' : 'members'}`}
                            variant="outlined"
                            size="small"
                            sx={{ 
                              color: 'text.secondary',
                              borderColor: 'grey.400',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                  
                  {hasAccess && (
                    <Box sx={{ ml: 2 }}>
                      <Chip
                        icon={<EditIcon />}
                        label="Manage"
                        component={Link}
                        to={`/groups/${g.id}?tag=ministry`}
                        clickable
                        variant="outlined"
                        size="small"
                        sx={{ 
                          color: 'primary.main',
                          borderColor: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            borderColor: 'primary.dark'
                          }
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {UserHelper.checkAccess(Permissions.membershipApi.groups.edit) && (
        <Fab
          color="primary"
          aria-label="Add ministry"
          onClick={handleAdd}
          data-testid="add-ministry-button"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            boxShadow: 3,
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 4
            },
            zIndex: 1000
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

