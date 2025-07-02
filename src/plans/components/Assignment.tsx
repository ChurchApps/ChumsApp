import React, { useCallback } from "react";
import {
 Grid, TextField, Card, CardContent, Box, Typography, Stack, Button, Alert 
} from "@mui/material";
import { PublishedWithChanges as AutoAssignIcon, Add as AddIcon, StickyNote2 as NotesIcon, Save as SaveIcon } from "@mui/icons-material";
import {
  ApiHelper,
  ArrayHelper,
  type AssignmentInterface,
  type BlockoutDateInterface,
  Locale,
  type PersonInterface,
  type PlanInterface,
  type PositionInterface,
  type TimeInterface,
} from "@churchapps/apphelper";
import { PositionEdit } from "./PositionEdit";
import { PositionList } from "./PositionList";
import { AssignmentEdit } from "./AssignmentEdit";
import { TimeList } from "./TimeList";
import { PlanValidation } from "./PlanValidation";

interface Props {
  plan: PlanInterface;
}

export const Assignment = (props: Props) => {
  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [positions, setPositions] = React.useState<PositionInterface[]>([]);
  const [assignments, setAssignments] = React.useState<AssignmentInterface[]>([]);
  const [people, setPeople] = React.useState<PersonInterface[]>([]);
  const [position, setPosition] = React.useState<PositionInterface>(null);
  const [assignment, setAssignment] = React.useState<AssignmentInterface>(null);
  const [times, setTimes] = React.useState<TimeInterface[]>([]);
  const [blockoutDates, setBlockoutDates] = React.useState<BlockoutDateInterface[]>([]);

  const getAddPositionActions = () => (
    <Stack direction="row" spacing={1}>
      <Button
        variant="outlined"
        startIcon={<AutoAssignIcon />}
        onClick={handleAutoAssign}
        data-testid="auto-assign-button"
        size="small"
        sx={{
          textTransform: "none",
          borderRadius: 2,
          fontWeight: 600,
        }}
      >
        Auto Assign
      </Button>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => {
          setPosition({
            categoryName: positions?.length > 0 ? positions[0].categoryName : "Band",
            name: "",
            planId: props.plan?.id,
            count: 1,
          });
        }}
        data-testid="add-position-button"
        size="small"
        sx={{
          textTransform: "none",
          borderRadius: 2,
          fontWeight: 600,
        }}
      >
        Add Position
      </Button>
    </Stack>
  );

  const handleAssignmentSelect = (p: PositionInterface, a: AssignmentInterface) => {
    setAssignment(a);
    setPosition(p);
  };

  const handleAssignmentUpdate = (done: boolean) => {
    if (done) {
      setAssignment(null);
      setPosition(null);
    }
    loadData();
  };

  const loadData = useCallback(async () => {
    setPlan(props.plan);
    ApiHelper.get("/positions/plan/" + props.plan?.id, "DoingApi").then((data) => {
      setPositions(data);
    });
    ApiHelper.get("/times/plan/" + props.plan?.id, "DoingApi").then((data) => {
      setTimes(data);
    });
    ApiHelper.get("/blockoutDates/upcoming", "DoingApi").then((data) => {
      setBlockoutDates(data);
    });
    const d = await ApiHelper.get("/assignments/plan/" + props.plan?.id, "DoingApi");
    setAssignments(d);
    const peopleIds = ArrayHelper.getUniqueValues(d, "personId");
    if (peopleIds.length > 0) {
      ApiHelper.get("/people/ids?ids=" + peopleIds.join(","), "MembershipApi").then((data: PersonInterface[]) => {
        setPeople(data);
      });
    }
  }, [props.plan]);

  const handleSave = () => {
    ApiHelper.post("/plans", [plan], "DoingApi");
    // Show success message - you could replace alert with a snackbar/toast
    alert(Locale.label("plans.planPage.noteSave"));
  };

  const handleAutoAssign = async () => {
    const groupIds = ArrayHelper.getUniqueValues(positions, "groupId");
    const groupMembers = await ApiHelper.get("/groupMembers/?groupIds=" + groupIds.join(","), "MembershipApi");
    const teams: { positionId: string; personIds: string[] }[] = [];
    positions.forEach((p) => {
      const filteredMembers = ArrayHelper.getAll(groupMembers, "groupId", p.groupId);
      teams.push({ positionId: p.id, personIds: filteredMembers.map((m) => m.personId) || [] });
    });
    ApiHelper.post("/plans/autofill/" + props.plan.id, { teams }, "DoingApi").then(() => {
      loadData();
    });
  };

  React.useEffect(() => {
    loadData();
  }, [props.plan?.id, loadData]);
  console.log("Position", position, "Assignment", assignment);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        {/* Assignments Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
            transition: "all 0.2s ease-in-out",
            "&:hover": { boxShadow: 2 },
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AutoAssignIcon sx={{ color: "primary.main", fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                  {Locale.label("plans.planPage.assign") || "Team Assignments"}
                </Typography>
              </Stack>
              {getAddPositionActions()}
            </Stack>
            <PositionList positions={positions} assignments={assignments} people={people} onSelect={(p) => setPosition(p)} onAssignmentSelect={handleAssignmentSelect} />
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
            transition: "all 0.2s ease-in-out",
            "&:hover": { boxShadow: 2 },
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <NotesIcon sx={{ color: "primary.main", fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                  {Locale.label("common.notes") || "Plan Notes"}
                </Typography>
              </Stack>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Save Notes
              </Button>
            </Stack>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={plan?.notes || ""}
              onChange={(e) => {
                setPlan({ ...plan, notes: e.target.value });
              }}
              data-testid="plan-notes-input"
              aria-label="Plan notes"
              placeholder="Add notes for this service plan..."
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "grey.50",
                  "&:hover": { backgroundColor: "#FFF" },
                  "&.Mui-focused": { backgroundColor: "#FFF" },
                },
              }}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          {/* Position/Assignment Edit */}
          {position && !assignment && (
            <PositionEdit
              position={position}
              categoryNames={positions?.length > 0 ? ArrayHelper.getUniqueValues(positions, "categoryName") : [Locale.label("plans.planPage.band")]}
              updatedFunction={() => {
                setPosition(null);
                loadData();
              }}
            />
          )}
          {assignment && position && (
            <AssignmentEdit
              position={position}
              assignment={assignment}
              peopleNeeded={position.count - ArrayHelper.getAll(assignments, "positionId", position.id).length}
              updatedFunction={handleAssignmentUpdate}
            />
          )}

          {/* Time List */}
          <TimeList times={times} positions={positions} plan={plan} onUpdate={loadData} />

          {/* Plan Validation */}
          <PlanValidation plan={plan} positions={positions} assignments={assignments} people={people} times={times} blockoutDates={blockoutDates} onUpdate={loadData} />
        </Stack>
      </Grid>
    </Grid>
  );
};
