import React, { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { DisplayBox, UserHelper, ApiHelper, Permissions, ChurchInterface } from "."
import { RoleInterface } from "../../helpers"
import UserContext from "../../UserContext"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { SmallButton } from "../../appBase/components"

interface Props {
  selectRoleId: (id: string) => void;
  selectedRoleId: string;
  church: ChurchInterface;
}

export const Roles: React.FC<Props> = ({ selectRoleId, selectedRoleId, church }) => {
  const [roles, setRoles] = useState<RoleInterface[]>([]);
  const params = useParams();
  const context = useContext(UserContext);

  const loadData = () => {
    if (selectedRoleId !== "notset") return;
    const churchId = params.id;
    if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId);
    ApiHelper.get(`/roles/church/${churchId}`, "MembershipApi").then(roles => setRoles(roles));
  }

  const getEditContent = () => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.roles.edit)) return null;
    else return (<SmallButton icon="add" text="Add" onClick={() => { selectRoleId(""); }} />);
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    const sortedRoles = [...roles].sort((a, b) => a.name > b.name ? 1 : -1);
    const churchId = params.id;
    const canEdit = (
      UserHelper.checkAccess(Permissions.membershipApi.roles.edit)
      && UserHelper.checkAccess(Permissions.membershipApi.users.edit)
      && UserHelper.checkAccess(Permissions.membershipApi.people.view)
    );

    if (UserHelper.checkAccess(Permissions.membershipApi.rolePermissions.edit)) {
      result.push(
        <TableRow key="everyone">
          <TableCell><i className="groups" /> <Link to={`/${churchId}/role/everyone`}>(Everyone)</Link></TableCell>
          <TableCell></TableCell>
        </TableRow>
      );
    }

    sortedRoles.forEach(role => {
      const editLink = (canEdit) ? <SmallButton icon="edit" toolTip="Edit" onClick={() => { selectRoleId(role.id) }} /> : null;
      result.push(<TableRow key={role.id}>
        <TableCell><i className="lock" /> <Link to={`/${churchId}/role/${role.id}`}>{role.name}</Link></TableCell>
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
