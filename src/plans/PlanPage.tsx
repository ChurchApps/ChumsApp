import React from "react";
import { Grid, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { ApiHelper, ArrayHelper, DisplayBox, PersonAdd, PersonHelper, PersonInterface, SmallButton } from "@churchapps/apphelper";
import { PositionEdit } from "./components/PositionEdit";
import { AssignmentInterface, PlanInterface, PositionInterface, TimeInterface } from "../helpers";
import { PositionList } from "./components/PositionList";
import { AssignmentEdit } from "./components/AssignmentEdit";
import { TimeList } from "./components/TimeList";

export const PlanPage = () => {
  const params = useParams();
  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [positions, setPositions] = React.useState<PositionInterface[]>([]);
  const [assignments, setAssignments] = React.useState<AssignmentInterface[]>([]);
  const [people, setPeople] = React.useState<PersonInterface[]>([]);
  const [position, setPosition] = React.useState<PositionInterface>(null);
  const [assignment, setAssignment] = React.useState<AssignmentInterface>(null);
  const [times, setTimes] = React.useState<TimeInterface[]>([]);


  const getAddPositionLink = () => (
    <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button" onClick={() => { setPosition({categoryName:(positions?.length>0) ? positions[0].categoryName : "Band", name:"", planId:params.id, count:1}) }}>
      <Icon color="primary">add</Icon>
    </IconButton>
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

  const loadData = async () => {
    ApiHelper.get("/plans/" + params.id, "DoingApi").then(data => { setPlan(data); });
    ApiHelper.get("/positions/plan/" + params.id, "DoingApi").then(data => { setPositions(data); });
    ApiHelper.get("/times/plan/" + params.id, "DoingApi").then(data => { setTimes(data); });
    const d = await ApiHelper.get("/assignments/plan/" + params.id, "DoingApi");
    setAssignments(d);
    const peopleIds = ArrayHelper.getUniqueValues(d, "personId");
    if (peopleIds.length > 0) ApiHelper.get("/people/ids?ids=" + peopleIds.join(","), "MembershipApi").then((data: PersonInterface[]) => { setPeople(data); });
  }

  React.useEffect(() => { loadData(); }, []);
  console.log("Position", position, "Assignment", assignment)

  return (<>
    <h1><Icon>assignment</Icon> Service Plan for 4/27/2024</h1>
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Assignments" headerIcon="assignment" editContent={getAddPositionLink()}>
          <PositionList positions={positions} assignments={assignments} people={people} onSelect={p => setPosition(p)} onAssignmentSelect={handleAssignmentSelect} />
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        {position && !assignment && <PositionEdit position={position} categoryNames={(positions?.length>0) ? ArrayHelper.getUniqueValues(positions, "categoryName") : ["Band"] } updatedFunction={() => {setPosition(null); loadData() }} /> }
        {assignment && position && <AssignmentEdit position={position} assignment={assignment} peopleNeeded={position.count - ArrayHelper.getAll(assignments, "positionId", position.id).length } updatedFunction={ handleAssignmentUpdate } />}
        <TimeList times={times} positions={positions} plan={plan} onUpdate={loadData} />
      </Grid>
    </Grid>
  </>)
};

