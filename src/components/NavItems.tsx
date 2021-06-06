import React from "react";
import { UserHelper, Permissions } from "./";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface Props {
  prefix?: String;
}

export const NavItems: React.FC<Props> = (props) => {
  const location = useLocation();
  const getSelected = (): string => {
    let url = location.pathname;
    let result = "People";
    if (url.indexOf("/groups") > -1) result = "Groups";
    if (url.indexOf("/attendance") > -1) result = "Attendance";
    if (url.indexOf("/donations") > -1) result = "Donations";
    if (url.indexOf("/forms") > -1) result = "Forms";
    if (url.indexOf("/settings") > -1) result = "Settings";

    return result;
  };

  const getClass = (sectionName: string): string => {
    if (sectionName === getSelected()) return "nav-link active";
    else return "nav-link";
  };

  const getTab = (key: string, url: string, icon: string, label: string) => (
    <li key={key} className="nav-item" data-toggle={props.prefix === "main" ? null : "collapse"} data-target={props.prefix === "main" ? null : "#userMenu"} id={(props.prefix || "") + key + "Tab"}>
      <Link className={getClass(key)} to={url}>
        <i className={icon}></i> {label}
      </Link>
    </li>
  );

  const getTabs = () => {
    let tabs = [];
    tabs.push(getTab("People", "/people", "fas fa-user", "People"));
    tabs.push(getTab("Groups", "/groups", "fas fa-list-ul", "Groups"));
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) tabs.push(getTab("Attendance", "/attendance", "far fa-calendar-alt", "Attendance"));
    if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) tabs.push(getTab("Donations", "/donations", "fas fa-hand-holding-usd", "Donations"));
    if (UserHelper.checkAccess(Permissions.membershipApi.forms.view)) tabs.push(getTab("Forms", "/forms", "fas fa-align-left", "Forms"));
    if (UserHelper.checkAccess(Permissions.accessApi.roles.view)) tabs.push(getTab("Settings", "/settings", "fas fa-cog", "Settings"));
    tabs.push(getTab("Profile", "/profile", "fas fa-user", "Profile"));
    return tabs;
  };

  return <>{getTabs()}</>;
};
