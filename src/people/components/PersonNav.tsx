import React, { useContext } from "react";
import { Box, Paper, Tabs as MaterialTabs, Tab, Icon } from "@mui/material";
import { PersonAttendance } from ".";
import { DonationPage, Permissions, PersonInterface, ConversationInterface, UserHelper, Notes, ApiHelper, Locale } from "@churchapps/apphelper";
import UserContext from "../../UserContext";
interface Props { person: PersonInterface }

export const PersonNav: React.FC<Props> = (props) => {
  const [person, setPerson] = React.useState<PersonInterface>(props.person);
  const [selectedTab, setSelectedTab] = React.useState("");

  const context = useContext(UserContext);
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
  const tabs: {key: string, icon: string, label: string}[] = [];


  if (person === undefined || person === null) return null;

  let defaultTab = "details";
  let currentTab = null;
  tabs.push({key:"details", icon:"person", label:Locale.label("person.person")});

  if (UserHelper.checkAccess(Permissions.membershipApi.people.edit)) { tabs.push({key:"notes", icon:"notes", label:Locale.label("common.notes")}); if (defaultTab === "") defaultTab = "notes" }
  if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push({key:"attendance", icon:"calendar_month", label:Locale.label("people.tabs.att")}); if (defaultTab === "") defaultTab = "attendance"; }
  if (UserHelper.checkAccess(Permissions.givingApi.donations.view)) { tabs.push({key:"donations", icon:"volunteer_activism", label:Locale.label("people.tabs.don") }); if (defaultTab === "") defaultTab = "donations"; }
  if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

  switch (selectedTab) {
    case "notes": currentTab = <Notes context={context} conversationId={person?.conversationId} createConversation={handleCreateConversation} />; break;
    case "attendance": currentTab = <PersonAttendance personId={person.id} />; break;
    case "donations": currentTab = <DonationPage personId={person.id} church={UserHelper.currentUserChurch.church} />; break;
    default: currentTab = <div>{Locale.label("people.tabs.noImplement")}</div>; break;
  }
  const getItem = (tab:any) => {
    if (tab.key === selectedTab) return (<li className="active"><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
    return (<li><a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}><Icon>{tab.icon}</Icon> {tab.label}</a></li>)
  }


  let a =0;
  return (<div className="sideNav" style={{height:"100vh", borderRight:"1px solid #CCC" }}>
    <ul>
      {tabs.map((tab, index) => getItem(tab))}
      <li><a href="about:blank"><Icon>people</Icon> Groups</a></li>
    </ul>

    <div className="subhead">Custom Forms</div>
    <ul>
      <li><a href="about:blank">Discipleship</a></li>
    </ul>

  </div>)
}
