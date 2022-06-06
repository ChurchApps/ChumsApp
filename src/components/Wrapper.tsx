import React, { useEffect } from "react";
import { ApiHelper, UserHelper } from ".";
import { Box, Container, Divider, List, ListSubheader } from "@mui/material";
import { Permissions } from "./"
import { SiteWrapper, NavItem } from "../appBase/components";
import { UserMenu } from "./UserMenu";

interface Props {
  pageTitle: string,
  children: React.ReactNode,
}

export const Wrapper: React.FC<Props> = props => {

  const [donationError, setDonationError] = React.useState<boolean>(false);
  const [isFormMember, setIsFormMember] = React.useState<boolean>(false);
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);

  useEffect(() => {
    if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) {
      ApiHelper.get("/eventLog/type/failed/", "GivingApi").then(data => {
        if (data?.length > 0 && data.find((error: any) => !error.resolved)) setDonationError(true);
      });
    }
    if (!formPermission && UserHelper?.person?.id) {
      ApiHelper.get("/memberpermissions/member/" + UserHelper.person.id, "MembershipApi").then(data => setIsFormMember(data.length));
    }
  }, [formPermission]);

  const churchId = UserHelper.currentChurch.id
  const tabs = []
  tabs.push(<ListSubheader component="div">{UserHelper.currentChurch?.name || "Church"}</ListSubheader>);


  const donationIcon = donationError ? "error" : "volunteer_activism";

  tabs.push(<NavItem url="/people" label="People" icon="person" />);
  tabs.push(<NavItem url="/groups" label="Groups" icon="people" />);
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) tabs.push(<NavItem url="/attendance" label="Attendance" icon="calendar_month" />);
  if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) tabs.push(<NavItem url="/donations" label="Donations" icon={donationIcon} />);

  if (formPermission || isFormMember) tabs.push(<NavItem url="/forms" label="Form" icon="list_alt" />);

  if (UserHelper.checkAccess(Permissions.accessApi.roles.view)) tabs.push(<NavItem url="/settings" label="Settings" icon="settings" />);
  tabs.push(<Divider />);
  tabs.push(<NavItem url="/profile" label="Profile" icon="person" />);
  tabs.push(<NavItem url="/logout" label="Logout" icon="logout" />);





  const navContent = <List component="nav">{tabs}</List>
  const userMenu = <UserMenu />

  return <>
    <SiteWrapper logoUrl="/images/logo.png" navContent={navContent} pageTitle={props.pageTitle} userMenu={userMenu}>

    </SiteWrapper>
    <Box component="main" sx={{ flexGrow: 1, overflow: "auto", marginTop: 8, minHeight: "90vh" }}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        {props.children}
      </Container>
    </Box>
  </>

};
