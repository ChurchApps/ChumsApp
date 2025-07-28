import React, { useState } from "react";
import { GroupAdd } from "./components";
import { ApiHelper, UserHelper, ExportLink, Loading, Locale, PageHeader } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import {
 Table, TableBody, TableCell, TableRow, TableHead, Stack, Paper, Box, Chip, Button, Typography, IconButton, Toolbar 
} from "@mui/material";
import { Groups as GroupsIcon, Add as AddIcon, FileDownload as ExportIcon, Folder as FolderIcon, Group as GroupIcon } from "@mui/icons-material";
import { useMountedState, type GroupInterface, Permissions } from "@churchapps/apphelper";

export const GroupsPage = () => {
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMounted = useMountedState();


  const handleAddUpdated = () => {
    setShowAdd(false);
    loadData();
  };

  const loadData = () => {
    setIsLoading(true);
    ApiHelper.get("/groups/tag/standard", "MembershipApi")
      .then((data) => {
        if (isMounted()) {
          setGroups(data);
        }
      })
      .finally(() => {
        if (isMounted()) {
          setIsLoading(false);
        }
      });
  };

  React.useEffect(loadData, [isMounted]);

  const getRows = () => {
    const rows: JSX.Element[] = [];

    if (groups.length === 0) {
      rows.push(<TableRow key="0">
          <TableCell>{Locale.label("groups.groupsPage.noGroupMsg")}</TableCell>
        </TableRow>);
      return rows;
    }

    let lastCat = "";
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      const cat =
        g.categoryName !== lastCat ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FolderIcon sx={{ marginRight: "5px" }} /> {g.categoryName}
          </Box>
        ) : (
          <></>
        );
      const memberCount = g.memberCount === 1 ? Locale.label("groups.groupsPage.pers") : g.memberCount.toString() + Locale.label("groups.groupsPage.spPpl");
      rows.push(<TableRow sx={{ whiteSpace: "nowrap" }} key={g.id}>
          <TableCell>{cat}</TableCell>
          <TableCell>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <GroupIcon sx={{ marginRight: "5px" }} /> <Link to={"/groups/" + g.id.toString()}>{g.name}</Link>
            </Box>
          </TableCell>
          <TableCell>
            {g.labelArray.map((label, index) => (
              <Chip key={`${g.id}-${label}-${index}`} label={label} variant="outlined" size="small" style={{ marginRight: 5 }} />
            ))}
          </TableCell>
          <TableCell>{memberCount}</TableCell>
        </TableRow>);
      lastCat = g.categoryName;
    }
    return rows;
  };

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (groups.length === 0) return rows;
    rows.push(<TableRow sx={{ textAlign: "left" }} key="header">
        <TableCell sx={{ fontWeight: 600, color: "#666" }}>{Locale.label("groups.groupsPage.cat")}</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "#666" }}>{Locale.label("common.name")}</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "#666" }}>{Locale.label("groups.groupsPage.labels")}</TableCell>
        <TableCell sx={{ fontWeight: 600, color: "#666" }}>{Locale.label("groups.groupsPage.ppl")}</TableCell>
      </TableRow>);
    return rows;
  };

  const addBox = showAdd ? <GroupAdd updatedFunction={handleAddUpdated} tags="standard" /> : <></>;

  const getTable = () => {
    if (isLoading) return <Loading />;
    else {
      return (
        <Paper sx={{ width: "100%", overflowX: "auto" }}>
          {groups.length > 0 && UserHelper.checkAccess(Permissions.membershipApi.groups.edit) && (
            <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, justifyContent: "flex-end" }}>
              <IconButton
                component={ExportLink}
                data={groups}
                filename="groups.csv"
                size="small"
                sx={{ color: "primary.main" }}
              >
                <ExportIcon />
              </IconButton>
            </Toolbar>
          )}
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>{getTableHeader()}</TableHead>
            <TableBody>{getRows()}</TableBody>
          </Table>
        </Paper>
      );
    }
  };

  return (
    <>
      <PageHeader
        icon={<GroupsIcon />}
        title={Locale.label("groups.groupsPage.groups")}
        subtitle={groups.length > 0 ? `Manage ${groups.length} groups and their members` : "Create and organize groups for your church community"}
        statistics={groups.length > 0 ? [
          { icon: <GroupIcon />, value: groups.length.toString(), label: "Total Groups" },
          { icon: <FolderIcon />, value: [...new Set(groups.map(g => g.categoryName))].length.toString(), label: "Categories" },
          { icon: <GroupIcon />, value: groups.reduce((total, group) => total + (group.memberCount || 0), 0).toString(), label: "Total Members" }
        ] : undefined}
      >
        {UserHelper.checkAccess(Permissions.membershipApi.groups.edit) && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowAdd(true)}
            sx={{
              color: "#FFF",
              borderColor: "rgba(255,255,255,0.5)",
              "&:hover": {
                borderColor: "#FFF",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            data-testid="add-group-button"
          >
            Add Group
          </Button>
        )}
      </PageHeader>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {addBox}
        {getTable()}
      </Box>
    </>
  );
};
