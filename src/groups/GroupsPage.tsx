import React, { useState } from "react";
import { GroupAdd } from "./components";
import { ApiHelper, UserHelper, ExportLink, Loading, Locale } from "@churchapps/apphelper";
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
      {/* Enhanced Blue Header */}
      <Box
        sx={{
          backgroundColor: "var(--c1l2)",
          color: "#FFF",
          p: { xs: 2, md: 3 },
          mb: 3,
        }}
      >
        <Stack spacing={2}>
          {/* Top Row: Title and Icon */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: "flex-start", md: "center" }}>
            {/* Column 1: Title and Icon */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <Box
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GroupsIcon sx={{ fontSize: 32, color: "#FFF" }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: { xs: "1.75rem", md: "2.125rem" },
                  }}
                >
                  {Locale.label("groups.groupsPage.groups")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  }}
                >
                  {groups.length > 0 ? `Manage ${groups.length} groups and their members` : "Create and organize groups for your church community"}
                </Typography>
              </Box>
            </Stack>

            {/* Column 2: Add Group Button */}
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
          </Stack>

          {/* Statistics Row */}
          {groups.length > 0 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} flexWrap="wrap" useFlexGap justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <GroupIcon sx={{ color: "#FFF", fontSize: 20 }} />
                <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
                  {groups.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
                  Total Groups
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <FolderIcon sx={{ color: "#FFF", fontSize: 20 }} />
                <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
                  {[...new Set(groups.map(g => g.categoryName))].length}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
                  Categories
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <GroupIcon sx={{ color: "#FFF", fontSize: 20 }} />
                <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
                  {groups.reduce((total, group) => total + (group.memberCount || 0), 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.875rem" }}>
                  Total Members
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {addBox}
        {getTable()}
      </Box>
    </>
  );
};
