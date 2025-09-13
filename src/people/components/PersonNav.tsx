import React from "react";
import { Icon } from "@mui/material";
import { type PersonInterface } from "@churchapps/helpers";
import { Permissions, UserHelper, Locale } from "@churchapps/apphelper";
interface Props {
  person: PersonInterface;
}

export const PersonNav: React.FC<Props> = (props) => {
  const [person, setPerson] = React.useState<PersonInterface>(props.person);
  const [selectedTab, setSelectedTab] = React.useState("details");

  React.useEffect(() => setPerson(props.person), [props.person]);
  const tabs: { key: string; icon: string; label: string }[] = [];

  if (person === undefined || person === null) return null;

  let defaultTab = "details";
  tabs.push({ key: "details", icon: "person", label: Locale.label("person.person") });

  if (UserHelper.checkAccess(Permissions.membershipApi.people.edit)) {
    tabs.push({ key: "notes", icon: "notes", label: Locale.label("common.notes") });
    if (defaultTab === "") defaultTab = "notes";
  }
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) {
    tabs.push({ key: "attendance", icon: "calendar_month", label: Locale.label("people.tabs.att") });
    if (defaultTab === "") defaultTab = "attendance";
  }
  if (UserHelper.checkAccess(Permissions.givingApi.donations.view)) {
    tabs.push({ key: "donations", icon: "volunteer_activism", label: Locale.label("people.tabs.don") });
    if (defaultTab === "") defaultTab = "donations";
  }
  // Default tab is initialized via useState; avoid setting state during render.
  const getItem = (tab: any) => {
    if (tab.key === selectedTab) {
      return (
        <li className="active">
          <a
            href="about:blank"
            onClick={(e) => {
              e.preventDefault();
              setSelectedTab(tab.key);
            }}>
            <Icon>{tab.icon}</Icon> {tab.label}
          </a>
        </li>
      );
    }
    return (
      <li>
        <a
          href="about:blank"
          onClick={(e) => {
            e.preventDefault();
            setSelectedTab(tab.key);
          }}>
          <Icon>{tab.icon}</Icon> {tab.label}
        </a>
      </li>
    );
  };

  return (
    <div className="sideNav" style={{ height: "100vh", borderRight: "1px solid #CCC" }}>
      <ul>
        {tabs.map((tab) => getItem(tab))}
        <li>
          <a href="about:blank">
            <Icon>people</Icon> Groups
          </a>
        </li>
      </ul>

      <div className="subhead">Custom Forms</div>
      <ul>
        <li>
          <a href="about:blank">Discipleship</a>
        </li>
      </ul>
    </div>
  );
};
