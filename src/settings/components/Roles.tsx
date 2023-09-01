import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { DisplayBox, UserHelper, ApiHelper, Permissions, ChurchInterface, RoleInterface, RolePermissionInterface } from "@churchapps/apphelper"
import { Divider, Icon, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { SmallButton } from "@churchapps/apphelper"

interface Props {
  selectRoleId: (id: string) => void;
  selectedRoleId: string;
  church: ChurchInterface;
}

export const Roles: React.FC<Props> = ({ selectRoleId, selectedRoleId, church }) => {

  const [roles, setRoles] = useState<RoleInterface[]>([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const predefined = [
    { name: "Accounting", description: "Has access to view and manage donations.", permissions: [
      Permissions.membershipApi.people.view,
      Permissions.membershipApi.people.edit,
      Permissions.givingApi.donations.edit,
      Permissions.givingApi.donations.view,
      Permissions.givingApi.donations.viewSummary,
      Permissions.givingApi.settings.edit
    ]},
    { name: "Church Staff", description: "Can edit most data in Chums.org, including people, groups, attendance and forms.", permissions: [
      Permissions.membershipApi.people.view,
      Permissions.membershipApi.people.edit,
      Permissions.membershipApi.groups.edit,
      Permissions.membershipApi.groupMembers.view,
      Permissions.membershipApi.groupMembers.edit,
      Permissions.membershipApi.forms.edit,
      Permissions.membershipApi.forms.admin,
      Permissions.attendanceApi.attendance.edit,
      Permissions.attendanceApi.attendance.view,
      Permissions.attendanceApi.services.edit,
    ]},
    { name: "Content Admin", description: "Can edit website content, mobile content and sermons.", permissions: [
      Permissions.contentApi.chat.host,
      Permissions.contentApi.content.edit,
      Permissions.contentApi.streamingServices.edit
    ]},
    { name: "Lessons Admin", description: "Can set up classrooms and schedule lessons on Lessons.church.", permissions: [
      { api: "LessonsApi", contentType:"Schedules", permission: "Edit" }
    ]}
  ]


  const loadData = () => {
    if (selectedRoleId !== "notset") return;
    ApiHelper.get(`/roles/church/${church.id}`, "MembershipApi").then(roles => setRoles(roles));
  }

  const addRole = async (role:any) => {
    console.log("made it")
    console.log(role);
    handleClose();
    if (window.confirm("Do you wish to create a new role of " + role.name + "?  It " + role.description.toLowerCase() )) {

      const roles = await ApiHelper.post("/roles", [{ name: role.name  }], "MembershipApi");
      const r = roles[0];
      const perms:RolePermissionInterface[] = [];
      role.permissions.forEach((p:any) => {
        perms.push({ roleId: r.id, apiName: p.api, contentType: p.contentType, action: p.action })
      });
      await ApiHelper.post("/rolepermissions/", perms, "MembershipApi");
      loadData();
    }
  }

  const getEditContent = () => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.roles.edit)) return null;
    else {
      return (<>
        <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button" aria-controls={open ? "add-menu" : undefined} aria-expanded={open ? "true" : undefined} aria-haspopup="true" onClick={handleClick}>
          <Icon color="primary">add</Icon>
        </IconButton>
        <Menu id="add-menu" MenuListProps={{ "aria-labelledby": "addBtnGroup" }} anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem data-cy="add-campus" onClick={() => {handleClose(); selectRoleId(""); }}>
            <Icon sx={{mr: "3px"}}>lock</Icon> Add Custom Role
          </MenuItem>
          <Divider />
          {predefined.map((role, i) => (
            <MenuItem key={role.name} onClick={() => {addRole(role); }} title={role.description}>
              <Icon sx={{mr: "3px"}}>lock</Icon> Add "<b>{role.name}</b>" Role
            </MenuItem>
          ))}
        </Menu>
      </>)
      //return (<SmallButton icon="add" text="Add" onClick={() => { selectRoleId(""); }} />);
    }
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    const sortedRoles = [...roles].sort((a, b) => a.name > b.name ? 1 : -1);
    const canEdit = (
      UserHelper.checkAccess(Permissions.membershipApi.roles.edit)
      && UserHelper.checkAccess(Permissions.membershipApi.roles.edit)
      && UserHelper.checkAccess(Permissions.membershipApi.people.view)
    );

    if (UserHelper.checkAccess(Permissions.membershipApi.roles.edit)) {
      result.push(
        <TableRow key="everyone">
          <TableCell><i className="groups" /> <Link to={`/settings/role/everyone`}>(Everyone)</Link></TableCell>
          <TableCell></TableCell>
        </TableRow>
      );
    }

    sortedRoles.forEach(role => {
      const editLink = (canEdit) ? <SmallButton icon="edit" toolTip="Edit" onClick={() => { selectRoleId(role.id) }} /> : null;
      result.push(<TableRow key={role.id}>
        <TableCell><i className="lock" /> <Link to={`/settings/role/${role.id}`}>{role.name}</Link></TableCell>
        <TableCell align="right">{editLink}</TableCell>
      </TableRow>);
    });

    return result;
  }

  useEffect(loadData, [selectedRoleId, church]); //eslint-disable-line

  return (
    <DisplayBox id="rolesBox" headerText="Roles" headerIcon="lock" editContent={getEditContent()}>
      <Table id="roleMemberTable">
        <TableHead><TableRow><TableCell>Name</TableCell><TableCell></TableCell></TableRow></TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>
    </DisplayBox>
  )
}
