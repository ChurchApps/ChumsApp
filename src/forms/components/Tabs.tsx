import React from "react";
import { UserHelper, Permissions, FormMembers, Form, MemberPermissionInterface, FormSubmissions, FormInterface } from ".";

interface Props { form: FormInterface, memberPermission: MemberPermissionInterface }

export const Tabs: React.FC<Props> = (props) => {
  const [selectedTab, setSelectedTab] = React.useState("");

  const getTab = (keyName: string, icon: string, text: string) => {
    let className = (keyName === selectedTab) ? "nav-link active" : "nav-link";
    return <li className="nav-item" key={keyName}><a href="about:blank" aria-label={`${keyName}-tab`} onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
  }

  let tabs: any = [];
  let defaultTab = "";
  let currentTab = null;

  const formType = props.form.contentType;
  const formMemberAction = props.memberPermission.action;
  const formAdmin = UserHelper.checkAccess(Permissions.membershipApi.forms.admin);
  const formEdit = UserHelper.checkAccess(Permissions.membershipApi.forms.edit) && formType !== undefined && formType !== "form";
  const formMemberAdmin = formMemberAction === "admin" && formType !== undefined && formType === "form";
  const formMemberView = formMemberAction === "view" && formType !== undefined && formType === "form";

  if (formAdmin || formEdit || formMemberAdmin) { tabs.push(getTab("questions", "far fa-sticky-note", "Questions")); defaultTab = "questions"; }
  if ((formAdmin || formMemberAdmin) && formType === "form") { tabs.push(getTab("members", "far fa-calendar-alt", "Form Members")); }
  if ((formAdmin || formMemberAdmin || formMemberView) && formType === "form") { tabs.push(getTab("submissions", "far fa-calendar-alt", "Form Submissions")); if (defaultTab !== "questions") defaultTab = "submissions" }
  if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

  switch (selectedTab) {
    case "questions": currentTab = <Form id={props.form.id} />; break;
    case "members": currentTab = <FormMembers formId={props.form.id} />; break;
    case "submissions": currentTab = <FormSubmissions formId={props.form.id} memberPermissions={props.memberPermission} />; break;
    default: currentTab = <div>Unauthorized</div>; break;
  }

  return (
    <>
      <h1><i className="fas fa-list"></i> {props.form.name}</h1>
      <ul className="nav nav-tabs">{tabs}</ul>{currentTab}
    </>
  );
}
