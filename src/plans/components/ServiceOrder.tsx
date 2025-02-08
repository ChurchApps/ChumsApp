import React from "react";
import { Grid, Icon, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { ApiHelper, DisplayBox, PlanInterface, SmallButton } from "@churchapps/apphelper";
import { PlanItemInterface } from "../../helpers";
import { PlanItemEdit } from "./PlanItemEdit";
import { tableCellClasses } from "@mui/material/TableCell";
import { useDrag } from 'react-dnd'
import { PlanItem } from "./PlanItem";

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
    setEditPlanItem({ itemType: "header", planId: props.plan.id, sort: planItems?.length + 1 || 1 });
  }

  const getEditContent = () => (
    <SmallButton onClick={addHeader} icon="add" />
  )


  React.useEffect(() => { loadData(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (<>

    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Order of Service" headerIcon="album" editContent={getEditContent()}>
          <Table size="small" sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none"
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell style={{paddingLeft:10}}>Length</TableCell>
                <TableCell>Title</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planItems.map((pi, i) => <PlanItem planItem={pi} setEditPlanItem={setEditPlanItem} />)}
            </TableBody>
          </Table>
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        {editPlanItem && <PlanItemEdit planItem={editPlanItem} onDone={() => { setEditPlanItem(null); loadData() }} />}
      </Grid>
    </Grid>

  </>)
};

