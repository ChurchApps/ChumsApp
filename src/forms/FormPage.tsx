import React from "react";
import { Tabs } from "./components";
import { ApiHelper, type FormInterface, type MemberPermissionInterface } from "@churchapps/apphelper";
import { useParams } from "react-router-dom"
import UserContext from "../UserContext";
import { Banner } from "@churchapps/apphelper";

export const FormPage = () => {
  const params = useParams();
  const [form, setForm] = React.useState<FormInterface>({} as FormInterface);
  const [memberPermission, setMemberPermission] = React.useState<MemberPermissionInterface>({} as MemberPermissionInterface);
  const context = React.useContext(UserContext);
  const loadData = () => {
    ApiHelper.get("/forms/" + params.id, "MembershipApi").then(data => {
      setForm(data);
      if (data.contentType === "form") ApiHelper.get("/memberpermissions/form/" + params.id + "/my", "MembershipApi").then(results => setMemberPermission(results));
    });
  }

  React.useEffect(loadData, [params.id]);

  return form?.id
    ? <>
      <Banner><h1>{form.name}</h1></Banner>
      <div id="mainContent">
        <Tabs form={form} memberPermission={memberPermission} />
      </div>
    </>
    : <></>;
}
