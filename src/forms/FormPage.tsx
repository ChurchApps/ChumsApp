import React from "react";
import { UserHelper, Permissions, Tabs, ApiHelper, FormInterface } from "./components";
import { RouteComponentProps } from "react-router-dom"

type TParams = { id?: string };
export const FormPage = ({ match }: RouteComponentProps<TParams>) => {
  const [form, setForm] = React.useState<FormInterface>({} as FormInterface);
  const loadData = () => { ApiHelper.get("/forms/" + match.params.id, "MembershipApi").then(data => setForm(data)); }

  React.useEffect(loadData, []);

  if (!UserHelper.checkAccess(Permissions.membershipApi.forms.edit)) return (<></>);
  else return (
    <>
      <h1><i className="fas fa-list"></i> {form.name}</h1>
      <Tabs formId={match.params.id} />
    </>
  );
}
