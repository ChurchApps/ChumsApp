import React from "react";
import { ApiHelper, ArrayHelper, GroupInterface, DisplayBox, SessionInterface, VisitSessionInterface, PersonInterface, PersonHelper, VisitInterface, UserHelper, ExportLink, Permissions, Loading, SmallButton, Locale } from "@churchapps/apphelper";
import { Table, TableBody, TableRow, TableCell, TableHead, Icon, FormControl, InputLabel, Select, Button, Grid, MenuItem, type SelectChangeEvent } from "@mui/material"

interface Props {
  group: GroupInterface,
  sidebarVisibilityFunction: (name: string, visible: boolean) => void,
  addedSession: SessionInterface,
  addedPerson: PersonInterface,
  addedCallback?: (personId: string) => void,
  setHiddenPeople?: (peopleIds: string[]) => void
}

export const GroupSessions: React.FC<Props> = (props) => {
  const [visitSessions, setVisitSessions] = React.useState<VisitSessionInterface[]>([]);
  const [people, setPeople] = React.useState<PersonInterface[]>([]);
  const [sessions, setSessions] = React.useState<SessionInterface[]>([]);
  const [session, setSession] = React.useState<SessionInterface>(null);
  const [downloadData, setDownloadData] = React.useState<any[]>([]);

  const loadAttDownloadData = () => {
    ApiHelper.get("/visitsessions/download/" + session?.id, "AttendanceApi").then((data) => {
      setDownloadData(data);
    })
    downloadData.forEach((dp) => {
      console.log("Name:", dp.personName ? dp.personName : "Nameless", "Status:", dp.status);
    });
  };

  const loadAttendance = () => {
    ApiHelper.get("/visitsessions?sessionId=" + session.id, "AttendanceApi").then((vs: VisitSessionInterface[]) => {
      setVisitSessions(vs);
      const peopleIds = ArrayHelper.getUniqueValues(vs, "visit.personId");
      ApiHelper.get("/people/ids?ids=" + escape(peopleIds.join(",")), "MembershipApi").then(data => setPeople(data));
      props.setHiddenPeople(peopleIds);
    });
  };

  const loadSessions = () => {
    ApiHelper.get("/sessions?groupId=" + props.group.id, "AttendanceApi").then(data => {
      setSessions(data);
      if (data.length > 0) setSession(data[0]);
    });
  };

  const handleRemove = (vs: VisitSessionInterface) => {
    ApiHelper.delete("/visitsessions?sessionId=" + session.id + "&personId=" + vs.visit.personId, "AttendanceApi").then(loadAttendance);
  }

  const handleAdd = (e: React.MouseEvent) => { e.preventDefault(); props.sidebarVisibilityFunction("addSession", true); }

  const getRows = () => {
    const canEdit = UserHelper.checkAccess(Permissions.attendanceApi.attendance.edit);
    const result: JSX.Element[] = [];
    for (let i = 0; i < visitSessions.length; i++) {
      const vs = visitSessions[i];
      //let editLink = (canEdit) ? (<a href="about:blank" onClick={handleRemove} className="text-danger" data-personid={vs.visit.personId}><Icon>person_remove</Icon> Remove</a>) : null;
      const editLink = (canEdit) ? <SmallButton icon="person_remove" text="Remove" onClick={() => handleRemove(vs)} color="error" data-testid={`remove-session-visitor-button-${vs.id}`} ariaLabel={`Remove ${person?.name?.display || 'visitor'} from session`} /> : <></>
      const person = ArrayHelper.getOne(people, "id", vs.visit.personId);
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

  const selectSession = (e: SelectChangeEvent) => {
    for (let i = 0; i < sessions.length; i++) if (sessions[i].id === e.target.value) setSession(sessions[i]);
  }

  const getSessionOptions = () => {
    const result: JSX.Element[] = [];
    for (let i = 0; i < sessions.length; i++) result.push(<MenuItem value={sessions[i].id} key={sessions[i].id}>{sessions[i].displayName}</MenuItem>);
    return result;
  }

  const getHeaderSection = () => {
    if (!UserHelper.checkAccess(Permissions.attendanceApi.attendance.edit)) return null;
    else return (
      <Grid container columnSpacing={2}>
        <Grid item>
          <FormControl style={{ width: 140, marginTop: 0 }} size="small">
            <InputLabel id="sessions">{Locale.label("groups.groupSessions.session")}</InputLabel>
            <Select fullWidth labelId="sessions" label={Locale.label("groups.groupSessions.session")} value={session?.id} onChange={selectSession}>
              {getSessionOptions()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          {getAddButton()}
        </Grid>
      </Grid>
    );
  }

  const handleSessionSelected = () => {
    if (session !== null) {
      loadAttendance();
      props.sidebarVisibilityFunction("addPerson", true);
    }
  }

  const handlePersonAdd = () => {
    const v = { checkinTime: new Date(), personId: props.addedPerson.id, visitSessions: [{ sessionId: session.id }] } as VisitInterface;
    ApiHelper.post("/visitsessions/log", v, "AttendanceApi").then(() => { loadAttendance(); });
    props.addedCallback(v.personId);
  }

  React.useEffect(() => { if (props.group.id !== undefined) { loadSessions() }; props.addedCallback(""); }, [props.group, props.addedSession]);  //eslint-disable-line

  React.useEffect(() => { if (props.addedPerson?.id !== undefined) { handlePersonAdd() } }, [props.addedPerson]); //eslint-disable-line

  React.useEffect(() => { handleSessionSelected(); }, [session]);  //eslint-disable-line

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { loadAttDownloadData(); }, [session, visitSessions]);
  const customHeaders = [
    { label: "id", key: "id" },
    { label: "sessionDate", key: "sessionDate" },
    { label: "personName", key: "personName" },
    { label: "status", key: "status" },
    { label: "personId", key: "personId" },
    { label: "visitId", key: "visitId" }
  ]

  let content = <Loading />;
  if (sessions) {
    if (sessions.length === 0) content = <div className="alert alert-warning" role="alert" data-cy="no-session-msg"><b>{Locale.label("groups.groupSessions.noSesMsg")}</b>  {Locale.label("groups.groupSessions.addSesMsg")}</div>
    else content = (<>
      <span className="float-right">{downloadData ? <ExportLink data={downloadData} spaceAfter={true} filename={`${props.group.name}_visits.csv`} customHeaders={customHeaders} /> : <></>}</span>
      <b data-cy="session-present-msg">{Locale.label("groups.groupSessions.attFor")} {props.group.name}</b>
      <Table id="groupMemberTable">
        <TableHead><TableRow><th></th><th>{Locale.label("common.name")}</th><th></th></TableRow></TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>
    </>);
  }

  const getAddButton = () => {
    if (!UserHelper.checkAccess(Permissions.attendanceApi.attendance.edit)) return null;
    return (
      <Button
        variant="contained"
        color="primary"
        startIcon={<Icon>calendar_month</Icon>}
        onClick={handleAdd}
        data-cy="create-new-session"
      >
        {Locale.label("groups.groupSessions.new")}
      </Button>
    );
  }

  return (<DisplayBox id="groupSessionsBox" data-cy="group-session-box" headerText={Locale.label("groups.groupSessions.sessions")} headerIcon="calendar_month" editContent={getHeaderSection()}>{content}</DisplayBox>);
}

