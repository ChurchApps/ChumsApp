import { Locale, UserHelper, Permissions } from "@churchapps/apphelper";

interface MenuItem {
  url: string;
  label: string;
  icon?: string;
}

export class SecondaryMenuHelper {
  static getSecondaryMenu = (path: string, data: any) => {
    let result: { menuItems: MenuItem[]; label: string } = { menuItems: [], label: "" };

    if (path.startsWith("/people") || path.startsWith("/groups") || path.startsWith("/attendance")) result = this.getPeopleMenu(path);
    else if (path.startsWith("/settings") || path.startsWith("/admin") || path.startsWith("/forms")) result = this.getSettingsMenu(path, data);
    else if (path.startsWith("/plans") || path.startsWith("/tasks")) result = this.getServingMenu(path);
    else if (path.startsWith("/donations")) result = this.getDonationsMenu(path);
    else if (path.startsWith("/profile")) result = this.getProfileMenu(path);
    else if (path === "/") result = this.getDashboardMenu(path);
    return result;
  };

  static getPeopleMenu = (path: string) => {
    const menuItems: MenuItem[] = [];
    let label: string = "";
    menuItems.push({ url: "/groups", label: Locale.label("components.wrapper.groups"), icon: "groups" });
    menuItems.push({ url: "/people", label: Locale.label("components.wrapper.ppl"), icon: "person" });
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) menuItems.push({ url: "/attendance", label: Locale.label("components.wrapper.att"), icon: "calendar_month" });

    if (path.startsWith("/groups")) label = Locale.label("components.wrapper.groups");
    else if (path.startsWith("/people")) label = Locale.label("components.wrapper.ppl");
    else if (path.startsWith("/attendance")) label = Locale.label("components.wrapper.att");

    return { menuItems, label };
  };

  static getSettingsMenu = (path: string, data: any) => {
    const menuItems: MenuItem[] = [];
    let label: string = "";
    if (UserHelper.checkAccess(Permissions.membershipApi.roles.view)) menuItems.push({ url: "/settings", label: Locale.label("components.wrapper.set"), icon: "settings" });
    if (UserHelper.checkAccess(Permissions.membershipApi.server.admin)) menuItems.push({ url: "/admin", label: Locale.label("components.wrapper.servAdmin"), icon: "admin_panel_settings" });
    if (data.formPermission) menuItems.push({ url: "/forms", label: Locale.label("components.wrapper.forms"), icon: "description" });

    if (path.startsWith("/settings")) label = Locale.label("components.wrapper.set");
    else if (path.startsWith("/admin")) label = Locale.label("components.wrapper.servAdmin");
    else if (path.startsWith("/forms")) label = Locale.label("components.wrapper.forms");

    return { menuItems, label };
  };

  static getProfileMenu = () => {
    const menuItems: MenuItem[] = [];
    const label: string = "";
    menuItems.push({ url: "/profile", label: "Profile", icon: "person" });
    menuItems.push({ url: "/profile/devices", label: "Devices", icon: "devices" });
    return { menuItems, label };
  };

  static getServingMenu = (path: string) => {
    const menuItems: MenuItem[] = [];
    let label: string = "";
    if (UserHelper.checkAccess(Permissions.membershipApi.plans.edit)) {
      menuItems.push({ url: "/plans", label: Locale.label("components.wrapper.plans"), icon: "assignment" });
      menuItems.push({ url: "/plans/songs", label: Locale.label("components.wrapper.songs"), icon: "music_note" });
    }
    menuItems.push({ url: "/tasks", label: Locale.label("components.wrapper.tasks"), icon: "list_alt" });

    if (path.startsWith("/plans/songs")) label = Locale.label("components.wrapper.songs");
    else if (path.startsWith("/plans")) label = Locale.label("components.wrapper.plans");
    else if (path.startsWith("/tasks")) label = Locale.label("components.wrapper.tasks");

    return { menuItems, label };
  };

  static getDonationsMenu = (path: string) => {
    const menuItems: MenuItem[] = [];
    let label: string = "";
    if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) menuItems.push({ url: "/donations", label: Locale.label("donations.donations.summary"), icon: "volunteer_activism" });
    if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) menuItems.push({ url: "/donations/batches", label: Locale.label("donations.donations.batches"), icon: "folder" });
    if (UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) menuItems.push({ url: "/donations/funds", label: Locale.label("donations.donations.funds"), icon: "account_balance" });

    if (path.startsWith("/donations/funds")) label = Locale.label("donations.donations.funds");
    else if (path.startsWith("/donations/batches")) label = Locale.label("donations.donations.batches");
    else if (path.startsWith("/donations")) label = Locale.label("donations.donations.summary");

    return { menuItems, label };
  };

  static getDashboardMenu = (path: string) => {
    const menuItems: MenuItem[] = [];
    let label: string = "";
    menuItems.push({ url: "/", label: Locale.label("components.wrapper.dash"), icon: "dashboard" });

    if (path === "/") label = Locale.label("components.wrapper.dash");

    return { menuItems, label };
  };
}
