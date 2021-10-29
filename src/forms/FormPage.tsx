import React from "react";
import { Tabs, ApiHelper, FormInterface, MemberPermissionInterface, UserHelper } from "./components";
import { RouteComponentProps } from "react-router-dom"

type TParams = { id?: string };
export const FormPage = ({ match }: RouteComponentProps<TParams>) => {
  const [form, setForm] = React.useState<FormInterface>({} as FormInterface);
  const [memberPermission, setMemberPermission] = React.useState<MemberPermissionInterface>({} as MemberPermissionInterface);
  const loadData = () => {
    ApiHelper.get("/forms/" + match.params.id, "MembershipApi").then(data => {
      setForm(data);
      if (data.contentType === "form") ApiHelper.get("/memberpermissions?memberId=" + UserHelper.person.id + "&formId=" + match.params.id, "MembershipApi").then(results => setMemberPermission(results));
    });
  }

  React.useEffect(loadData, []);

  return form?.id ? <Tabs form={form} memberPermission={memberPermission} /> : <></>;
}
