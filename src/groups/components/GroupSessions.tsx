import React from "react";
import { ApiHelper, GroupInterface, DisplayBox, SessionInterface, VisitSessionInterface, PersonInterface, PersonHelper, VisitInterface, UserHelper, ExportLink, Permissions, Loading } from ".";
import { Table, Button, InputGroup, FormControl } from "react-bootstrap";
import { ArrayHelper } from "../../helpers";
import { Icon } from "@mui/material";

interface Props {
  group: GroupInterface,
  sidebarVisibilityFunction: (name: string, visible: boolean) => void,
  addedSession: SessionInterface,
  addedPerson: PersonInterface,
  addedCallback?: () => void
}

export const GroupSessions: React.FC<Props> = (props) => {
  const [visitSessions, setVisitSessions] = React.useState<VisitSessionInterface[]>([]);
  const [people, setPeople] = React.useState<PersonInterface[]>([]);
  const [sessions, setSessions] = React.useState<SessionInterface[]>([]);
  const [session, setSession] = React.useState<SessionInterface>(null);

  const loadAttendance = React.useCallback(() => {
    ApiHelper.get("/visitsessions?sessionId=" + session.id, "AttendanceApi").then((vs: VisitSessionInterface[]) => {
      setVisitSessions(vs);
      const peopleIds = ArrayHelper.getUniqueValues(vs, "visit.personId");
      ApiHelper.get("/people/ids?ids=" + escape(peopleIds.join(",")), "MembershipApi").then(data => setPeople(data));
    });
  }, [session]);

  const loadSessions = React.useCallback(() => {
    ApiHelper.get("/sessions?groupId=" + props.group.id, "AttendanceApi").then(data => {
      setSessions(data);
      if (data.length > 0) setSession(data[0]);
    });
  }, [props.group]);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let personId = anchor.getAttribute("data-personid");
    ApiHelper.delete("/visitsessions?sessionId=" + session.id + "&personId=" + personId, "AttendanceApi").then(loadAttendance);
  }

  const handleAdd = (e: React.MouseEvent) => { e.preventDefault(); props.sidebarVisibilityFunction("addSession", true); }

  const getRows = () => {
    let canEdit = UserHelper.checkAccess(Permissions.attendanceApi.attendance.edit);
    let result: JSX.Element[] = [];
    for (let i = 0; i < visitSessions.length; i++) {
      let vs = visitSessions[i];
      let editLink = (canEdit) ? (<a href="about:blank" onClick={handleRemove} className="text-danger" data-personid={vs.visit.personId}><Icon>person_remove</Icon> Remove</a>) : null;
      let person = ArrayHelper.getOne(people, "id", vs.visit.personId);
      if (person) {
        result.push(
          <tr key={vs.id}>
            <td><img className="personPhoto" src={PersonHelper.getPhotoUrl(person)} alt="avatar" /></td>
            <td><a className="personName" href={"/people/person.aspx?id=" + vs.visit.personId}>{person?.name?.display}</a></td>
            <td>{editLink}</td>
          </tr>
        );
      }
    }
    return result;
  }

  const selectSession = (e: React.ChangeEvent<HTMLSelectElement>) => {
    for (let i = 0; i < sessions.length; i++) if (sessions[i].id === e.currentTarget.value) setSession(sessions[i]);
  }

  const getSessionOptions = () => {
    let result: JSX.Element[] = [];
    for (let i = 0; i < sessions.length; i++) result.push(<option value={sessions[i].id} key={sessions[i].id}>{sessions[i].displayName}</option>);
    return result;
  }

  const getHeaderSection = () => {
    if (!UserHelper.checkAccess(Permissions.attendanceApi.attendance.edit)) return null;
    else return (
      <InputGroup>
        <FormControl as="select" value={session?.id} onChange={selectSession}>{getSessionOptions()}</FormControl>
        <InputGroup.Append><Button variant="primary" onClick={handleAdd} data-cy="create-new-session"><i className="far fa-calendar-alt"></i> New</Button></InputGroup.Append>
      </InputGroup>
    );
  }

  const handleSessionSelected = React.useCallback(() => {
    if (session !== null) {
      loadAttendance();
      props.sidebarVisibilityFunction("addPerson", true);
    }
  }, [props, loadAttendance, session])

  const handlePersonAdd = React.useCallback(() => {
    let v = { checkinTime: new Date(), personId: props.addedPerson.id, visitSessions: [{ sessionId: session.id }] } as VisitInterface;
    ApiHelper.post("/visitsessions/log", v, "AttendanceApi").then(() => { loadAttendance(); });
    props.addedCallback();
  }, [props, loadAttendance, session]);

  React.useEffect(() => { if (props.group.id !== undefined) { loadSessions() }; props.addedCallback(); }, [props.group, props.addedSession, loadSessions, props]);

  React.useEffect(() => { if (props.addedPerson?.id !== undefined) { handlePersonAdd() } }, [props.addedPerson, handlePersonAdd]);

  React.useEffect(() => { handleSessionSelected(); }, [session, handleSessionSelected]);

  let content = <Loading />;
  if (sessions) {
    if (sessions.length === 0) content = <div className="alert alert-warning" role="alert" data-cy="no-session-msg"><b>There are no sessions.</b>  Please add a new session to continue.</div>
    else content = (<>
      <span className="float-right"><ExportLink data={visitSessions} spaceAfter={true} filename="visits.csv" /></span>
      <b data-cy="session-present-msg">Attendance for {props.group.name}</b>
      <Table id="groupMemberTable">
        <thead><tr><th></th><th>Name</th><th></th></tr></thead>
        <tbody>{getRows()}</tbody>
      </Table>
    </>);
  }

  return (<DisplayBox id="groupSessionsBox" data-cy="group-session-box" headerText="Sessions" headerIcon="far fa-calendar-alt" editContent={getHeaderSection()}>{content}</DisplayBox>);
}

