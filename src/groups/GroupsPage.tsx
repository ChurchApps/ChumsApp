import React, { useState } from "react";
import { GroupAdd } from "./components";
import { ApiHelper, UserHelper, ExportLink, Loading, Locale } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import {
 Table, TableBody, TableCell, TableRow, TableHead, Stack, Paper, Box, Chip, Button 
} from "@mui/material";
import { Groups as GroupsIcon, Add as AddIcon, FileDownload as ExportIcon } from "@mui/icons-material";
import { useMountedState, type GroupInterface, Permissions } from "@churchapps/apphelper";
import { PageHeader } from "../components/ui";

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
            <Icon>folder</Icon> {g.categoryName}
          </Box>
        ) : (
          <></>
        );
      const memberCount = g.memberCount === 1 ? Locale.label("groups.groupsPage.pers") : g.memberCount.toString() + Locale.label("groups.groupsPage.spPpl");
      rows.push(<TableRow sx={{ whiteSpace: "nowrap" }} key={g.id}>
          <TableCell>{cat}</TableCell>
          <TableCell>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon sx={{ marginRight: "5px" }}>group</Icon> <Link to={"/groups/" + g.id.toString()}>{g.name}</Link>
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
        <th>{Locale.label("groups.groupsPage.cat")}</th>
        <th>{Locale.label("common.name")}</th>
        <th>{Locale.label("groups.groupsPage.labels")}</th>
        <th>{Locale.label("groups.groupsPage.ppl")}</th>
      </TableRow>);
    return rows;
  };

  const addBox = showAdd ? <GroupAdd updatedFunction={handleAddUpdated} tags="standard" /> : <></>;

  const getTable = () => {
    if (isLoading) return <Loading />;
    else {
      return (
        <Paper sx={{ width: "100%", overflowX: "auto" }}>
          <Table>
            <TableHead>{getTableHeader()}</TableHead>
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
      >
        {UserHelper.checkAccess(Permissions.membershipApi.groups.edit) && (
          <>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              component={ExportLink}
              data={groups}
              filename="groups.csv"
              sx={{
                color: "#FFF",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
                mr: 1,
              }}
            >
              Export
            </Button>
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
          </>
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
