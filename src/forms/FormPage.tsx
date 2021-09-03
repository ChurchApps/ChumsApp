import React from "react";
import { UserHelper, Permissions, Tabs, ApiHelper, FormInterface } from "./components";
import { RouteComponentProps, useParams } from "react-router-dom"
import { PersonHelper } from "../appBase/helpers";

type TParams = { id?: string };
export const FormPage = ({ match }: RouteComponentProps<TParams>) => {
  const [form, setForm] = React.useState<FormInterface>({} as FormInterface);
  const loadData = () => {
    ApiHelper.get("/forms/" + match.params.id, "MembershipApi").then(data => setForm(data));
    ApiHelper.get("/memberpermissions/form/" + match.params.id, "MembershipApi").then(results => {
      console.log(results, UserHelper.user);
    });
  }

  React.useEffect(loadData, []);

  if (!UserHelper.checkAccess(Permissions.membershipApi.forms.edit)) return (<></>);
  else return (
    <>
      <h1><i className="fas fa-list"></i> {form.name}</h1>
      <Tabs formId={match.params.id} />
    </>
  );
}
