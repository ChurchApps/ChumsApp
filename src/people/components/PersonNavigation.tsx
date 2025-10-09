import { type FormInterface } from "@churchapps/helpers";
import { Tabs, Tab, Menu, MenuItem, Stack, Typography } from "@mui/material";
import {
  Group as GroupIcon,
  VolunteerActivism as DonationIcon,
  CalendarMonth as AttendanceIcon,
  Notes as NotesIcon,
  Assignment as FormIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import React, { memo, useState } from "react";

interface Props {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  allForms?: FormInterface[];
  onFormSelect?: (form: FormInterface) => void;
}

export const PersonNavigation = memo((props: Props) => {
  const { selectedTab, onTabChange, allForms, onFormSelect } = props;
  const [formsMenuAnchor, setFormsMenuAnchor] = useState<null | HTMLElement>(null);

  const handleFormsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setFormsMenuAnchor(event.currentTarget);
  };

  const handleFormsMenuClose = () => {
    setFormsMenuAnchor(null);
  };

  const handleFormSelect = (form: FormInterface) => {
    onFormSelect?.(form);
    handleFormsMenuClose();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== "forms") onTabChange(newValue);
  };

  return (
    <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0" }}>
      <Tabs
        value={selectedTab === "form" ? "forms" : selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          minHeight: 48,
          "& .MuiTab-root": {
            minHeight: 48,
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
          },
        }}>
        <Tab
          value="details"
          label="Details"
          icon={<PersonIcon />}
          iconPosition="start"
          sx={{ gap: 1 }}
        />
        <Tab
          value="notes"
          label="Notes"
          icon={<NotesIcon />}
          iconPosition="start"
          sx={{ gap: 1 }}
        />
        <Tab
          value="groups"
          label="Groups"
          icon={<GroupIcon />}
          iconPosition="start"
          sx={{ gap: 1 }}
        />
        <Tab
          value="attendance"
          label="Attendance"
          icon={<AttendanceIcon />}
          iconPosition="start"
          sx={{ gap: 1 }}
        />
        <Tab
          value="donations"
          label="Donations"
          icon={<DonationIcon />}
          iconPosition="start"
          sx={{ gap: 1 }}
        />
        {allForms && allForms.length > 0 && (
          <Tab
            value="forms"
            label={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <span>Forms</span>
                <ExpandMoreIcon sx={{ fontSize: 18 }} />
              </Stack>
            }
            icon={<FormIcon />}
            iconPosition="start"
            onClick={handleFormsMenuOpen}
            sx={{ gap: 1 }}
          />
        )}
      </Tabs>
      <Menu
        anchorEl={formsMenuAnchor}
        open={Boolean(formsMenuAnchor)}
        onClose={handleFormsMenuClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            maxHeight: 300,
            mt: 0.5,
          },
        }}>
        {allForms?.map((form) => (
          <MenuItem
            key={form.id}
            onClick={() => handleFormSelect(form)}
            sx={{
              py: 1.5,
              px: 2,
              "&:hover": { backgroundColor: "action.hover" },
            }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FormIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="body2">{form.name}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
});
