import React from "react";
import { Icon, IconButton, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { ApiHelper, ArrayHelper, DateHelper, DisplayBox, GroupInterface, GroupMemberInterface, PlanInterface, PositionInterface, SmallButton, TimeInterface } from "@churchapps/apphelper";
import { Link, Navigate } from "react-router-dom";
import { GroupAdd } from "../../groups/components";
import UserContext from "../../UserContext";

interface Props {
}

export const MinistryList = (props:Props) => {
  const [redirect, setRedirect] = React.useState("");
  const [groups, setGroups] = React.useState<GroupInterface[]>(null);
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const [groupMembers, setGroupMembers] = React.useState<GroupMemberInterface[]>([]);
  const handleAdd = () => { setShowAdd(true); }
  const handleAddUpdated = () => { setShowAdd(false); loadData(); };
  const context = React.useContext(UserContext);

  const loadData = async () => {
    const groups:GroupInterface[] = await ApiHelper.get("/groups/tag/ministry", "MembershipApi");
    setGroups(groups)
    if (groups.length>0) ApiHelper.get("/groupMembers?groupIds=" + ArrayHelper.getIds(groups, "id"), "MembershipApi").then((data) => { setGroupMembers(data); })
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
      const members = ArrayHelper.getAll(groupMembers, "groupId", g.id);
      const hasAccess = members.length===0 || ArrayHelper.getOne(members, "personId", context.person?.id) !== null;
      if (hasAccess && window.location.pathname==="/plans") setRedirect("/plans/ministries/" + g.id.toString());

      rows.push(<TableRow key={g.id}>
        <TableCell>
          {hasAccess ? (<Link to={"/plans/ministries/" + g.id.toString()}>{g.name}</Link>) : g.name}
        </TableCell>
        <TableCell align="right">
          {hasAccess && <Link to={"/groups/" + g.id.toString() + "?tag=ministry"}><Icon>edit</Icon></Link>}
        </TableCell>
      </TableRow>);
    }
    return rows;
  };

  React.useEffect(() => {loadData()}, []);

  if (redirect !== "") return <Navigate to={redirect} />;
  else if (showAdd) return (<GroupAdd updatedFunction={handleAddUpdated} tags="ministry" categoryName="Ministry" />)
  else return (<DisplayBox headerText="Ministries" headerIcon="assignment" editContent={getAddLink()}>
    <Table size="small">
      <TableBody>
        {getRows()}
      </TableBody>
    </Table>
  </DisplayBox>);
}

