import { PersonHelper, type PersonInterface, UserHelper, Permissions, DateHelper } from "@churchapps/apphelper";
import { Button, Grid, Typography, Chip, IconButton, Avatar, Stack, Box } from "@mui/material";
import { Edit as EditIcon, Phone as PhoneIcon, Email as EmailIcon, Home as HomeIcon, Group as GroupIcon, VolunteerActivism as DonationIcon, CalendarMonth as AttendanceIcon, Notes as NotesIcon } from "@mui/icons-material";
import React, { memo, useMemo } from "react";

interface Props {
  person: PersonInterface
  onTabChange?: (tab: string) => void
  togglePhotoEditor?: (show: boolean) => void
  onEdit?: () => void
}

export const PersonBanner = memo((props: Props) => {
  const { person, onTabChange, togglePhotoEditor, onEdit } = props;
  
  const canEdit = useMemo(() => UserHelper.checkAccess(Permissions.membershipApi.people.edit), []);

  const membershipStatus = useMemo(() => {
    if (!person?.membershipStatus) return null;
    const colors: Record<string, any> = {
      "Member": { bg: "#e8f5e9", color: "#2e7d32" },
      "Visitor": { bg: "#fff3e0", color: "#e65100" },
      "Staff": { bg: "#e3f2fd", color: "#1565c0" }
    };
    const status = colors[person.membershipStatus] || { bg: "#f5f5f5", color: "#616161" };
    return (
      <Chip 
        label={person.membershipStatus} 
        size="small" 
        sx={{ 
          backgroundColor: status.bg, 
          color: status.color,
          fontWeight: 600,
          fontSize: '0.875rem'
        }} 
      />
    );
  }, [person?.membershipStatus]);

  const quickStats = useMemo(() => {
    if (!person) return [];
    const stats = [];
    
    if (person.birthDate) {
      const age = PersonHelper.getAge(person.birthDate);
      stats.push({ label: "Age", value: `${age} years` });
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
        action: () => window.location.href = `mailto:${person.contactInfo.email}`
      });
    }
    
    const phone = person.contactInfo.mobilePhone || person.contactInfo.homePhone || person.contactInfo.workPhone;
    if (phone) {
      info.push({
        icon: <PhoneIcon sx={{ color: "#fff", fontSize: 16 }} />,
        value: phone
      });
    }
    
    if (person.contactInfo.address1) {
      const addressParts = [
        person.contactInfo.address1,
        person.contactInfo.address2,
        [person.contactInfo.city, person.contactInfo.state, person.contactInfo.zip].filter(Boolean).join(", ")
      ].filter(Boolean);
      
      info.push({
        icon: <HomeIcon sx={{ color: "#fff", fontSize: 16 }} />,
        value: addressParts.join(", ")
      });
    }
    
    return info;
  }, [person]);

  const quickActions = [
    { label: "Notes", icon: <NotesIcon />, onClick: () => onTabChange?.("notes"), color: "inherit" },
    { label: "Groups", icon: <GroupIcon />, onClick: () => onTabChange?.("groups"), color: "inherit" },
    { label: "Attendance", icon: <AttendanceIcon />, onClick: () => onTabChange?.("attendance"), color: "inherit" },
    { label: "Donations", icon: <DonationIcon />, onClick: () => onTabChange?.("donations"), color: "inherit" }
  ];

  if (!person) return null;

  return (
    <div style={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        spacing={{ xs: 2, md: 4 }} 
        alignItems={{ xs: "flex-start", md: "center" }} 
        sx={{ width: "100%" }}
      >
        {/* Column 1: Avatar + Name + Badge + Personal Info */}
        <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
          <Avatar 
            src={PersonHelper.getPhotoUrl(person)} 
            sx={{ 
              width: { xs: 80, md: 100 }, 
              height: { xs: 80, md: 100 }, 
              cursor: canEdit ? "pointer" : "default",
              border: "3px solid #FFF",
              flexShrink: 0
            }}
            onClick={() => canEdit && togglePhotoEditor?.(true)}
          />
          
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" mb={1} flexWrap="wrap">
              <Typography 
                sx={{ 
                  color: "#FFF", 
                  fontWeight: 400, 
                  mb: 0,
                  wordBreak: "break-word",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  lineHeight: 1.1
                }}
              >
                {person.name.display}
              </Typography>
              {membershipStatus}
              {canEdit && (
                <IconButton 
                  size="small" 
                  sx={{ color: "#FFF" }}
                  onClick={onEdit}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
            
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {quickStats.map((stat, idx) => (
                <Typography 
                  key={idx}
                  variant="body2" 
                  sx={{ 
                    color: "#FFF", 
                    fontSize: { xs: "0.875rem", md: "1rem" }
                  }}
                >
                  {stat.value}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Column 2: Contact Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={1}>
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
                    fontSize: { xs: "0.875rem", md: "1rem" }
                  }}
                  onClick={info.action}
                >
                  {info.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
        
        {/* Column 3: Action Buttons */}
        <Stack 
          direction="row" 
          spacing={1} 
          flexWrap="wrap" 
          sx={{ 
            flexShrink: 0,
            justifyContent: { xs: "flex-start", md: "flex-end" },
            width: { xs: "100%", md: "auto" }
          }}
          useFlexGap
        >
          {quickActions.map((action) => (
            <Button
              key={action.label}
              size="small"
              variant="outlined"
              sx={{ 
                color: "#FFF", 
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)"
                },
                mb: { xs: 1, md: 0 }
              }}
              startIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </div>
  );
});
