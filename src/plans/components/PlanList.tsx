import React, { useEffect, useCallback, memo, useMemo } from "react";
import { Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import { ApiHelper, ArrayHelper, DateHelper, DisplayBox, type GroupInterface, Locale, SmallButton } from "@churchapps/apphelper";
import { PlanEdit } from "./PlanEdit";
import { MinistryList } from "./MinistryList";

interface Props { ministry: GroupInterface }

export interface PlanInterface { id?: string, churchId?: string, name?: string, ministryId?: string, serviceDate?: Date, notes?: string, serviceOrder?: boolean }

export const PlanList = memo((props: Props) => {
  const [plan, setPlan] = React.useState<PlanInterface>(null);
  const [plans, setPlans] = React.useState<PlanInterface[]>([]);

  const addPlan = useCallback(() => {
    const date = DateHelper.getLastSunday();
    date.setDate(date.getDate() + 7);
    const name = DateHelper.prettyDate(date);
    setPlan({ ministryId: props.ministry.id, serviceDate: date, name, notes: "", serviceOrder: true });
  }, [props.ministry.id]);

  const addPlanLink = useMemo(() => (
    <IconButton aria-label="Add plan" id="addBtnGroup" data-cy="add-button" onClick={addPlan} data-testid="add-plan-button">
      <Icon color="primary">add</Icon>
    </IconButton>
  ), [addPlan]);

  const loadData = useCallback(() => {
    setPlan(null);
    ApiHelper.get("/plans", "DoingApi").then((data: any[]) => { setPlans(ArrayHelper.getAll(data, "ministryId", props.ministry.id)); });
  }, [props.ministry.id]);

  const tableRows = useMemo(() => plans.map((p) => (
    <TableRow key={p.id}>
      <TableCell><Link to={"/plans/" + p.id}>{p.name}</Link></TableCell>
      <TableCell style={{ textAlign: "right" }}>
        <SmallButton icon="edit" onClick={() => { setPlan(p); }} />
      </TableCell>
    </TableRow>
  )), [plans]);

  useEffect(() => { loadData(); }, [loadData]);

  return (<>
    {plan && (<PlanEdit plan={plan} plans={plans} updatedFunction={loadData} />)}
    <DisplayBox headerText={Locale.label("plans.planList.plans")} headerIcon="assignment" editContent={addPlanLink}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell key="name">{Locale.label("common.name")}</TableCell>
            <TableCell key="actions" style={{ textAlign: "right" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows}
        </TableBody>
      </Table>
    </DisplayBox>
    <MinistryList />
  </>);
});

