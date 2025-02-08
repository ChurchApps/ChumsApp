import React from "react";
import { Grid, Icon, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { ApiHelper, DisplayBox, PlanInterface, SmallButton } from "@churchapps/apphelper";
import { PlanItemInterface } from "../../helpers";
import { PlanItemEdit } from "./PlanItemEdit";
import { tableCellClasses } from "@mui/material/TableCell";

interface Props {
  plan: PlanInterface
}

export const ServiceOrder = (props: Props) => {
  const [planItems, setPlanItems] = React.useState<PlanItemInterface[]>([]);
  const [editPlanItem, setEditPlanItem] = React.useState<PlanItemInterface>(null);
  const [selectedItem, setSelectedItem] = React.useState<PlanItemInterface>(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadData = async () => {
    if (props.plan?.id) {
      ApiHelper.get("/planItems/plan/" + props.plan.id.toString(), "DoingApi").then(d => { setPlanItems(d); });
    }
  }

  const addHeader = () => {
    setEditPlanItem({ itemType: "header", planId: props.plan.id, sort: planItems?.length + 1 || 1 });
  }

  const addSong = () => {
    handleClose();
    setEditPlanItem({ itemType: "song", planId: props.plan.id, sort: selectedItem.children?.length + 1 || 1, parentId:selectedItem.id });
  }

  const addItem = () => {
    handleClose();
    setEditPlanItem({ itemType: "item", planId: props.plan.id, sort: selectedItem.children?.length + 1 || 1, parentId:selectedItem.id });
  }

  const getEditContent = () => (
    <SmallButton onClick={addHeader} icon="add" />
  )

  const getChildren = (pi:PlanItemInterface) => {
    const result:JSX.Element[] = [];
    pi.children?.forEach(c => {
      result.push(getPlanItem(c));
    });
    return result;
  }

  const getHeaderRow = (pi:PlanItemInterface) => <>
    <TableRow style={{backgroundColor:"#EEE", borderBottom: "3px solid var(--c1l2)"}}>
      <TableCell colSpan={2} style={{fontWeight:"bold", paddingLeft:10, textTransform:"uppercase"  }}>
        <span style={{float:"right", marginTop:-2, marginBottom:-2}}>
          <a href="about:blank" onClick={e => { e.preventDefault(); setAnchorEl(e.currentTarget); setSelectedItem(pi);  }}><Icon>add</Icon></a>
          &nbsp;
          <a href="about:blank" onClick={e => { e.preventDefault(); setEditPlanItem(pi); }}><Icon>edit</Icon></a>
        </span>
        {pi.label}
      </TableCell>
    </TableRow>
    {getChildren(pi)}
  </>

  const getItemRow = (pi:PlanItemInterface) => <>
    <TableRow>
      <TableCell style={{paddingLeft:10}}>{pi.seconds}</TableCell>
      <TableCell>
        <span style={{float:"right", marginTop:-2, marginBottom:-2}}>
          <a href="about:blank" onClick={e => { e.preventDefault(); setEditPlanItem(pi); }}><Icon>edit</Icon></a>
        </span>
        {pi.label}
      </TableCell>
    </TableRow>
    {getDescriptionRow(pi)}
  </>

  const getSongRow = (pi:PlanItemInterface) => <>
    <TableRow>
      <TableCell style={{paddingLeft:10}}>{pi.seconds}</TableCell>
      <TableCell>
        <span style={{float:"right", marginTop:-2, marginBottom:-2}}>
          <a href="about:blank" onClick={e => { e.preventDefault(); setEditPlanItem(pi); }}><Icon>edit</Icon></a>
        </span>
        {pi.label}
      </TableCell>
    </TableRow>
    {getDescriptionRow(pi)}
  </>

  const getDescriptionRow = (pi:PlanItemInterface) => <TableRow>
    <TableCell colSpan={2} style={{borderBottom:"2px solid #DDD", paddingTop:0, paddingLeft:10, fontStyle:"italic"}}>{pi.description}</TableCell>
  </TableRow>

  const getPlanItem = (pi:PlanItemInterface) => {
    switch (pi.itemType) {
      case "header": return getHeaderRow(pi);
      case "song": return getSongRow(pi);
      case "item": return getItemRow(pi);
    }
  }

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
              {planItems.map((pi, i) => getPlanItem(pi))}
            </TableBody>
          </Table>
        </DisplayBox>
        <Menu id="header-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={addSong}><Icon style={{marginRight:10}}>music_note</Icon> Song</MenuItem>
          <MenuItem onClick={addItem}><Icon style={{marginRight:10}}>format_list_bulleted</Icon> Item</MenuItem>
        </Menu>
      </Grid>
      <Grid item md={4} xs={12}>
        {editPlanItem && <PlanItemEdit planItem={editPlanItem} onDone={() => { setEditPlanItem(null); loadData() }} />}
      </Grid>
    </Grid>

  </>)
};

