import React from "react";
import { DisplayBox, InputBox, ApiHelper, UploadHelper, ArrayHelper, PersonHelper } from "./components";
import { Row, Col } from "react-bootstrap";
import { ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface, ImportHelper, ImportPersonInterface, ImportGroupInterface, ImportGroupServiceTimeInterface, ImportGroupMemberInterface, ImportDonationBatchInterface, ImportDonationInterface, ImportFundInterface, ImportFundDonationInterface, ImportSessionInterface, ImportVisitInterface, ImportVisitSessionInterface, ImportFormsInterface, ImportQuestionsInterface } from "../helpers/ImportHelper";
import Papa from "papaparse";


export const ExportPage = () => {
    const [exporting, setExporting] = React.useState(false);
    const [status, setStatus] = React.useState<any>({});
    var progress: any = {};

    var people: ImportPersonInterface[] = [];

    var campuses: ImportCampusInterface[] = [];
    var services: ImportServiceInterface[] = [];
    var serviceTimes: ImportServiceTimeInterface[] = [];

    var groups: ImportGroupInterface[] = [];
    var groupServiceTimes: ImportGroupServiceTimeInterface[] = [];
    var groupMembers: ImportGroupMemberInterface[] = [];

    var funds: ImportFundInterface[] = [];
    var donationBatches: ImportDonationBatchInterface[] = [];
    var donations: ImportDonationInterface[] = [];
    var fundDonations: ImportFundDonationInterface[] = [];

    var sessions: ImportSessionInterface[] = [];
    var visits: ImportVisitInterface[] = [];
    var visitSessions: ImportVisitSessionInterface[] = [];

    var forms: ImportFormsInterface[] = [];
    var questions: ImportQuestionsInterface[] = [];

    const setProgress = (name: string, status: string) => {
        progress[name] = status;
        setStatus({ ...progress });
    }

    const getProgress = (name: string) => {
        if (status[name] === undefined) return (<li className="pending" key={name}>{name}</li>);
        else return (<li className={status[name]} key={name}>{name}</li>);
    }

    const getExportSteps = () => {
        if (!exporting) return null;
        else {
            var steps = ["Campuses/Services/Times", "People", "Photos", "Groups", "Group Members", "Donations", "Attendance", "Forms", "Questions", "Compressing"];
            var stepsHtml: JSX.Element[] = [];
            steps.forEach((s) => stepsHtml.push(getProgress(s)));

            return (
                <DisplayBox headerText="Export" headerIcon="fas fa-download">
                    Exporting content:
                    <ul className="statusList">{stepsHtml}</ul>
                    <p>This process may take some time.  It is important that you do not close your browser until it has finished.</p>
                </DisplayBox>
            );
        }
    }

    const getCampusServiceTimes = async () => {
        setProgress("Campuses/Services/Times", "running");
        var promises = []
        promises.push(ApiHelper.get("/campuses", "AttendanceApi").then(data => campuses = data));
        promises.push(ApiHelper.get("/services", "AttendanceApi").then(data => services = data));
        promises.push(ApiHelper.get("/servicetimes", "AttendanceApi").then(data => serviceTimes = data));
        await Promise.all(promises);
        var data: any[] = [];
        serviceTimes.forEach((st) => {
            var service: ImportServiceInterface = ImportHelper.getById(services, st.serviceId);
            var campus: ImportCampusInterface = ImportHelper.getById(campuses, service.campusId);
            var row = {
                importKey: st.id,
                campus: campus.name,
                service: service.name,
                time: st.name
            }
            data.push(row);
        });
        setProgress("Campuses/Services/Times", "complete");
        return Papa.unparse(data);
    }

    const getPeople = async () => {
        setProgress("People", "running");
        people = await ApiHelper.get("/people", "MembershipApi");
        var data: any[] = [];
        people.forEach((p) => {
            var row = {
                importKey: p.id,
                household: p.name.last,
                lastName: p.name.last, firstName: p.name.first, middleName: p.name.middle, nickName: p.name.nick,
                birthDate: p.birthDate, gender: p.gender, maritalStatus: p.maritalStatus, membershipStatus: p.membershipStatus,
                homePhone: p.contactInfo.homePhone, mobilePhone: p.contactInfo.mobilePhone, workPhone: p.contactInfo.workPhone, email: p.contactInfo.email,
                address1: p.contactInfo.address1, address2: p.contactInfo.address2, city: p.contactInfo.city, state: p.contactInfo.state, zip: p.contactInfo.zip,
                photo: (p.photoUpdated === undefined) ? "" : p.id.toString() + ".png"
            }
            data.push(row);
        });
        setProgress("People", "complete");
        return Papa.unparse(data);
    }

    const getGroups = async () => {
        setProgress("Groups", "running");
        var promises = []
        promises.push(ApiHelper.get("/groups", "MembershipApi").then(data => groups = data));
        promises.push(ApiHelper.get("/groupserviceTimes", "AttendanceApi").then(data => groupServiceTimes = data));
        await Promise.all(promises);
        var data: any[] = [];
        groups.forEach((g) => {
            var serviceTimeIds: string[] = [];
            var gst: ImportGroupServiceTimeInterface[] = ArrayHelper.getAll(groupServiceTimes, "groupId", g.id);
            if (gst.length === 0) serviceTimeIds = [""];
            else gst.forEach((time) => { serviceTimeIds.push(time.serviceTimeId.toString()) });
            serviceTimeIds.forEach((serviceTimeId) => {
                var row = {
                    importKey: g.id,
                    serviceTimeKey: serviceTimeId,
                    categoryName: g.categoryName,
                    name: g.name,
                    trackAttendance: g.trackAttendance ? "TRUE" : "FALSE"
                }
                data.push(row);
            });
        });
        setProgress("Groups", "complete");
        return Papa.unparse(data);
    }

    const getForms = async () => {
        setProgress("Forms", "running");
        
        forms = await ApiHelper.get("/forms", "MembershipApi");
        var data: any[] = [];
        forms.forEach((f) => {
            var row = {
                importKey: f.id,
                name: f.name,
                contentType: f.contentType
            }
            data.push(row);
        })
        setProgress("Forms", "complete");
        return Papa.unparse(data);
    }

    const getQuestions = async () => {
        setProgress("Questions", "running");

        questions = await ApiHelper.get("/questions", "MembershipApi");
        var data: any[] = [];
        questions.forEach(q => {
            var row = {
                importKey: q.id,
                formId: q.formId,
                fieldType: q.fieldType,
                title: q.title
            }
            data.push(row);
        })

        setProgress("Questions", "complete");
        return Papa.unparse(data);
    }

    const getGroupMembers = async () => {
        setProgress("Group Members", "running");
        groupMembers = await ApiHelper.get("/groupmembers", "MembershipApi");
        var data: any[] = [];
        groupMembers.forEach((gm) => {
            var row = { groupKey: gm.groupId, personKey: gm.personId }
            data.push(row);
        });
        setProgress("Group Members", "complete");
        return Papa.unparse(data);
    }

    const getDonations = async () => {
        setProgress("Donations", "running");
        var promises = []
        promises.push(ApiHelper.get("/funds", "GivingApi").then(data => funds = data));
        promises.push(ApiHelper.get("/donationbatches", "GivingApi").then(data => donationBatches = data));
        promises.push(ApiHelper.get("/donations", "GivingApi").then(data => donations = data));
        promises.push(ApiHelper.get("/funddonations", "GivingApi").then(data => fundDonations = data));
        await Promise.all(promises);
        var data: any[] = [];
        fundDonations.forEach((fd) => {
            var fund: ImportFundInterface = ImportHelper.getById(funds, fd.fundId);
            var donation: ImportDonationInterface = ImportHelper.getById(donations, fd.donationId);
            var batch: ImportDonationBatchInterface = ImportHelper.getById(donationBatches, donation.batchId);
            var row = {
                batch: batch.id,
                date: donation.donationDate,
                personKey: donation.personId,
                method: donation.method,
                methodDetails: donation.methodDetails,
                amount: donation.amount,
                fund: fund.name,
                notes: donation.notes
            }
            data.push(row);
        });
        setProgress("Donations", "complete");
        return Papa.unparse(data);
    }

    const getAttendance = async () => {
        setProgress("Attendance", "running");
        var promises = []
        promises.push(ApiHelper.get("/sessions", "AttendanceApi").then(data => sessions = data));
        promises.push(ApiHelper.get("/visits", "AttendanceApi").then(data => visits = data));
        promises.push(ApiHelper.get("/visitsessions", "AttendanceApi").then(data => visitSessions = data));
        await Promise.all(promises);
        var data: any[] = [];
        visitSessions.forEach((vs) => {
            var visit: ImportVisitInterface = ImportHelper.getById(visits, vs.visitId);
            var session: ImportSessionInterface = ImportHelper.getById(sessions, vs.sessionId);
            var row = {
                date: visit.visitDate,
                serviceTimeKey: session.serviceTimeId,
                groupKey: session.groupId,
                personKey: visit.personId
            }
            data.push(row);
        });
        setProgress("Attendance", "complete");
        return Papa.unparse(data);
    }



    const getPhotos = (files: { name: string, contents: string | Buffer }[]) => {
        setProgress("Photos", "running");
        var result: Promise<any>[] = [];
        people.forEach(async (p) => {
            if (p.photoUpdated !== undefined) result.push(UploadHelper.downloadImageBytes(files, p.id.toString() + ".png", PersonHelper.getPhotoUrl(p)));
        })
        Promise.all(result);
        setProgress("Photos", "complete");
    }

    const startExport = async () => {
        setExporting(true);
        var files = [];
        files.push({ name: "services.csv", contents: await getCampusServiceTimes() });
        files.push({ name: "people.csv", contents: await getPeople() });
        getPhotos(files);
        files.push({ name: "groups.csv", contents: await getGroups() });
        files.push({ name: "groupmembers.csv", contents: await getGroupMembers() });
        files.push({ name: "donations.csv", contents: await getDonations() });
        files.push({ name: "attendance.csv", contents: await getAttendance() });
        files.push({ name: "forms.csv", contents: await getForms() });
        files.push({ name: "questions.csv", contents: await getQuestions() });
        setProgress("Compressing", "running");
        UploadHelper.zipFiles(files, "export.zip");
        setProgress("Compressing", "complete");
    }

    return (
        <>
            <h1><i className="fas fa-download"></i> Export</h1>
            <Row>
                <Col lg={8}>
                    <InputBox headerIcon="fas fa-download" headerText="Export" saveText="Start Export" saveFunction={startExport}>
                        <p>You can use this tool to export all of your data as a single zip file to either make an offline backup or migrate to another system.  This process can take some time.</p>
                    </InputBox>
                </Col>
                <Col lg={4}>{getExportSteps()}</Col>
            </Row>
        </>
    );
}

