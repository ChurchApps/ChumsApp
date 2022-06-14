import React, { useEffect } from "react";
import { ApiHelper, UserHelper } from ".";
import { List } from "@mui/material";
import { Permissions } from "./"
import { SiteWrapper, NavItem } from "../appBase/components";
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

  const tabs = []
  const donationIcon = donationError ? "error" : "volunteer_activism";
  tabs.push(<NavItem url="/people" label="People" icon="person" />);
  tabs.push(<NavItem url="/groups" label="Groups" icon="people" />);
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) tabs.push(<NavItem url="/attendance" label="Attendance" icon="calendar_month" />);
  if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) tabs.push(<NavItem url="/donations" label="Donations" icon={donationIcon} />);
  if (formPermission || isFormMember) tabs.push(<NavItem url="/forms" label="Form" icon="list_alt" />);
  if (UserHelper.checkAccess(Permissions.accessApi.roles.view)) tabs.push(<NavItem url="/settings" label="Settings" icon="settings" />);
  const navContent = <><List component="nav">{tabs}</List></>

  return <SiteWrapper navContent={navContent} context={context}>{props.children}</SiteWrapper>
};
