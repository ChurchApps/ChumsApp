import React from "react";
import { Grid, Icon, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { ApiHelper, DisplayBox, PlanInterface, SmallButton } from "@churchapps/apphelper";
import { PlanItemInterface } from "../../helpers";
import { PlanItemEdit } from "./PlanItemEdit";
import { tableCellClasses } from "@mui/material/TableCell";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { PlanItem } from "./PlanItem";
import { DraggableWrapper } from "../../components/DraggableWrapper";
import { DroppableWrapper } from "../../components/DroppableWrapper";

interface Props {
  plan: PlanInterface
}

export const ServiceOrder = (props: Props) => {
  const [planItems, setPlanItems] = React.useState<PlanItemInterface[]>([]);
  const [editPlanItem, setEditPlanItem] = React.useState<PlanItemInterface>(null);
  const [showHeaderDrop, setShowHeaderDrop] = React.useState(false);
  const [showItemDrop, setShowItemDrop] = React.useState(false);

  const loadData = async () => {
    if (props.plan?.id) {
      ApiHelper.get("/planItems/plan/" + props.plan.id.toString(), "DoingApi").then(d => { setPlanItems(d); });
    }
  }

  const addHeader = () => {
    setEditPlanItem({ itemType: "header", planId: props.plan.id, sort: planItems?.length + 1 || 1 });
  }

  const getEditContent = () => (
    <SmallButton onClick={addHeader} icon="add" />
  )

  const handleDrop = (data: any, sort: number) => {
    console.log(JSON.stringify(data));
    console.log("handleDrop Header", data);
    const pi = data.data as PlanItemInterface;
    pi.sort = sort;
    ApiHelper.post("/planItems/sort", pi, "DoingApi").then(() => { loadData() });
  }

  const wrapPlanItem = (pi: PlanItemInterface, index:number) => <>
    {showHeaderDrop && <DroppableWrapper accept="planItemHeader" onDrop={(item) => { handleDrop(item, index+0.5)}}>
      &nbsp;
    </DroppableWrapper>}
    <DraggableWrapper dndType="planItemHeader" data={pi} draggingCallback={(isDragging) => setShowHeaderDrop(isDragging)}>
      <PlanItem planItem={pi} setEditPlanItem={setEditPlanItem} showItemDrop={showItemDrop} onDragChange={(dragging) => setShowItemDrop(dragging)} onChange={() => {loadData()}} />
    </DraggableWrapper>

  </>


  React.useEffect(() => { loadData(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (<>

    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Order of Service" headerIcon="album" editContent={getEditContent()}>
          <DndProvider backend={HTML5Backend}>
            {planItems.map((pi, i) => wrapPlanItem(pi,i))}
            {showHeaderDrop && <DroppableWrapper accept="planItemHeader" onDrop={(item) => { handleDrop(item, planItems?.length + 1)}}>&nbsp;</DroppableWrapper>}
          </DndProvider>
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        {editPlanItem && <PlanItemEdit planItem={editPlanItem} onDone={() => { setEditPlanItem(null); loadData() }} />}
      </Grid>
    </Grid>

  </>)
};

