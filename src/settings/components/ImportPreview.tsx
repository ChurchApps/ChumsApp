import React from "react";
import { Table, Tabs, Tab, Alert } from "react-bootstrap";
import { DisplayBox, ImportHelper, DateHelper, CurrencyHelper } from ".";
import { ImportGroupInterface, ImportPersonInterface, ImportDonationBatchInterface, ImportDonationInterface, ImportFundInterface, ImportDataInterface } from "../../helpers/ImportHelper";

interface Props { importData: ImportDataInterface, triggerRender: number }

export const ImportPreview: React.FC<Props> = (props) => {
  let x: number;
  let y: number;
  let d: number;
  let f: number;
  let n: number;

  const getPeopleTable = () => {
    if (props.importData.households.length === 0) return null;
    else {
      if (props.triggerRender > -1) {                       //This line is just to trigger re-render when a photo is downloaded
        let rows = [];
        for (let i = 0; i < props.importData.households.length; i++) {
          x = i;
          let m = props.importData.households.length;
          rows.push(<tr key={x}><td colSpan={3}><i>{props.importData.households[i].name} Household</i></td></tr>);
          let members = ImportHelper.getHouseholdMembers(props.importData.households[i].importKey, props.importData.people);
          for (let j = 0; j < members.length; j++) {
            let loop = i + 1;
            let r = m + j + 1
            y = r * loop;
            let p = members[j];
            let imgTag = (p.photo === undefined) ? null : <img src={p.photo} className="personPhoto" alt="person" />;
            rows.push(<tr key={y}><td>{imgTag}</td><td>{p.name.first}</td><td>{p.name.last}</td></tr>);
          }
        }
        return (<Table>
          <thead><tr><th>Photo</th><th>First Name</th><th>Last Name</th></tr></thead>
          <tbody>{rows}</tbody>
        </Table>);
      }
    }
    return null;
  }

  const getMemberCount = (groupKey: string) => {
    let count = ImportHelper.getGroupMembers(props.importData.groupMembers, groupKey).length;
    return (count === 1) ? "1 member" : count.toString() + " members";
  }

  const getGroupsTable = () => {
    if (props.importData.groups.length === 0) return null;
    else {
      let rows = [];
      for (let i = 0; i < props.importData.campuses.length; i++) {
        let campus = props.importData.campuses[i];
        let filteredServices = ImportHelper.getServices(props.importData.services, campus.importKey);

        for (let j = 0; j < filteredServices.length; j++) {
          let service = filteredServices[j];
          let filteredTimes = ImportHelper.getServiceTimes(props.importData.serviceTimes, service.importKey);

          for (let k = 0; k < filteredTimes.length; k++) {
            let time = filteredTimes[k];
            let filteredGroupServiceTimes = ImportHelper.getGroupServiceTimes(props.importData.groupServiceTimes, time.importKey);

            for (let l = 0; l < filteredGroupServiceTimes.length; l++) {
              let group = ImportHelper.getByImportKey(props.importData.groups, filteredGroupServiceTimes[l].groupKey) as ImportGroupInterface;

              rows.push(<tr key={group.name + Math.random()}><td>{campus.name}</td><td>{service.name}</td><td>{time.name}</td><td>{group.categoryName}</td><td>{group.name}</td><td>{getMemberCount(group.importKey)}</td></tr>);
            }
          }
        }
      }

      for (let i = 0; i < props.importData.groups.length; i++) {
        let groupServiceTimes = ImportHelper.getGroupServiceTimesByGroupKey(props.importData.groupServiceTimes, props.importData.groups[i].importKey);
        if (groupServiceTimes.length === 0) rows.push(<tr key={Math.random() * 10000}><td></td><td></td><td></td><td>{props.importData.groups[i].categoryName}</td><td>{props.importData.groups[i].name}</td><td>{getMemberCount(props.importData.groups[i].importKey)}</td></tr>);
      }

      return (<Table size="sm">
        <thead><tr><th>Campus</th><th>Service</th><th>Time</th><th>Category</th><th>Group</th><th>Members</th></tr></thead>
        <tbody>{rows}</tbody>
      </Table>);
    }
  }

  const getAttendanceTable = () => {

    if (props.importData.sessions.length === 0) return null;
    else {
      let rows = [];
      for (let i = 0; i < props.importData.sessions.length; i++) {
        f = i + d + 1;;
        let session = props.importData.sessions[i];
        let group: ImportGroupInterface = ImportHelper.getByImportKey(props.importData.groups, session.groupKey);
        let vs = ImportHelper.getVisitSessions(props.importData.visitSessions, session.importKey);
        rows.push(<tr key={f}><td>{DateHelper.prettyDate(new Date(session.sessionDate))}</td><td>{group?.name}</td><td>{vs.length}</td></tr>);
      }
      return (<Table>
        <thead><tr><th>Date</th><th>Group</th><th>Visits</th></tr></thead>
        <tbody>{rows}</tbody>
      </Table>);
    }
  }

  const getDonationsTable = () => {
    if (props.importData.fundDonations.length === 0) return null;
    else {
      let rows = [];
      for (let i = 0; i < props.importData.fundDonations.length; i++) {
        n = i + f + 1;
        let fd = props.importData.fundDonations[i];
        let donation: ImportDonationInterface = ImportHelper.getByImportKey(props.importData.donations, fd.donationKey);
        let batch: ImportDonationBatchInterface = ImportHelper.getByImportKey(props.importData.batches, donation.batchKey);
        let fund: ImportFundInterface = ImportHelper.getByImportKey(props.importData.funds, fd.fundKey);
        let person: ImportPersonInterface = ImportHelper.getByImportKey(props.importData.people, donation.personKey);
        let personName = (person === null) ? "" : person.name.first + " " + person.name.last;
        rows.push(<tr key={n}><td>{DateHelper.prettyDate(new Date(donation.donationDate))}</td><td>{batch.name}</td><td>{personName}</td><td>{fund.name}</td><td>{CurrencyHelper.formatCurrency(fd.amount)}</td></tr>);
      }
      return (<Table>
        <thead><tr><th>Date</th><th>Batch</th><th>Person</th><th>Fund</th><th>Amount</th></tr></thead>
        <tbody>{rows}</tbody>
      </Table>);
    }
  }

  const getFormsTable = () => {
    if (props.importData.forms.length === 0) return null;
    else {
      let rows = [];
      for (let i = 0, totalForms = props.importData.forms.length; i < totalForms; i++) {
        let form = props.importData.forms[i];
        rows.push(<tr key={i}><td>{form.name}</td><td>{form.contentType}</td></tr>)
      }
      return (
        <Table>
          <thead><tr><th>Name</th><th>Content Type</th></tr></thead>
          <tbody>{rows}</tbody>
        </Table>
      )
    }
  }

  if (props.importData.people.length === 0) return (<Alert variant="info"><b>Important:</b> This tool is designed to help you load your initial data into the system.  Using it after you have been using Chums for a while is risky and may result in duplicated data.</Alert>);
  else return (<>
    <h2>Preview</h2>
    <Tabs defaultActiveKey="people" id="previewTabs" transition={false}>
      <Tab eventKey="people" title="People"><DisplayBox headerIcon="" headerText="People">{getPeopleTable()}</DisplayBox></Tab>
      <Tab eventKey="groups" title="Groups"><DisplayBox headerIcon="" headerText="Groups">{getGroupsTable()}</DisplayBox></Tab>
      <Tab eventKey="attendance" title="Attendance"><DisplayBox headerIcon="" headerText="Attendance">{getAttendanceTable()}</DisplayBox></Tab>
      <Tab eventKey="donations" title="Donations"><DisplayBox headerIcon="" headerText="Donations">{getDonationsTable()}</DisplayBox></Tab>
      <Tab eventKey="forms" title="Forms"><DisplayBox headerIcon="" headerText="Forms">{getFormsTable()}</DisplayBox></Tab>
    </Tabs>
  </>);
}

