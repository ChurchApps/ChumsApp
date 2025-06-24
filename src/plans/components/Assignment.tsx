import React, { useCallback } from "react";
import { Grid, Icon, IconButton, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { ApiHelper, ArrayHelper, AssignmentInterface, BlockoutDateInterface, DisplayBox, InputBox, Locale, Notes, PersonInterface, PlanInterface, PositionInterface, TimeInterface } from "@churchapps/apphelper";
import { PositionEdit } from "./PositionEdit";
import { PositionList } from "./PositionList";
import { AssignmentEdit } from "./AssignmentEdit";
import { TimeList } from "./TimeList";
import { PlanValidation } from "./PlanValidation";
import { Banner } from "@churchapps/apphelper";

interface Props {
  plan: PlanInterface
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


  const getAddPositionLink = () => (
    <>
      <IconButton aria-label="Auto Assign" id="aautoBtnGroup" onClick={handleAutoAssign} data-testid="auto-assign-button">
        <Icon color="primary">published_with_changes</Icon>
      </IconButton>
      <IconButton aria-label="Add position" id="addBtnGroup" data-cy="add-button" onClick={() => { setPosition({categoryName:(positions?.length>0) ? positions[0].categoryName : "Band", name:"", planId:props.plan?.id, count:1}) }} data-testid="add-position-button">
        <Icon color="primary">add</Icon>
      </IconButton>
    </>
  );

  const handleAssignmentSelect = (p: PositionInterface, a: AssignmentInterface) => {
    setAssignment(a);
    setPosition(p);
  }

  const handleAssignmentUpdate = (done:boolean) => {
    if (done) {
      setAssignment(null);
      setPosition(null);
    }
    loadData();
  }

  const loadData = useCallback(async () => {
    setPlan(props.plan);
    ApiHelper.get("/positions/plan/" + props.plan?.id, "DoingApi").then(data => { setPositions(data); });
    ApiHelper.get("/times/plan/" + props.plan?.id, "DoingApi").then(data => { setTimes(data); });
    ApiHelper.get("/blockoutDates/upcoming", "DoingApi").then(data => { setBlockoutDates(data); });
    const d = await ApiHelper.get("/assignments/plan/" + props.plan?.id, "DoingApi");
    setAssignments(d);
    const peopleIds = ArrayHelper.getUniqueValues(d, "personId");
    if (peopleIds.length > 0) ApiHelper.get("/people/ids?ids=" + peopleIds.join(","), "MembershipApi").then((data: PersonInterface[]) => { setPeople(data); });
  }, [props.plan]);

  const handleSave = () => {
    ApiHelper.post("/plans", [plan], "DoingApi");
    alert(Locale.label("plans.planPage.noteSave"));
  }

  const handleAutoAssign = async () => {
    const groupIds = ArrayHelper.getUniqueValues(positions, "groupId");
    const groupMembers = await ApiHelper.get("/groupMembers/?groupIds=" + groupIds.join(","), "MembershipApi");
    const teams:{positionId:string, personIds:string[]}[] = [];
    positions.forEach(p => {
      const filteredMembers = ArrayHelper.getAll(groupMembers, "groupId", p.groupId);
      teams.push({positionId:p.id, personIds:filteredMembers.map(m => m.personId) || []});
    });
    ApiHelper.post("/plans/autofill/" + props.plan.id, { teams }, "DoingApi").then(() => { loadData(); });
  }

  React.useEffect(() => { loadData(); }, [props.plan?.id, loadData]);
  console.log("Position", position, "Assignment", assignment)

  return (<>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <DisplayBox headerText={Locale.label("plans.planPage.assign")} headerIcon="assignment" editContent={getAddPositionLink()}>
          <PositionList positions={positions} assignments={assignments} people={people} onSelect={p => setPosition(p)} onAssignmentSelect={handleAssignmentSelect} />
        </DisplayBox>
        <InputBox headerIcon="sticky_note_2" headerText={Locale.label("common.notes")} saveFunction={handleSave}>
          <TextField fullWidth multiline rows={4} value={plan?.notes} onChange={(e) => { setPlan({ ...plan, notes: e.target.value }) }} data-testid="plan-notes-input" aria-label="Plan notes" />
        </InputBox>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        {position && !assignment && <PositionEdit position={position} categoryNames={(positions?.length>0) ? ArrayHelper.getUniqueValues(positions, "categoryName") : [Locale.label("plans.planPage.band")] } updatedFunction={() => {setPosition(null); loadData() }} /> }
        {assignment && position && <AssignmentEdit position={position} assignment={assignment} peopleNeeded={position.count - ArrayHelper.getAll(assignments, "positionId", position.id).length } updatedFunction={ handleAssignmentUpdate } />}
        <TimeList times={times} positions={positions} plan={plan} onUpdate={loadData} />
        <PlanValidation plan={plan} positions={positions} assignments={assignments} people={people} times={times} blockoutDates={blockoutDates} onUpdate={loadData} />
      </Grid>
    </Grid>

  </>)
};

