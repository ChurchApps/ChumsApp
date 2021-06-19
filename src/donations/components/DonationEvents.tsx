import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Helper, ApiHelper, DisplayBox } from ".";

export const DonationEvents: React.FC = () => {
  const [errorLogs, setErrorLogs] = React.useState<any>([]);
  const [people, setPeople] = React.useState<any>([]);

  const loadData = () => {
      ApiHelper.get("/eventLog/type/failed", "GivingApi").then(logs => {
        setErrorLogs(logs);
          let personIds = '';
          logs.map((log: any) => personIds += log.personId + ',');
          if (personIds) ApiHelper.get("/people/ids?ids=" + personIds, "MembershipApi").then(people => setPeople(people));
      });
  }

  const getPersonName = (personId: string) => {
    const person = people.find((person: any) => person.id === personId);
    console.log(people, personId);
    return person?.name?.display;
  }

  const getRows = () => {
    let rows: React.ReactNode[] = [];
    rows.push(<tr><th>Person</th><th>Event Type</th><th>Message</th><th>Date</th></tr>);
    errorLogs.forEach((log: any) => {
      rows.push(<tr key={log.id}>
        <td><Link to={"/people/" + log.personId.toString()}>{getPersonName(log.personId)}</Link></td>
        <td className="capitalize"><a href={"https://dashboard.stripe.com/test/events/" + log.id}>{log.eventType.replace('.', ' ')}</a></td>
        <td>{log.message}</td>
        <td>{Helper.prettyDate(log.created)}</td>
      </tr>);
    });
    return rows;
  }

  React.useEffect(() => loadData(), []);

  if(!errorLogs.length) return null;
  return (
    <DisplayBox id="eventLogs" headerIcon="fas fa-exclamation-circle" headerText="Failed Donation ">
      <Table>
        <tbody>
          {getRows()}
        </tbody>
      </Table>
    </DisplayBox>
  );
}

