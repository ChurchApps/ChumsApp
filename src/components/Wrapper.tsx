import React, { useEffect } from "react";
import { ApiHelper, UserHelper } from ".";
import { autocompleteClasses, Box, Button, Container, Divider, Icon, List, ListSubheader, MenuItem, Select, Stack } from "@mui/material";
import { Permissions } from "./"
import { SiteWrapper, NavItem, ChurchDropdown } from "../appBase/components";
import { UserMenu } from "./UserMenu";
import { AppearanceHelper } from "../appBase/helpers";
import { tab } from "@testing-library/user-event/dist/tab";

interface Props {
  pageTitle: string,
  children: React.ReactNode,
}

export const Wrapper: React.FC<Props> = props => {

  const [donationError, setDonationError] = React.useState<boolean>(false);
  const [isFormMember, setIsFormMember] = React.useState<boolean>(false);
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);
  const [churchLogo, setChurchLogo] = React.useState<string>();

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
  //tabs.push(<ListSubheader component="div">{UserHelper.currentChurch?.name || "Church"}</ListSubheader>);
  if (UserHelper.currentChurch) tabs.push(<ChurchDropdown currentChurch={UserHelper.currentChurch} churches={UserHelper.churches} />)


  const donationIcon = donationError ? "error" : "volunteer_activism";

  tabs.push(<NavItem url="/people" label="People" icon="person" />);
  tabs.push(<NavItem url="/groups" label="Groups" icon="people" />);
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) tabs.push(<NavItem url="/attendance" label="Attendance" icon="calendar_month" />);
  if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) tabs.push(<NavItem url="/donations" label="Donations" icon={donationIcon} />);

  if (formPermission || isFormMember) tabs.push(<NavItem url="/forms" label="Form" icon="list_alt" />);

  if (UserHelper.checkAccess(Permissions.accessApi.roles.view)) tabs.push(<NavItem url="/settings" label="Settings" icon="settings" />);



  const getChurchLogo = async () => {
    const logos = await AppearanceHelper.load(UserHelper.currentChurch.id);
    setChurchLogo(logos.logoLight || "/images/logo.png");
  }

  React.useEffect(() => {
    getChurchLogo();
  });



  const navContent = <>
    <List component="nav">{tabs}</List>
    <div style={{ position: "fixed", bottom: 0, textAlign: "center", paddingBottom: 10, marginLeft: 15 }}>
      <Button endIcon={<Icon>expand_less</Icon>}>
        <img src="/images/logo.png" className="img-fluid" style={{ width: 170 }} />
      </Button>


    </div>
  </>
  const userMenu = <UserMenu />

  return <>
    <SiteWrapper logoUrl={churchLogo || "/images/logo.png"} navContent={navContent} pageTitle={props.pageTitle} userMenu={userMenu}>

    </SiteWrapper>
    <Box component="main" sx={{ flexGrow: 1, overflow: "auto", marginTop: 8, minHeight: "90vh" }}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        {props.children}
      </Container>
    </Box>



  </>

};
