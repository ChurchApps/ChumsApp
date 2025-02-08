import React from "react";
import { Grid, Icon, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { ApiHelper, DisplayBox, PlanInterface, SmallButton } from "@churchapps/apphelper";
import { PlanItemInterface } from "../../helpers";
import { PlanItemEdit } from "./PlanItemEdit";
import { tableCellClasses } from "@mui/material/TableCell";
import { useDrag } from 'react-dnd'

interface Props {
  planItem: PlanItemInterface
  setEditPlanItem: (pi:PlanItemInterface) => void
}

export const PlanItem = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addSong = () => {
    handleClose();
    props.setEditPlanItem({ itemType: "song", planId: props.planItem.planId, sort: props.planItem.children?.length + 1 || 1, parentId:props.planItem.id });
  }

  const addItem = () => {
    handleClose();
    props.setEditPlanItem({ itemType: "item", planId: props.planItem.planId, sort: props.planItem.children?.length + 1 || 1, parentId:props.planItem.id });
  }

  const getChildren = () => {
    const result:JSX.Element[] = [];
    props.planItem.children?.forEach(c => {
      result.push(<PlanItem key={c.id} planItem={c} setEditPlanItem={props.setEditPlanItem} />);
    });
    return result;
  }

  const getHeaderRow = () => <>
    <TableRow style={{backgroundColor:"#EEE", borderBottom: "3px solid var(--c1l2)"}}>
      <TableCell colSpan={2} style={{fontWeight:"bold", paddingLeft:10, textTransform:"uppercase"  }}>
        <span style={{float:"right", marginTop:-2, marginBottom:-2}}>
          <a href="about:blank" onClick={e => { e.preventDefault(); setAnchorEl(e.currentTarget); }}><Icon>add</Icon></a>
          &nbsp;
          <a href="about:blank" onClick={e => { e.preventDefault(); props.setEditPlanItem(props.planItem); }}><Icon>edit</Icon></a>
        </span>
        {props.planItem.label}
      </TableCell>
    </TableRow>
    {getChildren()}
  </>

  const getItemRow = () => <>
    <TableRow>
      <TableCell style={{paddingLeft:10}}>{formatTime(props.planItem.seconds)}</TableCell>
      <TableCell>
        <span style={{float:"right", marginTop:-2, marginBottom:-2}}>
          <a href="about:blank" onClick={e => { e.preventDefault(); props.setEditPlanItem(props.planItem); }}><Icon>edit</Icon></a>
        </span>
        {props.planItem.label}
      </TableCell>
    </TableRow>
    {getDescriptionRow()}
  </>

  const getSongRow = () => <>
    <TableRow>
      <TableCell style={{paddingLeft:10}}>{formatTime(props.planItem.seconds)}</TableCell>
      <TableCell>
        <span style={{float:"right", marginTop:-2, marginBottom:-2}}>
          <a href="about:blank" onClick={e => { e.preventDefault(); props.setEditPlanItem(props.planItem); }}><Icon>edit</Icon></a>
        </span>
        {props.planItem.label}
      </TableCell>
    </TableRow>
    {getDescriptionRow()}
  </>

  const getDescriptionRow = () => <TableRow>
    <TableCell colSpan={2} style={{borderBottom:"2px solid #DDD", paddingTop:0, paddingLeft:10, fontStyle:"italic"}}>{props.planItem.description}</TableCell>
  </TableRow>

  const getPlanItem = () => {
    switch (props.planItem.itemType) {
      case "header": return getHeaderRow();
      case "song": return getSongRow();
      case "item": return getItemRow();
    }
  }

  const formatTime = (seconds:number) => {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return minutes + ":" + (secs < 10 ? "0" : "") + secs;
  }

  return (<>
    {getPlanItem}
    {props.planItem?.itemType==="header" && <Menu id="header-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={addSong}><Icon style={{marginRight:10}}>music_note</Icon> Song</MenuItem>
      <MenuItem onClick={addItem}><Icon style={{marginRight:10}}>format_list_bulleted</Icon> Item</MenuItem>
    </Menu>}

  </>)
};

