import React, { useEffect } from "react";
import { UserHelper, Permissions, ApiHelper } from "./";
import { NavLink } from "react-router-dom";
import { EnvironmentHelper } from "../helpers";

interface Props {
  prefix?: String;
}

interface Tab {
  key: string;
  url: string;
  icon: string;
  label: string;
  outsideLink?: boolean;
}

export function NavItems({ prefix }: Props) {
  const [donationError, setDonationError] = React.useState<boolean>(false);
  const [isFormMember, setIsFormMember] = React.useState<boolean>(false);

  const getTab = ({ key, url, icon, label, outsideLink = false }: Tab) => (
    <li key={key} className="nav-item" data-toggle={prefix === "main" ? null : "collapse"} data-target={prefix === "main" ? null : "#userMenu"} id={(prefix || "") + key + "Tab"}>
      {outsideLink ? (
        <a className={prefix === "main" ? "nav-link" : ""} href={url} target="_blank" rel="noopener noreferrer">
          <i className={icon}></i> {label}
        </a>
      ) : (
        <NavLink className={prefix === "main" ? "nav-link" : ""} to={url}>
          <i className={icon}></i> {label}
        </NavLink>
      )}
    </li>
  );

  useEffect(() => {
    if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) {
      ApiHelper.get("/eventLog/type/failed/", "GivingApi").then(data => {
        if (data?.length > 0 && data.find((error: any) => !error.resolved)) setDonationError(true);
      });
    }
    if (!UserHelper.checkAccess(Permissions.membershipApi.forms.access)) {
      ApiHelper.get("/memberpermissions/member/" + UserHelper.person.id, "MembershipApi").then(data => setIsFormMember(data.length));
    }
  }, []);

  const tabs = []
  const donationIcon = donationError ? "fas fa-exclamation-circle danger-text" : "fas fa-hand-holding-usd";
  const profileLink = UserHelper.createAppUrl(EnvironmentHelper.AccountsAppUrl, "/profile");

  tabs.push(getTab({ key: "People", url: "/people", icon: "fas fa-user", label: "People" }));
  tabs.push(getTab({ key: "Groups", url: "/groups", icon: "fas fa-list-ul", label: "Groups" }));
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) tabs.push(getTab({ key: "Attendance", url: "/attendance", icon: "far fa-calendar-alt", label: "Attendance" }));
  if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) tabs.push(getTab({ key: "Donations", url: "/donations", icon: donationIcon, label: "Donations" }));
  if (UserHelper.checkAccess(Permissions.membershipApi.forms.access) || isFormMember) tabs.push(getTab({ key: "Forms", url: "/forms", icon: "fas fa-align-left", label: "Forms" }));
  if (UserHelper.checkAccess(Permissions.accessApi.roles.view)) tabs.push(getTab({ key: "Settings", url: "/settings", icon: "fas fa-cog", label: "Settings" }));
  tabs.push(getTab({ key: "Profile", url: profileLink, icon: "fas fa-user", label: "Profile", outsideLink: true }));

  return <>{tabs}</>;
};
