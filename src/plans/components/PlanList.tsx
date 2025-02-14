import React, { useEffect } from "react";
import { Grid, Icon, IconButton, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import { ApiHelper, ArrayHelper, DateHelper, DisplayBox, GroupInterface, Locale, SmallButton } from "@churchapps/apphelper";
import { PlanEdit } from "./PlanEdit";
import { MinistryList } from "./MinistryList";

interface Props { ministry: GroupInterface }

export interface PlanInterface { id?: string, churchId?: string, name?: string, ministryId?: string, serviceDate?: Date, notes?: string, serviceOrder?: boolean }

export const PlanList = (props: Props) => {
  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [plans, setPlans] = React.useState<PlanInterface[]>([]);

  const addPlan = () => {
    const date = DateHelper.getLastSunday();
    date.setDate(date.getDate() + 7);
    const name = DateHelper.prettyDate(date);
    setPlan({ ministryId: props.ministry.id, serviceDate: date, name, notes: "", serviceOrder: true });
  }

  const getAddPlanLink = () => (
    <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button" onClick={addPlan}>
      <Icon color="primary">add</Icon>
    </IconButton>
  );

  const loadData = () => {
    setPlan(null);
    ApiHelper.get("/plans", "DoingApi").then((data: any[]) => { setPlans(ArrayHelper.getAll(data, "ministryId", props.ministry.id)); });
  }

  const getPlans = () => {
    if (plans.length === 0) return <TableRow><TableCell>{Locale.label("plans.planList.noPlan")}</TableCell></TableRow>;
    return plans.map((p, i) => (<TableRow key={i}>
      <TableCell><Link to={"/plans/" + p.id}>{p.name}</Link></TableCell>
      <TableCell style={{ textAlign: "right" }}><SmallButton icon="edit" onClick={(e) => { setPlan(p); }} /></TableCell>
    </TableRow>));
  }

  useEffect(() => { loadData(); }, [props.ministry]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (<>
    {plan && (<PlanEdit plan={plan} plans={plans} updatedFunction={loadData} />)}
    <DisplayBox headerText={Locale.label("plans.planList.plans")} headerIcon="assignment" editContent={getAddPlanLink()}>
      <Table size="small">
        <TableBody>
          {getPlans()}
        </TableBody>
      </Table>
    </DisplayBox>
    <MinistryList />
  </>);
}

