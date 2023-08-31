import React, { useContext } from "react";
import { Box, Paper, Tabs as MaterialTabs, Tab } from "@mui/material";
import { UserHelper, Notes, PersonAttendance, ApiHelper } from ".";
import { DonationPage, Permissions, PersonInterface, ConversationInterface } from "@churchapps/apphelper";
import UserContext from "../../UserContext";
interface Props { person: PersonInterface }

export const Tabs: React.FC<Props> = (props) => {
  const [person, setPerson] = React.useState<PersonInterface>(props.person);
  const [selectedTab, setSelectedTab] = React.useState("");
  const [tabIndex, setTabIndex] = React.useState(0);
  const context = useContext(UserContext);

  const getTab = (index: number, keyName: string, icon: string, text: string) => (
    <Tab key={index} style={{ textTransform: "none", color: "#000" }} onClick={() => { setSelectedTab(keyName); setTabIndex(index); }} label={<>{text}</>} />
  )

  const handleCreateConversation = async () => {
    const conv: ConversationInterface = { allowAnonymousPosts: false, contentType: "person", contentId: person.id, title: person.name.display + " Notes", visibility: "hidden" }
    const result: ConversationInterface[] = await ApiHelper.post("/conversations", [conv], "MessagingApi");
    const p = { ...person };
    p.conversationId = result[0].id;
    ApiHelper.post("/people", [p], "MembershipApi");
    setPerson(p);
    return p.conversationId;
  }

  React.useEffect(() => setPerson(props.person), [props.person]);

  if (person === undefined || person === null) return null;
  let tabs = [];
  let defaultTab = ""
  let currentTab = null;
  if (UserHelper.checkAccess(Permissions.membershipApi.people.edit)) { tabs.push(getTab(0, "notes", "notes", "Notes")); defaultTab = "notes"; }
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push(getTab(1, "attendance", "calendar_month", "Attendance")); if (defaultTab === "") defaultTab = "attendance"; }
  if (UserHelper.checkAccess(Permissions.givingApi.donations.view)) { tabs.push(getTab(2, "donations", "volunteer_activism", "Donations")); if (defaultTab === "") defaultTab = "donations"; }
  if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

  switch (selectedTab) {
    case "notes": currentTab = <Notes context={context} conversationId={person?.conversationId} createConversation={handleCreateConversation} />; break;
    case "attendance": currentTab = <PersonAttendance personId={person.id} />; break;
    case "donations": currentTab = <DonationPage personId={person.id} churchName={UserHelper.currentUserChurch.church.name} />; break;
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
