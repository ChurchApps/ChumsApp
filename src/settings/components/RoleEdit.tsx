import { TextField } from "@mui/material";
import React, { useState } from "react";
import { ApiHelper, InputBox, RoleInterface, UniqueIdHelper, ErrorMessages, Locale } from "@churchapps/apphelper";

interface Props {
  roleId: string,
  updatedFunction: () => void
}

export const RoleEdit: React.FC<Props> = (props) => {
  const [role, setRole] = useState<RoleInterface>({} as RoleInterface);
  const [errors, setErrors] = useState<string[]>([]);

  const loadData = () => {
    if (!UniqueIdHelper.isMissing(props.roleId)) ApiHelper.get("/roles/" + props.roleId, "MembershipApi").then((data: RoleInterface) => setRole(data));
    else setRole({} as RoleInterface);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const r = { ...role };
    r.name = e.currentTarget.value;

    setRole(r);
    setErrors([]);
  }

  const handleSave = () => {
    if (!role.name?.trim()) {
      setErrors([Locale.label("settings.roleEdit.valMsg")])
      return;
    }

    const r = {
      ...role,
      name: role.name.trim()
    };
    ApiHelper.post("/roles", [r], "MembershipApi").then(() => props.updatedFunction());
  }
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleCancel = () => props.updatedFunction();
  const handleDelete = () => {
    if (window.confirm(Locale.label("settings.roleEdit.confirmMsg"))) {
      ApiHelper.delete("/roles/" + role.id, "MembershipApi").then(() => props.updatedFunction());
    }
  }

  React.useEffect(loadData, [props.roleId]);

  return (
    <InputBox id="roleBox" headerIcon="lock" headerText={Locale.label("settings.roleEdit.roleEdit")} saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={(!UniqueIdHelper.isMissing(props.roleId)) ? handleDelete : undefined}>
      <ErrorMessages errors={errors} />
      <TextField fullWidth name="roleName" label={Locale.label("settings.roleEdit.roleName")} value={role?.name || ""} onChange={handleChange} onKeyDown={handleKeyDown} data-testid="role-name-input" aria-label="Role name" />
    </InputBox>
  );
}
