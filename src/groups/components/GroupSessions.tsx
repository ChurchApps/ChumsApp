import React from "react";
import { ApiHelper, GroupInterface, DisplayBox, SessionInterface, VisitSessionInterface, PersonInterface, PersonHelper, VisitInterface, UserHelper, ExportLink, Permissions, Loading } from ".";
import { ArrayHelper } from "../../helpers";
import { Table, TableBody, TableRow, TableCell, TableHead, Icon, FormControl, InputLabel, Select, Button, SelectChangeEvent, Grid, MenuItem } from "@mui/material"
import { SmallButton } from "../../appBase/components";

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

  const handleRemove = (vs: VisitSessionInterface) => {
    ApiHelper.delete("/visitsessions?sessionId=" + session.id + "&personId=" + vs.visit.personId, "AttendanceApi").then(loadAttendance);
  }

  const handleAdd = (e: React.MouseEvent) => { e.preventDefault(); props.sidebarVisibilityFunction("addSession", true); }

  const getRows = () => {
    let canEdit = UserHelper.checkAccess(Permissions.attendanceApi.attendance.edit);
    let result: JSX.Element[] = [];
    for (let i = 0; i < visitSessions.length; i++) {
      const vs = visitSessions[i];
      //let editLink = (canEdit) ? (<a href="about:blank" onClick={handleRemove} className="text-danger" data-personid={vs.visit.personId}><Icon>person_remove</Icon> Remove</a>) : null;
      let editLink = (canEdit) ? <SmallButton icon="person_remove" text="Remove" onClick={() => handleRemove(vs)} color="error" /> : <></>
      let person = ArrayHelper.getOne(people, "id", vs.visit.personId);
      if (person) {
        result.push(
          <TableRow key={vs.id}>
            <TableCell><img className="personPhoto" src={PersonHelper.getPhotoUrl(person)} alt="avatar" /></TableCell>
            <TableCell><a className="personName" href={"/people/person.aspx?id=" + vs.visit.personId}>{person?.name?.display}</a></TableCell>
            <TableCell style={{ textAlign: "right" }}>{editLink}</TableCell>
          </TableRow>
        );
      }
    }
    return result;
  }

  const selectSession = (e: SelectChangeEvent<string>) => {
    for (let i = 0; i < sessions.length; i++) if (sessions[i].id === e.target.value) setSession(sessions[i]);
  }

  const getSessionOptions = () => {
    let result: JSX.Element[] = [];
    for (let i = 0; i < sessions.length; i++) result.push(<MenuItem value={sessions[i].id} key={sessions[i].id}>{sessions[i].displayName}</MenuItem>);
    return result;
  }

  const getHeaderSection = () => {
    if (!UserHelper.checkAccess(Permissions.attendanceApi.attendance.edit)) return null;
    else return (
      <Grid container columnSpacing={2}>
        <Grid item>
          <FormControl style={{ width: 140, marginTop: 0 }} size="small">
            <InputLabel id="sessions">Session</InputLabel>
            <Select fullWidth labelId="sessions" label="Session" value={session?.id} onChange={selectSession}>
              {getSessionOptions()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button variant="contained" data-cy="add-service-time" onClick={handleAdd}><Icon>calendar_month</Icon> New</Button>
        </Grid>
      </Grid>
    );
    /*else return (
      <InputGroup>
        <FormControl as="select" value={session?.id} onChange={selectSession}>{getSessionOptions()}</FormControl>
        <InputGroup.Append><Button variant="primary" onClick={handleAdd} data-cy="create-new-session"><Icon>calendar_month</Icon> New</Button></InputGroup.Append>
      </InputGroup>
    );*/
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
        <TableHead><TableRow><th></th><th>Name</th><th></th></TableRow></TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>
    </>);
  }

  return (<DisplayBox id="groupSessionsBox" data-cy="group-session-box" headerText="Sessions" headerIcon="calendar_month" editContent={getHeaderSection()}>{content}</DisplayBox>);
}

