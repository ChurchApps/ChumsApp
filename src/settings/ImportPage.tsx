import React from "react";
import { UserHelper, ImportPreview, ImportHelper, InputBox, UploadHelper, ImportStatus, Permissions } from "./components";
import {
    ImportPersonInterface, ImportHouseholdInterface
    , ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface
    , ImportGroupInterface, ImportGroupMemberInterface, ImportGroupServiceTimeInterface
    , ImportVisitInterface, ImportSessionInterface, ImportVisitSessionInterface
    , ImportDonationBatchInterface, ImportFundInterface, ImportDonationInterface
    , ImportFundDonationInterface, ImportDataInterface, ImportFormsInterface
    , ImportQuestionsInterface
} from "../helpers/ImportHelper";
import { Row, Col } from "react-bootstrap";
import AdmZip from "adm-zip";

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

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target) {
            var file = e.target.files[0];
            readZip(file);
        }
    }

    const readZip = async (file: File) => {
        var buffer = new Buffer(await file.arrayBuffer());
        var zip = new AdmZip(buffer)
        var entries = zip.getEntries();
        runImports(entries)
    }

    const runImports = async (files: AdmZip.IZipEntry[]) => {
        loadPeople(UploadHelper.readZippedCsv(files, "people.csv"), files);
        var tmpServiceTimes = loadServiceTimes(UploadHelper.readZippedCsv(files, "services.csv"));
        loadGroups(UploadHelper.readZippedCsv(files, "groups.csv"));
        loadGroupMembers(UploadHelper.readZippedCsv(files, "groupmembers.csv"));
        loadAttendance(UploadHelper.readZippedCsv(files, "attendance.csv"), tmpServiceTimes);
        loadDonations(UploadHelper.readZippedCsv(files, "donations.csv"));
        loadForms(UploadHelper.readZippedCsv(files, "forms.csv"));
        loadQuestions(UploadHelper.readZippedCsv(files, "questions.csv"));
    }

    const loadQuestions = (data: any) => {
        var questions: ImportQuestionsInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].title !== undefined) {
            questions.push(data[i]);
        }

        setQuestions(questions);
    }

    const loadForms = (data: any) => {
        var forms: ImportFormsInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].name !== undefined) {
            forms.push(data[i]);
        }

        setForms(forms);
    }

    const loadDonations = (data: any) => {
        var batches: ImportDonationBatchInterface[] = [];
        var funds: ImportFundInterface[] = [];
        var donations: ImportDonationInterface[] = [];
        var fundDonations: ImportFundDonationInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].amount !== undefined) {
            var d = data[i];
            var batch = ImportHelper.getOrCreateBatch(batches, d.batch, new Date(d.date));
            var fund = ImportHelper.getOrCreateFund(funds, d.fund);
            var donation = { importKey: (donations.length + 1).toString(), batchKey: batch.importKey, personKey: d.personKey, donationDate: new Date(d.date), amount: Number.parseFloat(d.amount), method: d.method, methodDetails: d.methodDetails, notes: d.notes } as ImportDonationInterface;
            var fundDonation = { donationKey: donation.importKey, fundKey: fund.importKey, amount: Number.parseFloat(d.amount) } as ImportFundDonationInterface;
            donations.push(donation);
            fundDonations.push(fundDonation);
        }

        setBatches(batches)
        setFunds(funds);
        setDonations(donations);
        setFundDonations(fundDonations);
    }

    const loadAttendance = (data: any, tmpServiceTimes: ImportServiceTimeInterface[]) => {
        var sessions: ImportSessionInterface[] = [];
        var visits: ImportVisitInterface[] = [];
        var visitSessions: ImportVisitSessionInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].personKey !== undefined && data[i].groupKey !== undefined) {
            var session = ImportHelper.getOrCreateSession(sessions, new Date(data[i].date), data[i].groupKey, data[i].serviceTimeKey);
            var visit = ImportHelper.getOrCreateVisit(visits, data[i], tmpServiceTimes);
            var visitSession = { visitKey: visit.importKey, sessionKey: session.importKey } as ImportVisitSessionInterface;
            visitSessions.push(visitSession);

            var group = ImportHelper.getOrCreateGroup(groups, data[i]);
            if (group !== null && group.serviceTimeKey !== undefined && group.serviceTimeKey !== null) {
                var gst = { groupKey: group.importKey, serviceTimeKey: group.serviceTimeKey } as ImportGroupServiceTimeInterface;
                groupServiceTimes.push(gst);
            }
        }
        setVisits(visits);
        setSessions(sessions);
        setVisitSessions(visitSessions);
    }


    const loadServiceTimes = (data: any) => {
        var campuses: ImportCampusInterface[] = [];
        var services: ImportServiceInterface[] = [];
        var serviceTimes: ImportServiceTimeInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].time !== undefined) {
            var campus = ImportHelper.getOrCreateCampus(campuses, data[i].campus);
            var service = ImportHelper.getOrCreateService(services, data[i].service, campus);
            ImportHelper.getOrCreateServiceTime(serviceTimes, data[i], service);
        }
        setCampuses(campuses);
        setServices(services);
        setServiceTimes(serviceTimes);
        return serviceTimes;
    }

    const loadGroups = (data: any) => {
        var groups: ImportGroupInterface[] = [];
        var groupServiceTimes: ImportGroupServiceTimeInterface[] = [];

        for (let i = 0; i < data.length; i++) if (data[i].name !== undefined) {
            var group = ImportHelper.getOrCreateGroup(groups, data[i]);
            if (group !== null && group.serviceTimeKey !== undefined && group.serviceTimeKey !== null) {
                var gst = { groupKey: group.importKey, serviceTimeKey: group.serviceTimeKey } as ImportGroupServiceTimeInterface;
                groupServiceTimes.push(gst);
            }
        }
        setGroups(groups);
        setGroupServiceTimes(groupServiceTimes);
        return groups;
    }

    const loadGroupMembers = (data: any) => {
        var members: ImportGroupMemberInterface[] = [];
        for (let i = 0; i < data.length; i++) if (data[i].groupKey !== undefined) members.push(data[i] as ImportGroupMemberInterface);
        setGroupMembers(members);
    }

    const loadPeople = (data: any, allFiles: AdmZip.IZipEntry[]) => {
        var people: ImportPersonInterface[] = [];
        var households: ImportHouseholdInterface[] = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].lastName !== undefined) {
                const p = data[i] as ImportPersonInterface;
                p.name = { first: data[i].firstName, last: data[i].lastName, middle: data[i].middleName, nick: data[i].nickName, display: data[i].displayName }
                p.contactInfo = { address1: data[i].address1, address2: data[i].address2, city: data[i].city, state: data[i].state, zip: data[i].zip, homePhone: data[i].homePhone, workPhone: data[i].workPhone, email: data[i].email }

                assignHousehold(households, data[i]);
                if (p.photo !== undefined) UploadHelper.readZippedImage(allFiles, p.photo).then((url: string) => {
                    p.photo = url; setTriggerRender(Math.random());
                });
                people.push(p);
            }
        }
        setPeople(people);
        setHouseholds(households);
        return people;
    }

    const assignHousehold = (households: ImportHouseholdInterface[], person: any) => {
        var householdName: string = person.householdName;
        if (households.length === 0 || households[households.length - 1].name !== householdName) households.push({ name: householdName, importKey: (households.length + 1).toString() } as ImportHouseholdInterface);
        person.householdKey = households[households.length - 1].importKey;
    }


    const getAction = () => {
        if (people.length === 0) return (
            <InputBox headerText="Import" headerIcon="fas fa-upload" saveText="Upload and Preview" saveFunction={() => { document.getElementById("fileUpload").click(); }} >
                Select a files to Upload.  You can download sample files <a href="/sampleimport.zip">here</a>.
                <input type="file" onChange={handleUpload} id="fileUpload" accept=".zip" style={{ display: "none" }} />
            </InputBox>
        );
        else return (<ImportStatus importData={getData()} />);
    }

    const getData = () => {
        return {
            people: people, households: households,
            campuses: campuses, services: services, serviceTimes: serviceTimes,
            groupServiceTimes: groupServiceTimes, groups: groups, groupMembers: groupMembers,
            visits: visits, sessions: sessions, visitSessions: visitSessions,
            batches: batches, donations: donations, funds: funds, fundDonations: fundDonations,
            forms: forms, questions: questions
        } as ImportDataInterface

    }

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

