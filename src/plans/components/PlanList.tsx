import React, { useEffect } from "react";
import { Grid, Icon, IconButton, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import { ApiHelper, ArrayHelper, DateHelper, DisplayBox, GroupInterface, PlanInterface, SmallButton } from "@churchapps/apphelper";
import { PlanEdit } from "./PlanEdit";
import { MinistryList } from "./MinistryList";

interface Props { ministry: GroupInterface }

export const PlanList = (props:Props) => {
  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [plans, setPlans] = React.useState<PlanInterface[]>([]);

  const addPlan = () => {
    const date = DateHelper.getLastSunday();
    date.setDate(date.getDate() + 7);
    const name = DateHelper.prettyDate(date);
    setPlan({ ministryId:props.ministry.id, serviceDate:date, name, notes:""});
  }

  const getAddPlanLink = () => (
    <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button" onClick={addPlan}>
      <Icon color="primary">add</Icon>
    </IconButton>
  );

  const loadData = () => {
    setPlan(null);
    ApiHelper.get("/plans", "DoingApi").then((data:any[]) => { setPlans(ArrayHelper.getAll(data, "ministryId", props.ministry.id)); });
  }

  const getPlans = () => {
    if (plans.length === 0) return <TableRow><TableCell>No plans have been added yet.</TableCell></TableRow>;
    return plans.map((p, i) => (<TableRow key={i}>
      <TableCell><Link to={"/plans/" + p.id}>{p.name}</Link></TableCell>
      <TableCell style={{textAlign:"right"}}><SmallButton icon="edit" onClick={(e) => {setPlan(p); }} /></TableCell>
    </TableRow>));
  }

  useEffect(() => { loadData(); }, []);

  return (<>
    <h1><Icon>assignment</Icon> {props.ministry.name} Plans</h1>
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Plans" headerIcon="assignment" editContent={getAddPlanLink()}>
          <Table size="small">
            <TableBody>
              {getPlans()}
            </TableBody>
          </Table>
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        {plan && (<PlanEdit plan={plan} plans={plans} updatedFunction={loadData} />)}

        <MinistryList />

      </Grid>
    </Grid>
  </>);
}

