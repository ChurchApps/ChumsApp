import React from "react";
import { UserHelper, ImportPreview, ImportHelper, InputBox, UploadHelper, ImportStatus, Permissions } from "./components";
import {
  ImportPersonInterface, ImportHouseholdInterface
  , ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface
  , ImportGroupInterface, ImportGroupMemberInterface, ImportGroupServiceTimeInterface
  , ImportVisitInterface, ImportSessionInterface, ImportVisitSessionInterface
  , ImportDonationBatchInterface, ImportFundInterface, ImportDonationInterface
  , ImportFundDonationInterface, ImportDataInterface, ImportFormsInterface
  , ImportQuestionsInterface, ImportFormSubmissions, ImportAnswerInterface
} from "../helpers/ImportHelper";
import { Row, Col } from "react-bootstrap";
import JSZip from "jszip";

export const ImportPage = () => {
  const [people, setPeople] = React.useState<ImportPersonInterface[]>([]);
  const [households, setHouseholds] = React.useState<ImportHouseholdInterface[]>([]);
  const [triggerRender, setTriggerRender] = React.useState(0);

  const [campuses, setCampuses] = React.useState<ImportCampusInterface[]>([]);
  const [services, setServices] = React.useState<ImportServiceInterface[]>([]);
  const [serviceTimes, setServiceTimes] = React.useState<ImportServiceTimeInterface[]>([]);

  const [groupServiceTimes, setGroupServiceTimes] = React.useState<ImportGroupServiceTimeInterface[]>([]);
  const [groups, setGroups] = React.useState<ImportGroupInterface[]>([]);
  const [groupMembers, setGroupMembers] = React.useState<ImportGroupMemberInterface[]>([]);

  const [sessions, setSessions] = React.useState<ImportSessionInterface[]>([])
  const [visits, setVisits] = React.useState<ImportVisitInterface[]>([])
  const [visitSessions, setVisitSessions] = React.useState<ImportVisitSessionInterface[]>([])

  const [batches, setBatches] = React.useState<ImportDonationBatchInterface[]>([]);
  const [funds, setFunds] = React.useState<ImportFundInterface[]>([]);
  const [donations, setDonations] = React.useState<ImportDonationInterface[]>([]);
  const [fundDonations, setFundDonations] = React.useState<ImportFundDonationInterface[]>([]);

  const [forms, setForms] = React.useState<ImportFormsInterface[]>([]);
  const [questions, setQuestions] = React.useState<ImportQuestionsInterface[]>([]);
  const [formSubmissions, setFormSubmissions] = React.useState<ImportFormSubmissions[]>([]);
  const [answers, setAnswers] = React.useState<ImportAnswerInterface[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target) {
      let file = e.target.files[0];
      readZip(file);
    }
  }

  const readZip = async (file: File) => {
    const zip = await JSZip.loadAsync(file);

    zip.files["people.csv"] && loadPeople(UploadHelper.readCsvString(await zip.file("people.csv").async("string")), zip);
    let tmpServiceTimes = zip.files["services.csv"] && loadServiceTimes(UploadHelper.readCsvString(await zip.file("services.csv").async("string")));
    zip.files["groups.csv"] && loadGroups(UploadHelper.readCsvString(await zip.file("groups.csv").async("string")));
    zip.files["groupmembers.csv"] && loadGroupMembers(UploadHelper.readCsvString(await zip.file("groupmembers.csv").async("string")));
    zip.files["attendance.csv"] && loadAttendance(UploadHelper.readCsvString(await zip.file("attendance.csv").async("string")), tmpServiceTimes);
    zip.files["donations.csv"] && loadDonations(UploadHelper.readCsvString(await zip.file("donations.csv").async("string")));
    zip.files["forms.csv"] && loadForms(UploadHelper.readCsvString(await zip.file("forms.csv").async("string")));
    zip.files["questions.csv"] && loadQuestions(UploadHelper.readCsvString(await zip.file("questions.csv").async("string")));
    zip.files["formSubmissions.csv"] && loadFormSubmissions(UploadHelper.readCsvString(await zip.file("formSubmissions.csv").async("string")));
    zip.files["answers.csv"] && loadAnswers(UploadHelper.readCsvString(await zip.file("answers.csv").async("string")));
  }

  const loadAnswers = (data: any) => {
    let answers: ImportAnswerInterface[] = [];

    for (let i = 0; i < data.length; i++) if (data[i].value !== undefined) {
      answers.push(data[i]);
    }

    setAnswers(answers);
  }

  const loadFormSubmissions = (data: any) => {
    let formSubmissions: ImportFormSubmissions[] = [];

    for (let i = 0; i < data.length; i++) if (data[i].personKey !== undefined) {
      formSubmissions.push(data[i]);
    }

    setFormSubmissions(formSubmissions);
  }

  const loadQuestions = (data: any) => {
    let questions: ImportQuestionsInterface[] = [];

    for (let i = 0; i < data.length; i++) if (data[i].title !== undefined) {
      questions.push(data[i]);
    }

    setQuestions(questions);
  }

  const loadForms = (data: any) => {
    let forms: ImportFormsInterface[] = [];

    for (let i = 0; i < data.length; i++) if (data[i].name !== undefined) {
      forms.push(data[i]);
    }

    setForms(forms);
  }

  const loadDonations = (data: any) => {
    let batches: ImportDonationBatchInterface[] = [];
    let funds: ImportFundInterface[] = [];
    let donations: ImportDonationInterface[] = [];
    let fundDonations: ImportFundDonationInterface[] = [];

    for (let i = 0; i < data.length; i++) if (data[i].amount !== undefined) {
      let d = data[i];
      let batch = ImportHelper.getOrCreateBatch(batches, d.batch, new Date(d.date));
      let fund = ImportHelper.getOrCreateFund(funds, d.fund);
      let donation = { importKey: (donations.length + 1).toString(), batchKey: batch.importKey, personKey: d.personKey, donationDate: new Date(d.date), amount: Number.parseFloat(d.amount), method: d.method, methodDetails: d.methodDetails, notes: d.notes } as ImportDonationInterface;
      let fundDonation = { donationKey: donation.importKey, fundKey: fund.importKey, amount: Number.parseFloat(d.amount) } as ImportFundDonationInterface;
      donations.push(donation);
      fundDonations.push(fundDonation);
    }

    setBatches(batches)
    setFunds(funds);
    setDonations(donations);
    setFundDonations(fundDonations);
  }

  const loadAttendance = (data: any, tmpServiceTimes: ImportServiceTimeInterface[]) => {
    let sessions: ImportSessionInterface[] = [];
    let visits: ImportVisitInterface[] = [];
    let visitSessions: ImportVisitSessionInterface[] = [];

    for (let i = 0; i < data.length; i++) if (data[i].personKey !== undefined && data[i].groupKey !== undefined) {
      let session = ImportHelper.getOrCreateSession(sessions, new Date(data[i].date), data[i].groupKey, data[i].serviceTimeKey);
      let visit = ImportHelper.getOrCreateVisit(visits, data[i], tmpServiceTimes);
      let visitSession = { visitKey: visit.importKey, sessionKey: session.importKey } as ImportVisitSessionInterface;
      visitSessions.push(visitSession);

      let group = ImportHelper.getOrCreateGroup(groups, data[i]);
      if (group !== null && group.serviceTimeKey !== undefined && group.serviceTimeKey !== null) {
        let gst = { groupKey: group.importKey, serviceTimeKey: group.serviceTimeKey } as ImportGroupServiceTimeInterface;
        groupServiceTimes.push(gst);
      }
    }
    setVisits(visits);
    setSessions(sessions);
    setVisitSessions(visitSessions);
  }

  const loadServiceTimes = (data: any) => {
    let campuses: ImportCampusInterface[] = [];
    let services: ImportServiceInterface[] = [];
    let serviceTimes: ImportServiceTimeInterface[] = [];

    for (let i = 0; i < data.length; i++) if (data[i].time !== undefined) {
      let campus = ImportHelper.getOrCreateCampus(campuses, data[i].campus);
      let service = ImportHelper.getOrCreateService(services, data[i].service, campus);
      ImportHelper.getOrCreateServiceTime(serviceTimes, data[i], service);
    }
    setCampuses(campuses);
    setServices(services);
    setServiceTimes(serviceTimes);
    return serviceTimes;
  }

  const loadGroups = (data: any) => {
    let groups: ImportGroupInterface[] = [];
    let groupServiceTimes: ImportGroupServiceTimeInterface[] = [];

    for (let i = 0; i < data.length; i++) if (data[i].name !== undefined) {
      let group = ImportHelper.getOrCreateGroup(groups, data[i]);
      if (group !== null && group.serviceTimeKey !== undefined && group.serviceTimeKey !== null) {
        let gst = { groupKey: group.importKey, serviceTimeKey: group.serviceTimeKey } as ImportGroupServiceTimeInterface;
        groupServiceTimes.push(gst);
      }
    }
    setGroups(groups);
    setGroupServiceTimes(groupServiceTimes);
    return groups;
  }

  const loadGroupMembers = (data: any) => {
    let members: ImportGroupMemberInterface[] = [];
    for (let i = 0; i < data.length; i++) if (data[i].groupKey !== undefined) members.push(data[i] as ImportGroupMemberInterface);
    setGroupMembers(members);
  }

  const loadPeople = (data: any, zip: any) => {
    let people: ImportPersonInterface[] = [];
    let households: ImportHouseholdInterface[] = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].lastName !== undefined) {
        const p = data[i] as ImportPersonInterface;
        p.name = { first: data[i].firstName, last: data[i].lastName, middle: data[i].middleName, nick: data[i].nickName, display: data[i].displayName }
        p.contactInfo = { address1: data[i].address1, address2: data[i].address2, city: data[i].city, state: data[i].state, zip: data[i].zip, homePhone: data[i].homePhone, workPhone: data[i].workPhone, email: data[i].email }

        assignHousehold(households, data[i]);
        if (p.photo !== undefined) {
          zip?.file(p.photo)?.async("base64").then((data: any) => {
            if (data) {
              p.photo = "data:image/png;base64," + data;
              setTriggerRender(Math.random());
            }
          });
        }
        people.push(p);
      }
    }
    setPeople(people);
    setHouseholds(households);
    return people;
  }

  const assignHousehold = (households: ImportHouseholdInterface[], person: any) => {
    let householdName: string = person.householdName;
    if (households.length === 0 || households[households.length - 1].name !== householdName) households.push({ name: householdName, importKey: (households.length + 1).toString() } as ImportHouseholdInterface);
    person.householdKey = households[households.length - 1].importKey;
  }

  const getAction = () => {
    if (people.length === 0) return (
      <InputBox headerText="Import" headerIcon="fas fa-upload" saveText="Upload and Preview" saveFunction={() => { document.getElementById("fileUpload").click(); }}>
        Select a files to Upload.  You can download sample files <a href="/sampleimport.zip">here</a>.
        <input type="file" onChange={handleUpload} id="fileUpload" accept=".zip" style={{ display: "none" }} />
      </InputBox>
    );
    else return (<ImportStatus importData={getData()} />);
  }

  const getData = () => ({
    people: people, households: households,
    campuses: campuses, services: services, serviceTimes: serviceTimes,
    groupServiceTimes: groupServiceTimes, groups: groups, groupMembers: groupMembers,
    visits: visits, sessions: sessions, visitSessions: visitSessions,
    batches: batches, donations: donations, funds: funds, fundDonations: fundDonations,
    forms: forms, questions: questions, formSubmissions: formSubmissions, answers: answers
  } as ImportDataInterface)

  if (!UserHelper.checkAccess(Permissions.accessApi.settings.edit)) return (<></>);
  return (
    <>
      <h1><i className="fas fa-upload"></i> Import Data</h1>
      <Row>
        <Col lg={8}><ImportPreview importData={getData()} triggerRender={triggerRender} /></Col>
        <Col lg={4}>{getAction()}</Col>
      </Row>
    </>
  );
}

