import React, { useEffect } from "react";
import { ApiHelper, UserHelper } from ".";
import { List } from "@mui/material";
import { Permissions } from "./"
import { SiteWrapper, NavItem } from "../appBase/components";
import UserContext from "../UserContext";
import { Themes } from "../appBase/helpers";

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
    let result = "";
    if (path.startsWith("/people")) result = "people";
    else if (path.startsWith("/groups")) result = "groups";
    else if (path.startsWith("/attendance")) result = "attendance";
    else if (path.startsWith("/donations")) result = "donations";
    else if (path.startsWith("/forms")) result = "forms";
    else if (path.startsWith("/settings")) result = "settings";
    return result;
  }

  const selectedTab = getSelectedTab();
  const tabs = []
  const donationIcon = donationError ? "error" : "volunteer_activism";
  tabs.push(<NavItem url="/people" label="People" icon="person" selected={selectedTab === "people"} />);
  tabs.push(<NavItem url="/groups" label="Groups" icon="people" selected={selectedTab === "groups"} />);
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) tabs.push(<NavItem url="/attendance" label="Attendance" icon="calendar_month" selected={selectedTab === "attendance"} />);
  if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) tabs.push(<NavItem url="/donations" label="Donations" icon={donationIcon} selected={selectedTab === "donations"} />);
  if (formPermission || isFormMember) tabs.push(<NavItem url="/forms" label="Form" icon="list_alt" selected={selectedTab === "forms"} />);
  if (UserHelper.checkAccess(Permissions.accessApi.roles.view)) tabs.push(<NavItem url="/settings" label="Settings" icon="settings" selected={selectedTab === "settings"} />);

  const navContent = <><List component="nav" sx={Themes.NavBarStyle}>{tabs}</List></>

  return <SiteWrapper navContent={navContent} context={context} appName="Chums">{props.children}</SiteWrapper>
};
