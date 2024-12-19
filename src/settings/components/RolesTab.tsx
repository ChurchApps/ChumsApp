import React, { useState } from "react";
import { ChurchSettings, Roles, RoleEdit } from "./"
import { ChurchInterface, ApiHelper, UserHelper, Permissions, DisplayBox, Locale } from "@churchapps/apphelper"
import { Navigate } from "react-router-dom";
import { Grid, Icon } from "@mui/material";
import { Banner } from "../../baseComponents/Banner";


interface Props {
  church: ChurchInterface;
}

export const RolesTab = (props:Props) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("notset");

  const getSidebar = () => {
    let modules: JSX.Element[] = [];
    if (selectedRoleId !== "notset") modules.push(<RoleEdit key="roleEdit" roleId={selectedRoleId} updatedFunction={() => { setSelectedRoleId("notset") }} />);
    return modules;
  }

  return (
    <>
      {getSidebar()}
      {props.church && <Roles selectRoleId={setSelectedRoleId} selectedRoleId={selectedRoleId} church={props.church} />}
    </>
  );
}

