import React from "react";
import { Icon, IconButton, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { ApiHelper, ArrayHelper, DateHelper, DisplayBox, GroupInterface, PlanInterface, PositionInterface, SmallButton, TimeInterface } from "@churchapps/apphelper";
import { TimeEdit } from "./TimeEdit";
import { Link } from "react-router-dom";
import { GroupAdd } from "../../groups/components";

interface Props {
}

export const MinistryList = (props:Props) => {
  const [groups, setGroups] = React.useState<GroupInterface[]>(null);
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const handleAdd = () => { setShowAdd(true); }
  const handleAddUpdated = () => { setShowAdd(false); loadData(); };

  const loadData = () => {
    ApiHelper.get("/groups/tag/ministry", "MembershipApi").then((data) => { setGroups(data); })
  };

  const getAddLink = () => (
    <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button" onClick={handleAdd}>
      <Icon color="primary">add</Icon>
    </IconButton>
  );

  const getRows = () => {
    let rows: JSX.Element[] = [];

    if (!groups || groups.length === 0) {
      rows.push(<TableRow key="0"><TableCell>No ministries found. Please create a ministry.</TableCell></TableRow>);
      return rows;
    }

    for (let i = 0; i < groups.length; i++) {
      let g = groups[i];
      rows.push(<TableRow key={g.id}>
        <TableCell>
          <Link to={"/plans/ministries/" + g.id.toString()}>{g.name}</Link>
        </TableCell>
        <TableCell align="right">
          <Link to={"/groups/" + g.id.toString() + "?tag=ministry"}><Icon>edit</Icon></Link>
        </TableCell>
      </TableRow>);
    }
    return rows;
  };

  React.useEffect(loadData, []);


  if (showAdd) return (<GroupAdd updatedFunction={handleAddUpdated} tags="ministry" categoryName="Ministry" />)
  return (<DisplayBox headerText="Ministries" headerIcon="assignment" editContent={getAddLink()}>
    <Table size="small">
      <TableBody>
        {getRows()}
      </TableBody>
    </Table>
  </DisplayBox>);
}

