import React from "react";
import { UserHelper, Notes, PersonAttendance, PersonDonations, Permissions } from ".";

interface Props { personId: string }

export const Tabs: React.FC<Props> = (props) => {
  const [personId, setPersonId] = React.useState(props.personId);
  const [selectedTab, setSelectedTab] = React.useState("");

  const getTab = (keyName: string, icon: string, text: string) => {
    let className = (keyName === selectedTab) ? "nav-link active" : "nav-link";
    return <li className="nav-item" key={keyName}><a href="about:blank" onClick={e => { e.preventDefault(); setSelectedTab(keyName) }} className={className}><i className={icon}></i> {text}</a></li>
  }

  React.useEffect(() => setPersonId(props.personId), [props.personId]);

  if (props.personId === undefined || props.personId === null) return null;
  let tabs = [];
  let defaultTab = ""
  let currentTab = null;
  if (UserHelper.checkAccess(Permissions.membershipApi.notes.view)) { tabs.push(getTab("notes", "far fa-sticky-note", "Notes")); defaultTab = "notes"; }
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push(getTab("attendance", "far fa-calendar-alt", "Attendance")); if (defaultTab === "") defaultTab = "attendance"; }
  if (UserHelper.checkAccess(Permissions.givingApi.donations.view)) { tabs.push(getTab("donations", "fas fa-hand-holding-usd", "Donations")); if (defaultTab === "") defaultTab = "donations"; }
  if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

  switch (selectedTab) {
  case "notes": currentTab = <Notes contentType="person" contentId={personId} />; break;
  case "attendance": currentTab = <PersonAttendance personId={personId} />; break;
  case "donations": currentTab = <PersonDonations personId={personId} />; break;
  default: currentTab = <div>Not implemented</div>; break;
  }

  return (<><ul className="nav nav-tabs">{tabs}</ul>{currentTab}</>);
}
