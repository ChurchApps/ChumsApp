import React from "react";
import { Link } from "react-router-dom";
import { Accordion, Card, Button } from "react-bootstrap";
import { DateHelper, ApiHelper, DisplayBox } from ".";

export const DonationEvents: React.FC = () => {
  const [errorLogs, setErrorLogs] = React.useState<any>([]);
  const [people, setPeople] = React.useState([]);

  const loadData = () => {
    ApiHelper.get("/eventLog/type/failed", "GivingApi").then(logs => {
      setErrorLogs(logs);
      let personIds = "";
      logs.map((log: any) => personIds += log.personId + ",");
      if (personIds) ApiHelper.get("/people/ids?ids=" + personIds, "MembershipApi").then(people => setPeople(people));
    });
  }

  const handleClick = (id: string, resolved: boolean) => {
    resolved = !resolved;
    ApiHelper.post("/eventLog", [{id, resolved}], "GivingApi").then(data => loadData());
  }

  const getPersonName = (personId: string) => {
    const person = people.find((person: any) => person.id === personId);
    console.log(people, personId);
    return person?.name?.display;
  }

  const getErrorLogs = () => {
    let logs: React.ReactNode[] = [];
    errorLogs.forEach((log: any, i: string) => {
      i = i.toString();
      let eventType = log.eventType.replace(".", " ");
      let className = "pointer";
      if (!log.resolved) className += " danger-text";
      logs.push(
        <Accordion key={i}>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={i} style={{padding: "10px"}} className={className}>
              <span className="capitalize">{eventType}</span>
              <i style={{float: "right"}} className="fa fa-chevron-down"></i>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i}>
              <Card.Body>
                <ul>
                  <li>Person: <Link to={"/people/" + log.personId.toString()}>{getPersonName(log.personId)}</Link></li>
                  <li className="capitalize">Event: <a href={"https://dashboard.stripe.com/events/" + log.id}>{eventType}</a></li>
                  <li>Date: {DateHelper.prettyDate(log.created)}</li>
                  <li>Message: {log.message}</li>
                  <li style={{float: "right"}}>
                    <Button variant={log.resolved ? "secondary" : "primary"} onClick={() => handleClick(log.id, log.resolved)}>
                      Mark as { log.resolved ? "Unresolved" : "Resolved" }
                    </Button>
                  </li>
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    });
    return logs;
  }

  React.useEffect(() => loadData(), []);

  if(!errorLogs.length) return null;
  return (
    <DisplayBox id="eventLogs" headerIcon="fas fa-exclamation-circle" headerText="Failed Donations">
      {getErrorLogs()}
    </DisplayBox>
  );
}

