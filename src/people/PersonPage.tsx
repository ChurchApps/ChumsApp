import React, { useContext, useState, useCallback, useMemo } from "react";
import { Groups, PersonAttendance, PersonNotes, PersonDonations } from "./components";
import { ApiHelper, type PersonInterface, type ConversationInterface, Locale, type FormInterface } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { PersonBanner } from "./components/PersonBanner";
import { PersonDetails } from "./components/PersonDetails";
import UserContext from "../UserContext";
import { PersonForm } from "./components/PersonForm";
import { useQuery } from "@tanstack/react-query";

export const PersonPage = () => {
  const [person, setPerson] = React.useState<PersonInterface>(null);
  const [selectedTab, setSelectedTab] = React.useState("");
  const context = useContext(UserContext);
  const params = useParams();
  const [allForms, setAllForms] = useState(null);
  const [form, setForm] = useState<FormInterface>(null);
  const [inPhotoEditMode, setInPhotoEditMode] = React.useState<boolean>(false);
  const [editMode, setEditMode] = React.useState<string>("display");

  const personData = useQuery<PersonInterface>({
    queryKey: ["/people/" + params.id, "MembershipApi"],
    enabled: !!(params.id && params.id !== "add"),
    placeholderData: null,
  });

  const formsData = useQuery<FormInterface[]>({
    queryKey: ["/forms?contentType=person", "MembershipApi"],
    placeholderData: [],
  });

  const refetch = useCallback(() => {
    personData.refetch();
    formsData.refetch();
  }, [personData, formsData]);

  const processedPersonData = useMemo(() => {
    if (!personData.data) return null;
    const p: PersonInterface = personData.data;
    if (!p.contactInfo) p.contactInfo = { homePhone: "", workPhone: "", mobilePhone: "" };
    else {
      if (!p.contactInfo.homePhone) p.contactInfo.homePhone = "";
      if (!p.contactInfo.mobilePhone) p.contactInfo.mobilePhone = "";
      if (!p.contactInfo.workPhone) p.contactInfo.workPhone = "";
    }
    return p;
  }, [personData.data]);

  const loadData = useCallback(() => {
    console.log("LOAD DATA", params.id);
    if (params.id === "add" || !params.id) {
      // Create a new empty person for adding
      const newPerson: PersonInterface = {
        name: {
          first: "",
          last: "",
          middle: "",
          nick: "",
          display: "",
        },
        contactInfo: {
          address1: "",
          address2: "",
          city: "",
          state: "",
          zip: "",
          email: "",
          homePhone: "",
          workPhone: "",
          mobilePhone: "",
        },
        membershipStatus: "",
        gender: "",
        birthDate: null,
        maritalStatus: "",
        nametagNotes: "",
      };
      setPerson(newPerson);
    } else {
      setPerson(processedPersonData);
    }
    setAllForms(formsData.data);
  }, [params.id, processedPersonData, formsData.data]);

  const handleCreateConversation = async () => {
    const conv: ConversationInterface = {
      allowAnonymousPosts: false,
      contentType: "person",
      contentId: person.id,
      title: person.name.display + " Notes",
      visibility: "hidden",
    };
    const result: ConversationInterface[] = await ApiHelper.post("/conversations", [conv], "MessagingApi");
    const p = { ...person };
    p.conversationId = result[0].id;
    ApiHelper.post("/people", [p], "MembershipApi");
    setPerson(p);
    return p.conversationId;
  };

  const defaultTab = "details";

  React.useEffect(() => {
    if (selectedTab === "" && defaultTab !== "") {
      setSelectedTab(defaultTab);
    }
  }, [selectedTab, defaultTab]);

  const getCurrentTab = () => {
    let currentTab = null;
    switch (selectedTab) {
      case "details":
        currentTab = (
          <PersonDetails key="details" person={person} loadData={loadData} updatedFunction={refetch} inPhotoEditMode={inPhotoEditMode} setInPhotoEditMode={setInPhotoEditMode} editMode={editMode} setEditMode={setEditMode} />
        );
        break;
      case "notes":
        currentTab = <PersonNotes key="notes" context={context} conversationId={person?.conversationId} createConversation={handleCreateConversation} />;
        break;
      case "attendance":
        currentTab = <PersonAttendance key="attendance" personId={person.id} updatedFunction={refetch} />;
        break;
      case "donations":
        currentTab = <PersonDonations key="donations" personId={person.id} />;
        break;
      case "groups":
        currentTab = <Groups key="groups" personId={person?.id} updatedFunction={refetch} />;
        break;
      case "form":
        currentTab = (
          <PersonForm
            key="form"
            form={form}
            contentType={"person"}
            contentId={person.id}
            formSubmissions={person.formSubmissions}
            updatedFunction={refetch}
          />
        );
        break;
      default:
        currentTab = <div key="default">{Locale.label("people.tabs.noImplement")}</div>;
        break;
    }
    return currentTab;
  };

  React.useEffect(loadData, [params.id]);

  return (
    <>
      <PersonBanner
        person={person}
        onTabChange={setSelectedTab}
        togglePhotoEditor={setInPhotoEditMode}
        onEdit={() => {
          setEditMode("edit");
          setSelectedTab("details");
        }}
        allForms={allForms}
        onFormSelect={(form) => {
          setForm(form);
          setSelectedTab("form");
        }}
        selectedTab={selectedTab}
      />
      <div style={{ padding: "24px" }}>{getCurrentTab()}</div>
    </>
  );
};
