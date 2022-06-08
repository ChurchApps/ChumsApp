import React, { useState } from "react";
import { ApiHelper, DisplayBox, GroupInterface, GroupAdd, UserHelper, ExportLink, Permissions, Loading } from "./components";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Wrapper } from "../components/Wrapper";
import { Grid, Icon } from "@mui/material"

export const GroupsPage = () => {
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getEditContent = () => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.groups.edit)) return null;
    else
      return (
        <>
          <ExportLink data={groups} spaceAfter={true} filename="groups.csv" />{" "}
          <button className="no-default-style" aria-label="addGroup" onClick={() => { setShowAdd(true); }}>
            <Icon>add</Icon>
          </button>
        </>
      );
  };

  const handleAddUpdated = () => { setShowAdd(false); loadData(); };

  const loadData = () => {
    setIsLoading(true)
    ApiHelper.get("/groups", "MembershipApi").then((data) => { setGroups(data); }).finally(() => setIsLoading(false));
  };

  React.useEffect(loadData, []);

  const getRows = () => {
    let rows: JSX.Element[] = [];

    if (groups.length === 0) {
      rows.push(<tr key="0"><td>No groups found. Please create a group.</td></tr>);
      return rows;
    }

    let lastCat = "";
    for (let i = 0; i < groups.length; i++) {
      let g = groups[i];
      let cat = (g.categoryName !== lastCat) ? <><Icon>folder</Icon> {g.categoryName}</> : <></>
      let memberCount = g.memberCount === 1 ? "1 person" : g.memberCount.toString() + " people";
      rows.push(
        <tr key={g.id}>
          <td>{cat}</td>
          <td>
            <Icon>group</Icon>{" "}
            <Link to={"/groups/" + g.id.toString()}>{g.name}</Link>
          </td>
          <td>{memberCount}</td>
        </tr>
      );
      lastCat = g.categoryName;
    }
    return rows;
  };

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (groups.length === 0) return rows;
    rows.push(<tr key="header"><th>Category</th><th>Name</th><th>People</th></tr>);
    return rows;
  }

  let addBox = (showAdd) ? <GroupAdd updatedFunction={handleAddUpdated} /> : <></>

  const getTable = () => {
    if (isLoading) return <Loading />
    else return (<Table>
      <thead>{getTableHeader()}</thead>
      <tbody>{getRows()}</tbody>
    </Table>);
  }

  return (
    <Wrapper pageTitle="Groups">
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox id="groupsBox" headerIcon="group" headerText="Groups" editContent={getEditContent()}>
            {getTable()}
          </DisplayBox>
        </Grid>
        <Grid item md={4} xs={12}>{addBox}</Grid>
      </Grid>
    </Wrapper>
  );
};
