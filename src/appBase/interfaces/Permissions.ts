export class Permissions {
  static attendanceApi = {
    attendance: {
      view: { api: "AttendanceApi", contentType: "Attendance", action: "View" },
      viewSummary: { api: "AttendanceApi", contentType: "Attendance", action: "View Summary" },
      edit: { api: "AttendanceApi", contentType: "Attendance", action: "Edit" }
    },
    services: {
      edit: { api: "AttendanceApi", contentType: "Services", action: "Edit" }
    },
    admin: {
      editSettings: { api: "AttendanceApi", contentType: "Admin", action: "Edit Settings" }
    }
  };

  static membershipApi = {
    forms: {
      view: { api: "MembershipApi", contentType: "Forms", action: "View" },
      edit: { api: "MembershipApi", contentType: "Forms", action: "Edit" }
    },
    groups: {
      view: { api: "MembershipApi", contentType: "Groups", action: "View" },
      edit: { api: "MembershipApi", contentType: "Groups", action: "Edit" }
    },
    people: {
      editNotes: { api: "MembershipApi", contentType: "People", action: "Edit Notes" },
      viewNotes: { api: "MembershipApi", contentType: "People", action: "View Notes" },
      edit: { api: "MembershipApi", contentType: "People", action: "Edit" }
    },
    groupMembers: {
      edit: { api: "MembershipApi", contentType: "Group Members", action: "Edit" },
      view: { api: "MembershipApi", contentType: "Group Members", action: "View" }
    },
    households: {
      edit: { api: "MembershipApi", contentType: "Households", action: "Edit" }
    }
  };

  static givingApi = {
    donations: {
      viewSummary: { api: "GivingApi", contentType: "Donations", action: "View Summary" },
      view: { api: "GivingApi", contentType: "Donations", action: "View" },
      edit: { api: "GivingApi", contentType: "Donations", action: "Edit" }
    }
  }

  static accessApi = {
    roles: {
      view: { api: "AccessApi", contentType: "Roles", action: "View" },
      edit: { api: "AccessApi", contentType: "Roles", action: "Edit" }
    },
    roleMembers: {
      view: { api: "AccessApi", contentType: "RoleMembers", action: "View" },
      edit: { api: "AccessApi", contentType: "RoleMembers", action: "Edit" }
    },
    rolePermissions: {
      view: { api: "AccessApi", contentType: "RolePermissions", action: "View" },
      edit: { api: "AccessApi", contentType: "RolePermissions", action: "Edit" }
    },
    users: {
      view: { api: "AccessApi", contentType: "Users", action: "View" },
      edit: { api: "AccessApi", contentType: "Users", action: "Edit" }
    },
    settings: {
      edit: { api: "AccessApi", contentType: "Settings", action: "Edit" }
    }
  }
}
