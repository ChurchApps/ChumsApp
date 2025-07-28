import { PersonHelper, type PersonInterface, UserHelper, Permissions, DateHelper, type FormInterface, PersonAvatar } from "@churchapps/apphelper";
import { Button, Typography, IconButton, Stack, Menu, MenuItem } from "@mui/material";
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Group as GroupIcon,
  VolunteerActivism as DonationIcon,
  CalendarMonth as AttendanceIcon,
  Notes as NotesIcon,
  Assignment as FormIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import React, { memo, useMemo, useState } from "react";
import { StatusChip } from "../../components";

interface Props {
  person: PersonInterface;
  onTabChange?: (tab: string) => void;
  togglePhotoEditor?: (show: boolean) => void;
  onEdit?: () => void;
  allForms?: FormInterface[];
  onFormSelect?: (form: FormInterface) => void;
  selectedTab?: string;
}

export const PersonBanner = memo((props: Props) => {
  const { person, onTabChange, togglePhotoEditor, onEdit, allForms, onFormSelect, selectedTab } = props;
  const [formsMenuAnchor, setFormsMenuAnchor] = useState<null | HTMLElement>(null);

  const canEdit = useMemo(() => UserHelper.checkAccess(Permissions.membershipApi.people.edit), []);

  const membershipStatus = useMemo(() => {
    if (!person?.membershipStatus) return null;
    return <StatusChip status={person.membershipStatus} size="small" />;
  }, [person?.membershipStatus]);

  const quickStats = useMemo(() => {
    if (!person) return [];
    const stats = [];

    if (person.birthDate) {
      const age = PersonHelper.getAge(person.birthDate);
      stats.push({ label: "Age", value: `${age}` });
    }

    if (person.gender && person.gender !== "Unspecified") {
      stats.push({ label: "Gender", value: person.gender });
    }

    if (person.maritalStatus && person.maritalStatus !== "Single") {
      let value = person.maritalStatus;
      if (person.anniversary) {
        value += ` (${DateHelper.getShortDate(DateHelper.toDate(person.anniversary))})`;
      }
      stats.push({ label: "Marital Status", value });
    }

    return stats;
  }, [person]);

  const contactInfo = useMemo(() => {
    if (!person?.contactInfo) return [];
    const info = [];

    if (person.contactInfo.email) {
      info.push({
        icon: <EmailIcon sx={{ color: "#fff", fontSize: 16 }} />,
        value: person.contactInfo.email,
        action: () => (window.location.href = `mailto:${person.contactInfo.email}`),
      });
    }

    const phone = person.contactInfo.mobilePhone || person.contactInfo.homePhone || person.contactInfo.workPhone;
    if (phone) {
      info.push({
        icon: <PhoneIcon sx={{ color: "#fff", fontSize: 16 }} />,
        value: phone,
      });
    }

    if (person.contactInfo.address1) {
      const addressParts = [person.contactInfo.address1, person.contactInfo.address2, [person.contactInfo.city, person.contactInfo.state, person.contactInfo.zip].filter(Boolean).join(", ")].filter(Boolean);

      info.push({
        icon: <HomeIcon sx={{ color: "#fff", fontSize: 16 }} />,
        value: addressParts.join(", "),
      });
    }

    return info;
  }, [person]);

  const quickActions = [
    {
      label: "Details",
      icon: <PersonIcon />,
      onClick: () => onTabChange?.("details"),
      color: "inherit",
      active: selectedTab === "details",
    },
    {
      label: "Notes",
      icon: <NotesIcon />,
      onClick: () => onTabChange?.("notes"),
      color: "inherit",
      active: selectedTab === "notes",
    },
    {
      label: "Groups",
      icon: <GroupIcon />,
      onClick: () => onTabChange?.("groups"),
      color: "inherit",
      active: selectedTab === "groups",
    },
    {
      label: "Attendance",
      icon: <AttendanceIcon />,
      onClick: () => onTabChange?.("attendance"),
      color: "inherit",
      active: selectedTab === "attendance",
    },
    {
      label: "Donations",
      icon: <DonationIcon />,
      onClick: () => onTabChange?.("donations"),
      color: "inherit",
      active: selectedTab === "donations",
    },
  ];

  const handleFormsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFormsMenuAnchor(event.currentTarget);
  };

  const handleFormsMenuClose = () => {
    setFormsMenuAnchor(null);
  };

  const handleFormSelect = (form: FormInterface) => {
    onFormSelect?.(form);
    handleFormsMenuClose();
  };

  if (!person) return null;

  return (
    <div style={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
      <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: "flex-start", md: "center" }} sx={{ width: "100%" }}>
        {/* Column 1: Avatar + Name + Status */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
          <div style={{ border: "3px solid #FFF", borderRadius: "50%" }}>
            <PersonAvatar
              person={person}
              size="responsive"
              onClick={() => canEdit && togglePhotoEditor?.(true)}
            />
          </div>
          <Stack spacing={1} sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                sx={{
                  color: "#FFF",
                  fontWeight: 400,
                  mb: 0,
                  wordBreak: "break-word",
                  fontSize: { xs: "1.7rem", sm: "2rem", md: "2.5rem" },
                  lineHeight: 1.1,
                }}
              >
                {person.name.display}
              </Typography>
              {canEdit && (
                <IconButton size="small" sx={{ color: "#FFF" }} onClick={onEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {membershipStatus}
              {quickStats.map((stat, idx) => (
                <Typography key={idx} variant="body2" sx={{ color: "#FFF", opacity: 0.9 }}>
                  {stat.value}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </Stack>

        {/* Column 2: Contact Info */}
        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          {contactInfo.map((info, idx) => (
            <Stack key={idx} direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              {info.icon}
              <Typography
                variant="body2"
                sx={{
                  color: "#FFF",
                  cursor: info.action ? "pointer" : "default",
                  "&:hover": info.action ? { textDecoration: "underline" } : {},
                  wordBreak: "break-word",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
                onClick={info.action}
              >
                {info.value}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Column 3: Action Buttons */}
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          sx={{
            flexShrink: 0,
            justifyContent: { xs: "flex-start", md: "flex-end" },
            width: { xs: "100%", md: "auto" },
          }}
          useFlexGap
        >
          {quickActions.map((action) => (
            <Button
              key={action.label}
              size="small"
              variant={action.active ? "contained" : "outlined"}
              sx={{
                color: action.active ? "var(--c1l2)" : "#FFF",
                backgroundColor: action.active ? "#FFF" : "transparent",
                borderColor: action.active ? "#FFF" : "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: action.active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)",
                  color: action.active ? "var(--c1l2)" : "#FFF",
                },
                mb: { xs: 1, md: 0 },
              }}
              startIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}

          {/* Custom Forms Dropdown */}
          {allForms && allForms.length > 0 && (
            <>
              <Button
                size="small"
                variant={selectedTab === "form" ? "contained" : "outlined"}
                sx={{
                  color: selectedTab === "form" ? "var(--c1l2)" : "#FFF",
                  backgroundColor: selectedTab === "form" ? "#FFF" : "transparent",
                  borderColor: selectedTab === "form" ? "#FFF" : "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "#FFF",
                    backgroundColor: selectedTab === "form" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)",
                    color: selectedTab === "form" ? "var(--c1l2)" : "#FFF",
                  },
                  mb: { xs: 1, md: 0 },
                }}
                startIcon={<FormIcon />}
                endIcon={<ExpandMoreIcon />}
                onClick={handleFormsMenuOpen}
              >
                Forms
              </Button>
              <Menu
                anchorEl={formsMenuAnchor}
                open={Boolean(formsMenuAnchor)}
                onClose={handleFormsMenuClose}
                PaperProps={{
                  sx: {
                    minWidth: 200,
                    maxHeight: 300,
                    mt: 1,
                  },
                }}
              >
                {allForms.map((form) => (
                  <MenuItem
                    key={form.id}
                    onClick={() => handleFormSelect(form)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FormIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography variant="body2">{form.name}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Stack>
      </Stack>
    </div>
  );
});
