import React, { useState } from "react";
import { UserAdd, RolePermissions, RoleMembers } from "./components";
import { ApiHelper, type RoleInterface, UserHelper, Permissions, type RoleMemberInterface, DisplayBox, Locale } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { Banner } from "@churchapps/apphelper";

export const RolePage = () => {
  const params = useParams();
  const [role, setRole] = React.useState<RoleInterface>({} as RoleInterface);
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const [selectedRoleMemberId, setSelectedRoleMemberId] = React.useState<string>("");
  const [roleMembers, setRoleMembers] = useState<RoleMemberInterface[]>([]);
  const handleShowAdd = () => {
    setShowAdd(true);
  };
  const handleAdd = () => {
    setShowAdd(false);
    setSelectedRoleMemberId("");
    loadData();
    loadRoleMembers();
  };

  const loadData = () => {
    if (params.roleId === "everyone") {
      setRole({ id: null, name: "Everyone" });
      return;
    }
    ApiHelper.get("/roles/" + params.roleId, "MembershipApi").then((data) => setRole(data));
  };
  const loadRoleMembers = () => {
    ApiHelper.get("/rolemembers/roles/" + params.roleId + "?include=users", "MembershipApi").then((data: any) => {
      setRoleMembers(data);
    });
  };

  const getAddUser = () => {
    if (showAdd || selectedRoleMemberId) return <UserAdd role={role} roleMembers={roleMembers} selectedUser={selectedRoleMemberId} updatedFunction={handleAdd} />;
    return null;
  };

  const getSidebar = () => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.roles.edit)) return null;
    else {
      if (role.name === "Domain Admins") {
        return (
          <>
            {getAddUser()}
            <DisplayBox id="rolePermissionsBox" headerText={Locale.label("settings.rolePage.permEdit")} headerIcon="lock">
              <p>{Locale.label("settings.rolePage.noEditMsg")}</p>
            </DisplayBox>
          </>
        );
      } else {
        return (
          <>
            {getAddUser()}
            <RolePermissions role={role} />
          </>
        );
      }
    }
  };

  React.useEffect(loadData, [params.roleId]);
  React.useEffect(loadRoleMembers, [params.roleId]);

  if (!UserHelper.checkAccess(Permissions.membershipApi.roles.view)) return <></>;
  else {
    return (
      <>
        <Banner>
          <h1>
            {Locale.label("settings.rolePage.roleEdit")} {role?.name}
          </h1>
        </Banner>
        <div id="mainContent">
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <RoleMembers role={role} roleMembers={roleMembers} addFunction={handleShowAdd} setSelectedRoleMember={setSelectedRoleMemberId} updatedFunction={handleAdd} />
            </Grid>
            <Grid xs={12} md={4}>
              {getSidebar()}
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
};
