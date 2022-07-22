import React from "react";
import { Link } from "react-router-dom";
import { DateHelper, ApiHelper, DisplayBox } from ".";
import { Accordion, AccordionDetails, AccordionSummary, Button, Icon } from "@mui/material";
import useMountedState from "../../appBase/hooks/useMountedState";

export const DonationEvents: React.FC = () => {
  const [headerIcon, setHeaderIcon] = React.useState<string>("error");
  const [unresolvedErrorCount, setUnresolvedErrorCount] = React.useState<number>();
  const [errorLogs, setErrorLogs] = React.useState<any>([]);
  const [people, setPeople] = React.useState([]);
  const isMounted = useMountedState();

  const loadData = () => {
    ApiHelper.get("/eventLog/type/failed", "GivingApi").then(logs => {
      if(!isMounted()) {
        return;
      }
      setErrorLogs(logs);
      if (logs?.length > 0) {
        const unresolvedCount = logs.filter((log: any) => !log.resolved).length;
        setUnresolvedErrorCount(unresolvedCount);
        if (unresolvedCount > 0) setHeaderIcon(headerIcon + " danger-text");
      }
      let personIds = "";
      logs.map((log: any) => personIds += log.personId + ",");
      if (personIds) ApiHelper.get("/people/ids?ids=" + personIds, "MembershipApi").then(people => {
        if(isMounted()) {
          setPeople(people);
        }
      });
    });
  }

  const handleClick = (id: string, resolved: boolean) => {
    resolved = !resolved;
    ApiHelper.post("/eventLog", [{ id, resolved }], "GivingApi").then(data => loadData());
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
      logs.push(
        <Accordion key={i}>
          <AccordionSummary>
            <Icon sx={{marginRight: "5px", color: !log.resolved ? "#dc3545" : "#000"}}>error</Icon>
            <span className="capitalize">{eventType}</span> - {DateHelper.prettyDate(log.created)}
          </AccordionSummary>
          <AccordionDetails>
            <ul>
              <li>Person: <Link to={"/people/" + log.personId.toString()}>{getPersonName(log.personId)}</Link></li>
              <li className="capitalize">Event: <a href={"https://dashboard.stripe.com/events/" + log.id}>{eventType}</a></li>
              <li>Message: {log.message}</li>
              <li style={{ float: "right" }}>
                <Button aria-label="resolve-button" variant={log.resolved ? "outlined" : "contained"} onClick={() => handleClick(log.id, log.resolved)}>
                  Mark as {log.resolved ? "Unresolved" : "Resolved"}
                </Button>
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>
      );
    });
    return logs;
  }

  React.useEffect(loadData, []); //eslint-disable-line

  if (!errorLogs.length) return null;

  return (
    <DisplayBox data-cy="eventLogs" headerIcon={headerIcon} headerText={"Failed Donations - " + unresolvedErrorCount + " unresolved"}>
      {getErrorLogs()}
    </DisplayBox>
  );
}

