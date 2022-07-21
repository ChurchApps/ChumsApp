import { Box, Paper, Tabs as MaterialTabs, Tab } from "@mui/material";
import React from "react";
import { UserHelper, Notes, PersonAttendance, Permissions, PersonInterface, NoteInterface } from ".";
import { DonationPage } from "../../appBase/donationComponents/DonationPage";
interface Props { person: PersonInterface, showNoteBox: (noteId?: string) => void, notes: NoteInterface[] }

export const Tabs: React.FC<Props> = (props) => {
  const [personId, setPersonId] = React.useState(props.person?.id);
  const [selectedTab, setSelectedTab] = React.useState("");
  const [tabIndex, setTabIndex] = React.useState(0);

  const getTab = (index: number, keyName: string, icon: string, text: string) => (
    <Tab key={index} style={{ textTransform: "none", color: "#000" }} onClick={() => { setSelectedTab(keyName); setTabIndex(index); }} label={<>{text}</>} />
  )

  React.useEffect(() => setPersonId(props.person?.id), [props.person]);

  if (props.person === undefined || props.person === null) return null;
  let tabs = [];
  let defaultTab = ""
  let currentTab = null;
  if (UserHelper.checkAccess(Permissions.membershipApi.notes.view)) { tabs.push(getTab(0, "notes", "notes", "Notes")); defaultTab = "notes"; }
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push(getTab(1, "attendance", "calendar_month", "Attendance")); if (defaultTab === "") defaultTab = "attendance"; }
  if (UserHelper.checkAccess(Permissions.givingApi.donations.view)) { tabs.push(getTab(2, "donations", "volunteer_activism", "Donations")); if (defaultTab === "") defaultTab = "donations"; }
  if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

  switch (selectedTab) {
    case "notes": currentTab = <Notes showNoteBox={props.showNoteBox} notes={props.notes} />; break;
    case "attendance": currentTab = <PersonAttendance personId={personId} />; break;
    case "donations": currentTab = <DonationPage personId={personId} />; break;
    default: currentTab = <div>Not implemented</div>; break;
  }

  return (<Paper>
    <Box>
      <MaterialTabs value={tabIndex} style={{ borderBottom: "1px solid #CCC" }}>
        {tabs}
      </MaterialTabs>
      {currentTab}
    </Box>
  </Paper>);
}
