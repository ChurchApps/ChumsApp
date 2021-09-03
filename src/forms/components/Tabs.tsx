import React from "react";
import { UserHelper, Permissions, FormMembers, Form } from ".";

interface Props { formId: string }

export const Tabs: React.FC<Props> = (props) => {
//   const [personId, setPersonId] = React.useState(props.person?.id);
  const [selectedTab, setSelectedTab] = React.useState("");

  const getTab = (keyName: string, icon: string, text: string) => {
    let className = (keyName === selectedTab) ? "nav-link active" : "nav-link";
    return <li className="nav-item" key={keyName}><a href="about:blank" aria-label={`${keyName}-tab`} onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
  }

  //   React.useEffect(() => setPersonId(props.person?.id), [props.person]);

  //   if (props.person === undefined || props.person === null) return null;
  let tabs = [];
  let defaultTab = "questions"
  let currentTab = null;
  const formViewAccess = UserHelper.checkAccess(Permissions.membershipApi.forms.view);
  // const formResultsAccess = UserHelper.checkAccess(Permissions.membershipApi.forms.view);
  if (formViewAccess) { tabs.push(getTab("questions", "far fa-sticky-note", "Questions")); }
  if (formViewAccess) { tabs.push(getTab("members", "far fa-calendar-alt", "Form Members")); }
  if (formViewAccess) { tabs.push(getTab("members", "far fa-calendar-alt", "Form Members")); }
  if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

  switch (selectedTab) {
    case "questions": currentTab = <Form id={props.formId} />; break;
    case "members": currentTab = <FormMembers formId={props.formId} />; break;
    default: currentTab = <div>Not implemented</div>; break;
  }

  return (<><ul className="nav nav-tabs">{tabs}</ul>{currentTab}</>);
}
