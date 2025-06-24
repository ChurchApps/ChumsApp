import { Grid } from "@mui/material";
import React from "react";
import { FormMembers, Form, FormSubmissions } from ".";
import { UserHelper, Permissions, type MemberPermissionInterface, type FormInterface, Locale } from "@churchapps/apphelper";
import { Box, Paper, Tabs as MaterialTabs, Tab } from "@mui/material";

interface Props { form: FormInterface, memberPermission: MemberPermissionInterface }

export const Tabs: React.FC<Props> = (props) => {
  const [selectedTab, setSelectedTab] = React.useState("");
  const [tabIndex, setTabIndex] = React.useState(0);

  const getTab = (index: number, keyName: string, icon: string, text: string) => (
    <Tab key={index} style={{ textTransform: "none", color: "#000" }} onClick={() => { setSelectedTab(keyName); setTabIndex(index); }} label={<>{text}</>} />
  )

  const tabs = [];
  let defaultTab = "";
  let currentTab = null;

  const formType = props.form.contentType;
  const formMemberAction = props.memberPermission.action;
  const formAdmin = UserHelper.checkAccess(Permissions.membershipApi.forms.admin);
  const formEdit = UserHelper.checkAccess(Permissions.membershipApi.forms.edit) && formType !== undefined && formType !== "form";
  const formMemberAdmin = formMemberAction === "admin" && formType !== undefined && formType === "form";
  const formMemberView = formMemberAction === "view" && formType !== undefined && formType === "form";

  if (formAdmin || formEdit || formMemberAdmin) { tabs.push(getTab(0, "questions", "notes", Locale.label("forms.tabs.questions"))); defaultTab = "questions"; }
  if ((formAdmin || formMemberAdmin) && formType === "form") { tabs.push(getTab(1, "members", "calendar_month", Locale.label("forms.tabs.formMem"))); }
  if ((formAdmin || formMemberAdmin || formMemberView)) { tabs.push(getTab(2, "submissions", "calendar_month", Locale.label("forms.tabs.formSub"))); if (defaultTab !== "questions") defaultTab = "submissions" }

  if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

  switch (selectedTab) {
    case "questions": currentTab = <Form id={props.form.id} />; break;
    case "members": currentTab = <FormMembers formId={props.form.id} />; break;
    case "submissions": currentTab = <FormSubmissions formId={props.form.id} memberPermissions={props.memberPermission} />; break;
    default: currentTab = <div>{Locale.label("forms.tabs.unAuth")}</div>; break;
  }

  return (<>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper>
          <Box>
            <MaterialTabs value={tabIndex} style={{ borderBottom: "1px solid #CCC" }} data-cy="group-tabs">
              {tabs}
            </MaterialTabs>

          </Box>
        </Paper>
      </Grid>
    </Grid>
    {currentTab}
  </>
  );
}
