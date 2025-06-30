import React, { useContext, useState } from "react";
import { Groups, PersonAttendance } from "./components"
import { UserHelper, ApiHelper, type PersonInterface, Permissions, type ConversationInterface, Notes, DonationPage, Locale, type FormInterface, ArrayHelper } from "@churchapps/apphelper"
import { Grid, Icon } from "@mui/material"
import { useParams } from "react-router-dom";
import { PersonBanner } from "./components/PersonBanner";
import { PersonDetails } from "./components/PersonDetails";
import UserContext from "../UserContext";
import { PersonForm } from "./components/PersonForm";

export const PersonPage = () => {
  const [person, setPerson] = React.useState<PersonInterface>(null);
  const [selectedTab, setSelectedTab] = React.useState("");
  const context = useContext(UserContext);
  const params = useParams();
  const [allForms, setAllForms] = useState(null);
  const [form, setForm] = useState<FormInterface>(null);

  const loadData = () => {
    console.log("LOAD DATA", params.id);
    if (params.id === "add" || !params.id) {
      // Create a new empty person for adding
      const newPerson: PersonInterface = {
        name: { first: "", last: "", middle: "", nick: "", display: "" },
        contactInfo: { address1: "", address2: "", city: "", state: "", zip: "", email: "", homePhone: "", workPhone: "", mobilePhone: "" },
        membershipStatus: "", gender: "", birthDate: null, maritalStatus: "", nametagNotes: ""
      };
      setPerson(newPerson);
    } else {
      ApiHelper.get("/people/" + params.id, "MembershipApi").then(data => {
        const p: PersonInterface = data;
        if (!p.contactInfo) p.contactInfo = { homePhone: "", workPhone: "", mobilePhone: "" }
        else {
          if (!p.contactInfo.homePhone) p.contactInfo.homePhone = "";
          if (!p.contactInfo.mobilePhone) p.contactInfo.mobilePhone = "";
          if (!p.contactInfo.workPhone) p.contactInfo.workPhone = "";
        }
        setPerson(data)
      });
    }
    ApiHelper.get("/forms?contentType=person", "MembershipApi").then(data => setAllForms(data));
  }

  const handleCreateConversation = async () => {
    const conv: ConversationInterface = { allowAnonymousPosts: false, contentType: "person", contentId: person.id, title: person.name.display + " Notes", visibility: "hidden" }
    const result: ConversationInterface[] = await ApiHelper.post("/conversations", [conv], "MessagingApi");
    const p = { ...person };
    p.conversationId = result[0].id;
    ApiHelper.post("/people", [p], "MembershipApi");
    setPerson(p);
    return p.conversationId;
  }





  let defaultTab = "details";

  const getTabs = () => {
    const tabs: { key: string, icon: string, label: string }[] = [];
    tabs.push({ key: "details", icon: "person", label: Locale.label("person.person") });
    if (UserHelper.checkAccess(Permissions.membershipApi.people.edit)) { tabs.push({ key: "notes", icon: "notes", label: Locale.label("common.notes") }); if (defaultTab === "") defaultTab = "notes" }
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.view)) { tabs.push({ key: "attendance", icon: "calendar_month", label: Locale.label("people.tabs.att") }); if (defaultTab === "") defaultTab = "attendance"; }
    if (UserHelper.checkAccess(Permissions.givingApi.donations.view)) { tabs.push({ key: "donations", icon: "volunteer_activism", label: Locale.label("people.tabs.don") }); if (defaultTab === "") defaultTab = "donations"; }
    if (UserHelper.checkAccess(Permissions.membershipApi.groupMembers.view)) tabs.push({ key: "groups", icon: "people", label: Locale.label("people.groups.groups") });
    return tabs;
  }

  React.useEffect(() => {
    if (selectedTab === "" && defaultTab !== "") {
      setSelectedTab(defaultTab);
    }
  }, [selectedTab, defaultTab]);

  const getCurrentTab = () => {
    let currentTab = null;
    switch (selectedTab) {
      case "details": currentTab = <PersonDetails key="details" person={person} loadData={loadData} />; break;
      case "notes": currentTab = <Notes key="notes" context={context} conversationId={person?.conversationId} createConversation={handleCreateConversation} />; break;
      case "attendance": currentTab = <PersonAttendance key="attendance" personId={person.id} />; break;
      case "donations": currentTab = <DonationPage key="donations" personId={person.id} church={UserHelper.currentUserChurch.church} />; break;
      case "groups": currentTab = <Groups key="groups" personId={person?.id} />; break;
      case "form": currentTab = <PersonForm key="form" form={form} contentType={"person"} contentId={person.id} formSubmissions={person.formSubmissions} updatedFunction={() => { loadData() }} />; break;
      default: currentTab = <div key="default">{Locale.label("people.tabs.noImplement")}</div>; break;
    }
    return currentTab;
  }
  const getItem = (tab: any) => {
    if (tab.key === selectedTab) return (
      <li key={tab.key} className="active">
        <a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}>
          <Icon>{tab.icon}</Icon> {tab.label}
        </a>
      </li>
    );
    return (
      <li key={tab.key}>
        <a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedTab(tab.key); }}>
          <Icon>{tab.icon}</Icon> {tab.label}
        </a>
      </li>
    );
  }

  React.useEffect(loadData, [params.id]);

  const getFormList = () => {
    const result = allForms?.map((form: FormInterface) => (
      <li key={form.id}>
        <a href="about:blank" onClick={(e) => {
          e.preventDefault();
          setForm(ArrayHelper.getOne(allForms, "id", form.id));
          setSelectedTab("form");
        }}>
          {form.name}
        </a>
      </li>
    ));
    if (result) return (<><div className="subhead">Custom Forms</div><ul>{result}</ul></>)
  }

  return (
    <>
      <PersonBanner person={person} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 2 }}>
          <div className="sideNav" style={{ height: "100vh", borderRight: "1px solid #CCC" }}>
            <ul>{getTabs().map((tab) => getItem(tab))}</ul>

            {getFormList()}

          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 10 }}>
          <div id="mainContent">
            {getCurrentTab()}
          </div>
        </Grid>
      </Grid>

    </>
  )

}
