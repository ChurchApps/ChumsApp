import React, { useEffect, useMemo } from "react";
import { Locale, UserHelper, Permissions, ApiHelper } from "@churchapps/apphelper";
import UserContext from "../UserContext";
import { SiteHeader } from "@churchapps/apphelper";
import { SecondaryMenuHelper } from "../helpers/SecondaryMenuHelper";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const context = React.useContext(UserContext);
  const navigate = useNavigate();
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
  }, [formPermission, context?.person?.id]);

  const primaryMenu = useMemo(() => {
    const donationIcon = donationError ? "error" : "volunteer_activism";
    const menuItems: { url: string, icon: string, label: string }[] = []
    menuItems.push({ url: "/", icon: "home", label: Locale.label("components.wrapper.dash") });
    menuItems.push({ url: "/people", icon: "person", label: Locale.label("components.wrapper.ppl") });
    if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) menuItems.push({ url: "/donations", label: Locale.label("components.wrapper.don"), icon: donationIcon });


    if (UserHelper.checkAccess(Permissions.membershipApi.plans.edit)) menuItems.push({ url: "/plans", label: Locale.label("components.wrapper.serving"), icon: "assignment" });
    else menuItems.push({ url: "/tasks", label: Locale.label("components.wrapper.serving"), icon: "assignment" });

    if (UserHelper.checkAccess(Permissions.membershipApi.roles.view)) menuItems.push({ url: "/settings", label: Locale.label("components.wrapper.set"), icon: "settings" });
    else if (formPermission || isFormMember) menuItems.push({ url: "/forms", label: Locale.label("components.wrapper.set"), icon: "settings" });
    // if (UserHelper.checkAccess(Permissions.membershipApi.server.admin)) tabs.push(<NavItem key="/admin" url="/admin" label={Locale.label("components.wrapper.servAdmin")} icon="admin_panel_settings" selected={selectedTab === "admin"} />);
    return menuItems;
  }, [donationError, formPermission, isFormMember]);
  /*
  const getSecondaryMenu = () => {
    const menuItems:{ url: string, label: string }[] = []
    menuItems.push({url: "/groups", label: Locale.label("components.wrapper.groups")});
    menuItems.push({url: "/people", label: Locale.label("components.wrapper.ppl")});
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) menuItems.push({url:"/attendance", label: Locale.label("components.wrapper.att")});
    return menuItems;
  }*/

  const getPrimaryLabel = () => {
    const path = window.location.pathname;
    let result = Locale.label("dashboard.dashboardPage.dash");
    if (path.startsWith("/people")) result = Locale.label("components.wrapper.ppl");
    else if (path.startsWith("/attendance")) result = Locale.label("components.wrapper.att");
    else if (path.startsWith("/groups")) result = Locale.label("components.wrapper.groups");
    else if (path.startsWith("/donations")) result = Locale.label("components.wrapper.don");
    else if (path.startsWith("/tasks") || path.startsWith("/plans") || window.location.search.indexOf("tag=") > -1) result = Locale.label("components.wrapper.serving");
    else if (path.startsWith("/settings") || path.startsWith("/admin") || path.startsWith("/forms")) result = Locale.label("components.wrapper.set");
    return result;
  }

  const secondaryMenu = SecondaryMenuHelper.getSecondaryMenu(window.location.pathname, { formPermission });

  const handleNavigate = (url: string) => { navigate(url); }

  /*<Typography variant="h6" noWrap>{UserHelper.currentUserChurch?.church?.name || ""}</Typography>*/
  return (<SiteHeader primaryMenuItems={primaryMenu} primaryMenuLabel={getPrimaryLabel()} secondaryMenuItems={secondaryMenu.menuItems} secondaryMenuLabel={secondaryMenu.label} context={context} appName={"CHUMS"} onNavigate={handleNavigate} />);
}
