import React, { useEffect } from "react";
import { List } from "@mui/material";
import { SiteWrapper, NavItem, ApiHelper, UserHelper, Permissions, Themes } from "@churchapps/apphelper";
import UserContext from "../UserContext";


interface Props { pageTitle?: string, children: React.ReactNode }

export const Wrapper: React.FC<Props> = props => {
  const [donationError, setDonationError] = React.useState<boolean>(false);
  const [isFormMember, setIsFormMember] = React.useState<boolean>(false);
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);
  const context = React.useContext(UserContext);

  useEffect(() => {
    if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) {
      ApiHelper.get("/eventLog/type/failed/", "GivingApi").then(data => {
        if (data?.length > 0 && data.find((error: any) => !error.resolved)) setDonationError(true);
      });
    }
    if (!formPermission && context?.person?.id) {
      ApiHelper.get("/memberpermissions/member/" + context.person?.id, "MembershipApi").then(data => setIsFormMember(data.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formPermission]);

  const getSelectedTab = () => {
    const path = window.location.pathname;
    let result = "dashboard";
    if (path.startsWith("/people")) result = "people";
    else if (path.startsWith("/attendance")) result = "attendance";
    else if (path.startsWith("/donations")) result = "donations";
    else if (path.startsWith("/forms")) result = "forms";
    else if (path.startsWith("/plans") || window.location.search.indexOf("tag=team")>-1) result = "plans";
    else if (path.startsWith("/groups")) result = "groups";
    else if (path.startsWith("/settings")) result = "settings";
    else if (path.startsWith("/tasks")) result = "tasks";
    else if (path.startsWith("/admin")) result = "admin";
    return result;
  }

  const selectedTab = getSelectedTab();
  const tabs = []
  const donationIcon = donationError ? "error" : "volunteer_activism";

  tabs.push(<NavItem url="/" key="/" label="Dashboard" icon="home" selected={selectedTab === "dashboard"} />);
  tabs.push(<NavItem url="/people" key="/people" label="People" icon="person" selected={selectedTab === "people"} />);
  tabs.push(<NavItem url="/groups" key="/groups" label="Groups" icon="people" selected={selectedTab === "groups"} />);
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) tabs.push(<NavItem url="/attendance" key="/attendance" label="Attendance" icon="calendar_month" selected={selectedTab === "attendance"} />);
  if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) tabs.push(<NavItem url="/donations" key="/donations" label="Donations" icon={donationIcon} selected={selectedTab === "donations"} />);
  if (formPermission || isFormMember) tabs.push(<NavItem url="/forms" label="Form" icon="description" key="/forms" selected={selectedTab === "forms"} />);

  tabs.push(<NavItem url="/tasks" key="/tasks" label="Tasks" icon="list_alt" selected={selectedTab === "tasks"} />);
  tabs.push(<NavItem url="/plans" key="/plans" label="Plans" icon="assignment" selected={selectedTab === "plans"} />);
  if (UserHelper.checkAccess(Permissions.membershipApi.roles.view)) tabs.push(<NavItem url="/settings" key="/settings" label="Settings" icon="settings" selected={selectedTab === "settings"} />);
  if (UserHelper.checkAccess(Permissions.membershipApi.server.admin)) tabs.push(<NavItem key="/admin" url="/admin" label="Server Admin" icon="admin_panel_settings" selected={selectedTab === "admin"} />);

  const navContent = <><List component="nav" sx={Themes.NavBarStyle}>{tabs}</List></>

  return <SiteWrapper navContent={navContent} context={context} appName="CHUMS" appearance={{}}>{props.children}</SiteWrapper>
};
