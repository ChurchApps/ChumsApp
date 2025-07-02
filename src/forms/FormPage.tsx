import React from "react";
import { Tabs } from "./components";
import { ApiHelper, type FormInterface, type MemberPermissionInterface, UserHelper, Permissions, Locale } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { Box, Typography, Stack, Button } from "@mui/material";
import { Description as DescriptionIcon } from "@mui/icons-material";

export const FormPage = () => {
  const params = useParams();
  const [form, setForm] = React.useState<FormInterface>({} as FormInterface);
  const [memberPermission, setMemberPermission] = React.useState<MemberPermissionInterface>({} as MemberPermissionInterface);
  const [selectedTab, setSelectedTab] = React.useState("");
  const [tabIndex, setTabIndex] = React.useState(0);

  const loadData = () => {
    ApiHelper.get("/forms/" + params.id, "MembershipApi").then(data => {
      setForm(data);
      if (data.contentType === "form") ApiHelper.get("/memberpermissions/form/" + params.id + "/my", "MembershipApi").then(results => setMemberPermission(results));
    });
  }

  React.useEffect(loadData, [params.id]);

  // Get available tabs based on permissions
  const getAvailableTabs = () => {
    const tabs = [];
    const formType = form.contentType;
    const formMemberAction = memberPermission.action;
    const formAdmin = UserHelper.checkAccess(Permissions.membershipApi.forms.admin);
    const formEdit = UserHelper.checkAccess(Permissions.membershipApi.forms.edit) && formType !== undefined && formType !== "form";
    const formMemberAdmin = formMemberAction === "admin" && formType !== undefined && formType === "form";
    const formMemberView = formMemberAction === "view" && formType !== undefined && formType === "form";

    if (formAdmin || formEdit || formMemberAdmin) {
      tabs.push({ key: "questions", label: Locale.label("forms.tabs.questions") });
    }
    if ((formAdmin || formMemberAdmin) && formType === "form") {
      tabs.push({ key: "members", label: Locale.label("forms.tabs.formMem") });
    }
    if ((formAdmin || formMemberAdmin || formMemberView)) {
      tabs.push({ key: "submissions", label: Locale.label("forms.tabs.formSub") });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();

  // Set default tab
  React.useEffect(() => {
    if (selectedTab === "" && availableTabs.length > 0) {
      setSelectedTab(availableTabs[0].key);
      setTabIndex(0);
    }
  }, [availableTabs, selectedTab]);

  return form?.id
    ? <>
      {/* Modern Banner Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={{ xs: 2, md: 4 }} 
          alignItems={{ xs: "flex-start", md: "center" }} 
          sx={{ width: "100%" }}
        >
          {/* Left side: Title and Icon */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '12px', 
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DescriptionIcon sx={{ fontSize: 32, color: '#FFF' }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  fontSize: { xs: '1.75rem', md: '2.125rem' }
                }}
              >
                {form.name}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Form configuration and submissions
              </Typography>
            </Box>
          </Stack>
          
          {/* Right side: Tab Buttons */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              flexShrink: 0,
              justifyContent: { xs: "flex-start", md: "flex-end" },
              width: { xs: "100%", md: "auto" }
            }}
          >
            {availableTabs.map((tab, index) => (
              <Button
                key={tab.key}
                variant={selectedTab === tab.key ? "contained" : "outlined"}
                onClick={() => { setSelectedTab(tab.key); setTabIndex(index); }}
                sx={{
                  color: selectedTab === tab.key ? "var(--c1l2)" : "#FFF",
                  backgroundColor: selectedTab === tab.key ? "#FFF" : "transparent",
                  borderColor: selectedTab === tab.key ? "#FFF" : "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "#FFF",
                    backgroundColor: selectedTab === tab.key ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)",
                    color: selectedTab === tab.key ? "var(--c1l2)" : "#FFF"
                  }
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          '& > *:first-of-type': { mb: 2 }, // Add margin bottom to edit components that appear above
          '& > *:not(:first-of-type)': { mt: 0 } // Ensure no extra margin for main content
        }}>
          <Tabs 
            form={form} 
            memberPermission={memberPermission} 
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
        </Box>
      </Box>
    </>
    : <></>;
}
