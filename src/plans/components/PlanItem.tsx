import React from "react";
import { Grid, Icon, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { PlanItemInterface } from "../../helpers";

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
    <div className="planItemHeader">
      <span style={{float:"right", marginTop:-2, marginBottom:-2}}>
        <a href="about:blank" onClick={e => { e.preventDefault(); setAnchorEl(e.currentTarget); }}><Icon>add</Icon></a>
          &nbsp;
        <a href="about:blank" onClick={e => { e.preventDefault(); props.setEditPlanItem(props.planItem); }}><Icon>edit</Icon></a>
      </span>
      {props.planItem.label}
    </div>
    {getChildren()}
  </>

  const getItemRow = () => <>
    <div className="planItem">
      <div>{formatTime(props.planItem.seconds)}</div>
      <div>
        <span style={{float:"right", marginTop:-2, marginBottom:-2}}>
          <a href="about:blank" onClick={e => { e.preventDefault(); props.setEditPlanItem(props.planItem); }}><Icon>edit</Icon></a>
        </span>
        {props.planItem.label}
      </div>
      {getDescriptionRow()}
    </div>
  </>

  const getSongRow = () => <>
    <div className="planItem">
      <div>{formatTime(props.planItem.seconds)}</div>
      <div>
        <span style={{float:"right", marginTop:-2, marginBottom:-2}}>
          <a href="about:blank" onClick={e => { e.preventDefault(); props.setEditPlanItem(props.planItem); }}><Icon>edit</Icon></a>
        </span>
        {props.planItem.label}
      </div>
      {getDescriptionRow()}
    </div>
  </>

  const getDescriptionRow = () => <div className="planItemDescription">{props.planItem.description}</div>

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
    {getPlanItem()}
    {props.planItem?.itemType==="header" && <Menu id="header-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={addSong}><Icon style={{marginRight:10}}>music_note</Icon> Song</MenuItem>
      <MenuItem onClick={addItem}><Icon style={{marginRight:10}}>format_list_bulleted</Icon> Item</MenuItem>
    </Menu>}

  </>)
};

