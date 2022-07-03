import React from "react";
import { Tabs, ApiHelper, FormInterface, MemberPermissionInterface } from "./components";
import { useParams } from "react-router-dom"
import { Icon } from "@mui/material";
import UserContext from "../UserContext";

export const FormPage = () => {
  const params = useParams();
  const [form, setForm] = React.useState<FormInterface>({} as FormInterface);
  const [memberPermission, setMemberPermission] = React.useState<MemberPermissionInterface>({} as MemberPermissionInterface);
  const context = React.useContext(UserContext);
  const loadData = () => {
    ApiHelper.get("/forms/" + params.id, "MembershipApi").then(data => {
      setForm(data);
      if (data.contentType === "form") ApiHelper.get("/memberpermissions?memberId=" + context.person?.id + "&formId=" + params.id, "MembershipApi").then(results => setMemberPermission(results));
    });
  }

  React.useEffect(loadData, []); //eslint-disable-line

  return form?.id
    ? <>
      <h1><Icon>description</Icon> {form.name}</h1>
      <Tabs form={form} memberPermission={memberPermission} />
    </>
    : <></>;
}
