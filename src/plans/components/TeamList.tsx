import React, { useState, useCallback } from "react";
import { ApiHelper, DisplayBox, UserHelper, Loading, ArrayHelper, Locale } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { Grid, Icon, Table, TableBody, TableCell, TableRow, TableHead, Stack, IconButton, Paper, Box } from "@mui/material"
import { useMountedState, type GroupInterface, Permissions } from "@churchapps/apphelper";
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
          <IconButton aria-label="Add group" color="primary" onClick={() => { setShowAdd(true); }} data-testid="add-team-button">
            <Icon>add</Icon>
          </IconButton>
        </Stack>
      );
  };

  const handleAddUpdated = () => { setShowAdd(false); loadData(); };

  const loadData = useCallback(() => {
    setIsLoading(true)
    ApiHelper.get("/groups/tag/team", "MembershipApi")
      .then((data) => {
        if(isMounted()) setGroups(ArrayHelper.getAll(data, "categoryName", props.ministry.id));
      })
      .finally(() => {
        if(isMounted()) setIsLoading(false);
      })
  }, [props.ministry.id, isMounted]);

  React.useEffect(loadData, [loadData]);

  const getRows = () => {
    const rows: JSX.Element[] = [];

    if (groups.length === 0) {
      rows.push(<TableRow key="0"><TableCell>{Locale.label("plans.teamList.noTeam")}</TableCell></TableRow>);
      return rows;
    }

    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      const memberCount = g.memberCount === 1 ? Locale.label("plans.teamList.pers") : g.memberCount?.toString() + Locale.label("plans.teamList.peeps");
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

  const addBox = (showAdd) ? <GroupAdd updatedFunction={handleAddUpdated} tags="team" categoryName={props.ministry.id} /> : <></>

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
      {addBox}
      <DisplayBox id="groupsBox" headerIcon="group" headerText={Locale.label("plans.teamList.teams")} editContent={getEditContent()}>
        {getTable()}
      </DisplayBox>
    </>
  );
};
