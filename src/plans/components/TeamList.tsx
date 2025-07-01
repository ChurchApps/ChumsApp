import React, { useState, useCallback, memo, useMemo } from "react";
import { ApiHelper, DisplayBox, UserHelper, Loading, ArrayHelper, Locale } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { Icon, Table, TableBody, TableCell, TableRow, TableHead, Stack, IconButton, Paper, Box } from "@mui/material"
import { useMountedState, type GroupInterface, Permissions } from "@churchapps/apphelper";
import { GroupAdd } from "../../groups/components";

interface Props { ministry: GroupInterface }

export const TeamList = memo((props:Props) => {
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMounted = useMountedState();

  const handleAddClick = useCallback(() => { 
    setShowAdd(true); 
  }, []);

  const editContent = useMemo(() => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.groups.edit)) return null;
    return (
      <Stack direction="row" alignItems="center">
        <IconButton aria-label="Add group" color="primary" onClick={handleAddClick} data-testid="add-team-button">
          <Icon>add</Icon>
        </IconButton>
      </Stack>
    );
  }, [handleAddClick]);

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

  const handleAddUpdated = useCallback(() => { 
    setShowAdd(false); 
    loadData(); 
  }, [loadData]);

  React.useEffect(loadData, [loadData]);

  const rows = useMemo(() => {
    if (groups.length === 0) {
      return [<TableRow key="0"><TableCell>{Locale.label("plans.teamList.noTeam")}</TableCell></TableRow>];
    }

    return groups.map((g) => {
      const memberCount = g.memberCount === 1 ? Locale.label("plans.teamList.pers") : g.memberCount?.toString() + Locale.label("plans.teamList.peeps");
      return (
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
    });
  }, [groups]);

  const tableHeader = useMemo(() => {
    if (groups.length === 0) return [];
    return [<TableRow sx={{textAlign: "left"}} key="header"><th>{Locale.label("common.name")}</th><th>{Locale.label("plans.teamList.ppl")}</th></TableRow>];
  }, [groups.length]);

  const addBox = useMemo(() => 
    showAdd ? <GroupAdd updatedFunction={handleAddUpdated} tags="team" categoryName={props.ministry.id} /> : <></>,
    [showAdd, handleAddUpdated, props.ministry.id]
  );

  const table = useMemo(() => {
    if (isLoading) return <Loading />
    return (
      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        <Table>
          <TableHead>{tableHeader}</TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </Paper>
    );
  }, [isLoading, tableHeader, rows]);

  return (
    <>
      {addBox}
      <DisplayBox id="groupsBox" headerIcon="group" headerText={Locale.label("plans.teamList.teams")} editContent={editContent}>
        {table}
      </DisplayBox>
    </>
  );
});
