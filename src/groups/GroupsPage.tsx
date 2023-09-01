import React, { useState } from "react";
import { GroupAdd } from "./components";
import { ApiHelper, DisplayBox, UserHelper, ExportLink, Loading } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { Grid, Icon, Table, TableBody, TableCell, TableRow, TableHead, Stack, IconButton, Paper, Box } from "@mui/material"
import { useMountedState, GroupInterface, Permissions } from "@churchapps/apphelper";

export const GroupsPage = () => {
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMounted = useMountedState();

  const getEditContent = () => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.groups.edit)) return null;
    else
      return (
        <Stack direction="row" alignItems="center">
          <ExportLink data={groups} spaceAfter={true} filename="groups.csv" />{" "}
          <IconButton aria-label="addGroup" color="primary" onClick={() => { setShowAdd(true); }}>
            <Icon>add</Icon>
          </IconButton>
        </Stack>
      );
  };

  const handleAddUpdated = () => { setShowAdd(false); loadData(); };

  const loadData = () => {
    setIsLoading(true)
    ApiHelper.get("/groups", "MembershipApi")
      .then((data) => {
        if(isMounted()) {
          setGroups(data);
        }
      })
      .finally(() => {
        if(isMounted()) {
          setIsLoading(false);
        }})
  };

  React.useEffect(loadData, [isMounted]);

  const getRows = () => {
    let rows: JSX.Element[] = [];

    if (groups.length === 0) {
      rows.push(<TableRow key="0"><TableCell>No groups found. Please create a group.</TableCell></TableRow>);
      return rows;
    }

    let lastCat = "";
    for (let i = 0; i < groups.length; i++) {
      let g = groups[i];
      let cat = (g.categoryName !== lastCat) ? <Box sx={{display: "flex", alignItems: "center"}}><Icon>folder</Icon> {g.categoryName}</Box> : <></>
      let memberCount = g.memberCount === 1 ? "1 person" : g.memberCount.toString() + " people";
      rows.push(
        <TableRow sx={{whiteSpace: "nowrap"}} key={g.id}>
          <TableCell>{cat}</TableCell>
          <TableCell>
            <Box sx={{display: "flex", alignItems: "center"}}>
              <Icon sx={{marginRight: "5px"}}>group</Icon>{" "}
              <Link to={"/groups/" + g.id.toString()}>{g.name}</Link>
            </Box>
          </TableCell>
          <TableCell>{memberCount}</TableCell>
        </TableRow>
      );
      lastCat = g.categoryName;
    }
    return rows;
  };

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (groups.length === 0) return rows;
    rows.push(<TableRow sx={{textAlign: "left"}} key="header"><th>Category</th><th>Name</th><th>People</th></TableRow>);
    return rows;
  }

  let addBox = (showAdd) ? <GroupAdd updatedFunction={handleAddUpdated} /> : <></>

  const getTable = () => {
    if (isLoading) return <Loading />
    else return (<Paper sx={{ width: "100%", overflowX: "auto" }}>
      <Table>
        <TableHead>{getTableHeader()}</TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>
    </Paper>);
  }

  return (
    <>
      <h1><Icon>people</Icon> Groups</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox id="groupsBox" headerIcon="group" headerText="Groups" editContent={getEditContent()}>
            {getTable()}
          </DisplayBox>
        </Grid>
        <Grid item md={4} xs={12}>{addBox}</Grid>
      </Grid>
    </>
  );
};
