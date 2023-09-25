import React from "react";
import { ApiHelper, DisplayBox, UserHelper, RoleMemberInterface, RoleInterface, Permissions, SmallButton } from "@churchapps/apphelper";
import { Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

interface Props {
  role: RoleInterface,
  addFunction: (role: RoleInterface) => void,
  setSelectedRoleMember: (id: string) => void,
  roleMembers: RoleMemberInterface[],
  updatedFunction: () => void,
}

export const RoleMembers: React.FC<Props> = (props) => {
  const { roleMembers } = props;
  const isRoleEveryone = props.role.id === null;
  const getEditContent = () => {
    if (isRoleEveryone) return null;
    return <SmallButton onClick={handleAdd} icon="add" text="Add" />
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    props.addFunction(props.role);
  }

  const handleRemove = (roleMember: RoleMemberInterface) => {
    if (window.confirm(`Are you sure you wish to delete this user from ${props.role.name}?`)) {
      ApiHelper.delete("/rolemembers/" + roleMember.id, "MembershipApi").then(() => props.updatedFunction());
    }
  }

  const getRows = () => {
    let canEdit = UserHelper.checkAccess(Permissions.membershipApi.roles.edit);
    let rows: JSX.Element[] = [];
    if (isRoleEveryone) {
      rows.push(<TableRow><TableCell key="0">This role applies to all the members of the church.</TableCell></TableRow>)
      return rows;
    }

    for (let i = 0; i < roleMembers.length; i++) {
      const rm = roleMembers[i];
      const removeLink = (canEdit) ? (<SmallButton icon="delete" color="error" toolTip="Delete" onClick={() => { handleRemove(rm) }} />) : null;
      const editLink = (canEdit) ? (<SmallButton icon="edit" toolTip="Edit" onClick={() => { props.setSelectedRoleMember(rm.userId) }} />) : null;

      const { firstName, lastName } = rm.user;
      rows.push(
        <TableRow key={i}>
          <TableCell>{`${firstName} ${lastName}`}</TableCell>
          <TableCell>{rm.user.email}</TableCell>
          <TableCell>
            <Stack direction="row" spacing={1} justifyContent="end">
              {editLink}{removeLink}
            </Stack>
          </TableCell>
        </TableRow>
      );
    }
    return rows;
  }

  const getTableHeader = () => {
    if (isRoleEveryone) return null;

    return (<TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell></TableCell></TableRow>);
  }

  return (
    <DisplayBox id="roleMembersBox" headerText="Members" headerIcon="person" editContent={getEditContent()} help="chums/assigning-roles">
      <Table id="roleMemberTable">
        <TableHead>{getTableHeader()}</TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>
    </DisplayBox>
  );

}

