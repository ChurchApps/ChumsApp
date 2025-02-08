import React from "react";
import { Grid, Icon, IconButton, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { ApiHelper, ArrayHelper, AssignmentInterface, BlockoutDateInterface, DisplayBox, InputBox, Locale, Notes, PersonInterface, PlanInterface, PositionInterface, SmallButton, TimeInterface } from "@churchapps/apphelper";
import { PositionEdit } from "./PositionEdit";
import { PositionList } from "./PositionList";
import { AssignmentEdit } from "./AssignmentEdit";
import { TimeList } from "./TimeList";
import { PlanValidation } from "./PlanValidation";
import { Banner } from "@churchapps/apphelper";
import { PlanItemInterface } from "../../helpers";
import { PlanItemEdit } from "./PlanItemEdit";

interface Props {
  plan: PlanInterface
}

export const ServiceOrder = (props: Props) => {
  const [planItems, setPlanItems] = React.useState<PlanItemInterface[]>([]);
  const [editPlanItem, setEditPlanItem] = React.useState<PlanItemInterface>(null);

  const loadData = async () => {
    if (props.plan?.id) {
      ApiHelper.get("/planItems/plan/" + props.plan.id.toString(), "DoingApi").then(d => { setPlanItems(d); });
    }
  }

  const addHeader = () => {
    setEditPlanItem({ itemType: "Header", planId: props.plan.id, sort: 1 });
  }

  const getEditContent = () => (
    <SmallButton onClick={addHeader} icon="add" />
  )

  const getPlanItem = () => {
    let a=1;
    return <p>Item</p>
  }

  React.useEffect(() => { loadData(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (<>

    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Order of Service" headerIcon="album" editContent={getEditContent()}>
          {planItems.map((pi, i) => getPlanItem())}
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        {editPlanItem && <PlanItemEdit planItem={editPlanItem} onDone={() => { setEditPlanItem(null); loadData() }} />}
      </Grid>
    </Grid>

  </>)
};

