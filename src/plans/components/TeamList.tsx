import React, { useState, useCallback, memo } from "react";
import { ApiHelper, UserHelper, Loading, ArrayHelper, Locale } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import {
  Box, Card, CardContent, Typography, Stack, Button, Paper, Chip, Avatar 
} from "@mui/material";
import { Add as AddIcon, Group as GroupIcon, People as PeopleIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { type GroupInterface } from "@churchapps/helpers";
import { useMountedState, Permissions } from "@churchapps/apphelper";
import { GroupAdd } from "../../groups/components";

interface Props {
  ministry: GroupInterface;
}

export const TeamList = memo((props: Props) => {
  const [groups, setGroups] = useState<GroupInterface[]>(null);
  const [showAdd, setShowAdd] = useState(false);
  const isMounted = useMountedState();

  const handleAddClick = useCallback(() => {
    setShowAdd(true);
  }, []);

  const loadData = useCallback(() => {
    ApiHelper.get("/groups/tag/team", "MembershipApi").then((data) => {
      if (isMounted()) setGroups(ArrayHelper.getAll(data, "categoryName", props.ministry.id));
    });
  }, [props.ministry.id, isMounted]);

  const handleAddUpdated = useCallback(() => {
    setShowAdd(false);
    loadData();
  }, [loadData]);

  React.useEffect(loadData, [loadData]);

  if (showAdd) {
    return <GroupAdd updatedFunction={handleAddUpdated} tags="team" categoryName={props.ministry.id} />;
  }

  if (!groups) {
    return <Loading />;
  }

  if (groups.length === 0) {
    return (
      <Box>
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "grey.50",
            border: "1px dashed",
            borderColor: "grey.300",
            borderRadius: 2,
          }}>
          <PeopleIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {Locale.label("plans.teamList.noTeam")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {Locale.label("plans.teamList.createTeams")}
          </Typography>
          {UserHelper.checkAccess(Permissions.membershipApi.groups.edit) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              data-testid="add-team-button"
              sx={{
                fontSize: "1rem",
                py: 1.5,
                px: 3,
              }}>
              {Locale.label("plans.teamList.createTeam")}
            </Button>
          )}
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <PeopleIcon sx={{ color: "primary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
              {Locale.label("plans.teamList.teams")}
            </Typography>
          </Stack>
          {UserHelper.checkAccess(Permissions.membershipApi.groups.edit) && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              data-testid="add-team-button"
              sx={{
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 2,
                },
              }}>
              {Locale.label("plans.teamList.newTeam")}
            </Button>
          )}
        </Stack>
      </Box>

      <Stack spacing={2}>
        {groups.map((g) => {
          const memberCount = g.memberCount || 0;
          const memberLabel = memberCount === 1 ? `1 ${Locale.label("plans.teamList.member")}` : `${memberCount} ${Locale.label("plans.teamList.members")}`;

          return (
            <Card
              key={g.id}
              sx={{
                transition: "all 0.2s ease-in-out",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 2,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                  borderColor: "primary.main",
                },
              }}>
              <CardContent sx={{ pb: "16px !important" }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                    <Avatar
                      sx={{
                        bgcolor: "secondary.main",
                        width: 48,
                        height: 48,
                      }}>
                      <GroupIcon />
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        component={Link}
                        to={`/groups/${g.id}?tag=team`}
                        sx={{
                          fontWeight: 600,
                          color: "primary.main",
                          textDecoration: "none",
                          fontSize: "1.1rem",
                          "&:hover": { textDecoration: "underline" },
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                        {g.name}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        <Chip
                          icon={<PersonAddIcon />}
                          label={memberLabel}
                          variant="outlined"
                          size="small"
                          sx={{
                            color: "text.secondary",
                            borderColor: "grey.400",
                            fontSize: "0.75rem",
                          }}
                        />
                        <Chip
                          label={Locale.label("plans.teamList.team")}
                          variant="outlined"
                          size="small"
                          sx={{
                            color: "info.main",
                            borderColor: "info.main",
                            fontSize: "0.75rem",
                          }}
                        />
                      </Stack>
                    </Box>
                  </Stack>

                  <Box sx={{ ml: 2 }}>
                    <Button
                      size="small"
                      component={Link}
                      to={`/groups/${g.id}?tag=team`}
                      variant="outlined"
                      sx={{
                        color: "primary.main",
                        borderColor: "primary.main",
                        "&:hover": {
                          backgroundColor: "primary.light",
                          borderColor: "primary.dark",
                        },
                      }}>
                      {Locale.label("plans.teamList.manage")}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
});
