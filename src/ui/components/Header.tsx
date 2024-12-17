import React, { useEffect } from "react";
import { AppBar, Link, styled, Toolbar, Typography } from "@mui/material";
import { Locale, NavItem, UserHelper, Permissions, ApiHelper, UserMenu, PersonHelper } from "@churchapps/apphelper";
import { PrimaryMenu } from "../../baseComponents/PrimaryMenu";
import { SecondaryMenu } from "../../baseComponents/SecondaryMenu";
import { SecondaryMenuAlt } from "../../baseComponents/SecondaryMenuAlt";
import UserContext from "../../UserContext";

export const Header: React.FC = () => {
  const context = React.useContext(UserContext);
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);
  const [donationError, setDonationError] = React.useState<boolean>(false);
  const [isFormMember, setIsFormMember] = React.useState<boolean>(false);

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

  const CustomAppBar = styled(AppBar)(
    ({ theme }) => ({
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      "& .MuiIcon-root": { color: "#FFFFFF" }
    })
  );

  const getPrimaryMenu = () => {
    const donationIcon = donationError ? "error" : "volunteer_activism";
    const menuItems:{ url: string, icon:string, label: string }[] = []
    menuItems.push({url: "/", icon:"home", label: Locale.label("components.wrapper.dash")});
    menuItems.push({url: "/people", icon:"person", label: Locale.label("components.wrapper.ppl")});
    if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) menuItems.push({ url:"/donations", label: Locale.label("components.wrapper.don"), icon: donationIcon });
    if (formPermission || isFormMember) menuItems.push({url:"/forms", label:Locale.label("components.wrapper.form"), icon:"description" });
    menuItems.push({url:"/tasks", label: Locale.label("components.wrapper.tasks"), icon:"list_alt" });
    if (UserHelper.checkAccess(Permissions.membershipApi.plans.edit)) menuItems.push({ url:"/plans", label: Locale.label("components.wrapper.plans"), icon: "assignment" });
    if (UserHelper.checkAccess(Permissions.membershipApi.roles.view)) menuItems.push({ url: "/settings", label: Locale.label("components.wrapper.set"), icon: "settings" });
    // if (UserHelper.checkAccess(Permissions.membershipApi.server.admin)) tabs.push(<NavItem key="/admin" url="/admin" label={Locale.label("components.wrapper.servAdmin")} icon="admin_panel_settings" selected={selectedTab === "admin"} />);
    return menuItems;
  }

  const getSecondaryMenu = () => {
    const menuItems:{ url: string, label: string }[] = []
    menuItems.push({url: "/groups", label: Locale.label("components.wrapper.groups")});
    menuItems.push({url: "/people", label: Locale.label("components.wrapper.ppl")});
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) menuItems.push({url:"/attendance", label: Locale.label("components.wrapper.att")});
    return menuItems;
  }

  /*<Typography variant="h6" noWrap>{UserHelper.currentUserChurch?.church?.name || ""}</Typography>*/
  return (<>
    <div style={{backgroundColor:"#1565c0", color: "#FFF"}}>
      <CustomAppBar position="absolute">
        <Toolbar sx={{ pr: "24px", backgroundColor: "#1565C0" }}>
          <PrimaryMenu label="People" menuItems={getPrimaryMenu()}  />
          <SecondaryMenu label="People" menuItems={getSecondaryMenu()} />
          <div style={{ flex: 1 }}>
            <SecondaryMenuAlt label="People" menuItems={getSecondaryMenu()}  />
          </div>
          {UserHelper.user && <UserMenu profilePicture={PersonHelper.getPhotoUrl(context?.person)} userName={`${UserHelper.user?.firstName} ${UserHelper.user?.lastName}`} userChurches={UserHelper.userChurches} currentUserChurch={UserHelper.currentUserChurch} context={context} appName={"CHUMS"} loadCounts={() => {}} notificationCounts={{notificationCount:0, pmCount:0}} />}
          {!UserHelper.user && <Link href="/login" color="inherit" style={{ textDecoration: "none" }}>Login</Link>}
        </Toolbar>
      </CustomAppBar>
      <div style={{height:64}}></div>
    </div>
  </>
  );
}
