import React, { useState } from "react";
import { ApiHelper, DisplayBox, UserHelper, Loading, ArrayHelper, Locale } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { Grid, Icon, Table, TableBody, TableCell, TableRow, TableHead, Stack, IconButton, Paper, Box } from "@mui/material"
import { useMountedState, GroupInterface, Permissions } from "@churchapps/apphelper";
import { GroupAdd } from "../../groups/components";

interface Props { ministry: GroupInterface }

export const TeamList = (props:Props) => {
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMounted = useMountedState();

  const getEditContent = () => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.groups.edit)) return null;
    else
      return (
        <Stack direction="row" alignItems="center">
          <IconButton aria-label="addGroup" color="primary" onClick={() => { setShowAdd(true); }}>
            <Icon>add</Icon>
          </IconButton>
        </Stack>
      );
  };

  const handleAddUpdated = () => { setShowAdd(false); loadData(); };

  const loadData = () => {
    setIsLoading(true)
    ApiHelper.get("/groups/tag/team", "MembershipApi")
      .then((data) => {
        if(isMounted()) setGroups(ArrayHelper.getAll(data, "categoryName", props.ministry.id));
      })
      .finally(() => {
        if(isMounted()) setIsLoading(false);
      })
  };

  React.useEffect(loadData, [isMounted]);  // eslint-disable-line react-hooks/exhaustive-deps

  const getRows = () => {
    let rows: JSX.Element[] = [];

    if (groups.length === 0) {
      rows.push(<TableRow key="0"><TableCell>{Locale.label("plans.teamList.noTeam")}</TableCell></TableRow>);
      return rows;
    }

    for (let i = 0; i < groups.length; i++) {
      let g = groups[i];
      let memberCount = g.memberCount === 1 ? Locale.label("plans.teamList.pers") : g.memberCount?.toString() + Locale.label("plans.teamList.peeps");
      rows.push(
        <TableRow sx={{whiteSpace: "nowrap"}} key={g.id}>
          <TableCell>
            <Box sx={{display: "flex", alignItems: "center"}}>
              <Icon sx={{marginRight: "5px"}}>group</Icon>{" "}
              <Link to={"/groups/" + g.id.toString() + "?tag=team"}>{g.name}</Link>
            </Box>
          </TableCell>
          <TableCell>{memberCount}</TableCell>
        </TableRow>
      );
    }
    return rows;
  };

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (groups.length === 0) return rows;
    rows.push(<TableRow sx={{textAlign: "left"}} key="header"><th>{Locale.label("common.name")}</th><th>{Locale.label("plans.teamList.ppl")}</th></TableRow>);
    return rows;
  }

  let addBox = (showAdd) ? <GroupAdd updatedFunction={handleAddUpdated} tags="team" categoryName={props.ministry.id} /> : <></>

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
      <h1><Icon>people</Icon> {props.ministry.name} {Locale.label("plans.teamList.teams")}</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox id="groupsBox" headerIcon="group" headerText={Locale.label("plans.teamList.teams")} editContent={getEditContent()}>
            {getTable()}
          </DisplayBox>
        </Grid>
        <Grid item md={4} xs={12}>{addBox}</Grid>
      </Grid>
    </>
  );
};
