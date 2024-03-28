import React, { useEffect } from "react";
import { Grid, Icon, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { ApiHelper, DateHelper, DisplayBox } from "@churchapps/apphelper";
import { PlanInterface } from "../helpers";
import { PlanAdd } from "./components/PlanAdd";

export const PlansPage = () => {

  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [plans, setPlans] = React.useState<PlanInterface[]>([]);

  const addPlan = () => {
    const date = DateHelper.getLastSunday();
    const name = date.getMonth().toString() + "/" + date.getDate().toString() + "/" + date.getFullYear().toString() + " Plan";
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
    if (plans.length === 0) return <p>No plans have been added yet.</p>;
    return plans.map((p, i) => (<li key={i}><Link to={"/plans/" + p.id}>{p.name}</Link></li>));
  }

  useEffect(() => { loadData(); }, []);

  return (<>
    <h1><Icon>assignment</Icon> Service Plans</h1>
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Plans" headerIcon="assignment" editContent={getAddPlanLink()}>
          <ul>
            {getPlans()}
          </ul>
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        {plan && (<PlanAdd plan={plan} updatedFunction={loadData} />)}

      </Grid>
    </Grid>
  </>);
}

