import React, { useEffect } from "react";
import { Grid, Icon, IconButton, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import { ApiHelper, DateHelper, DisplayBox, SmallButton } from "@churchapps/apphelper";
import { PlanInterface } from "../../helpers";
import { PlanEdit } from "./PlanEdit";

export const PlanList = () => {

  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [plans, setPlans] = React.useState<PlanInterface[]>([]);

  const addPlan = () => {
    const date = DateHelper.getLastSunday();
    date.setDate(date.getDate() + 7);
    const name = (date.getMonth()+1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear().toString() + " Plan";
    setPlan({serviceDate:date, name, notes:""});
  }

  const getAddPlanLink = () => (
    <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button" onClick={addPlan}>
      <Icon color="primary">add</Icon>
    </IconButton>
  );

  const loadData = () => {
    setPlan(null);
    ApiHelper.get("/plans", "DoingApi").then(data => { setPlans(data); });
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
    <h1><Icon>assignment</Icon> Service Plans</h1>
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

      </Grid>
    </Grid>
  </>);
}

