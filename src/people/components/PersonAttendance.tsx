import React from "react";
import { useMountedState, DisplayBox, ArrayHelper, ApiHelper, AttendanceRecordInterface, DateHelper, GroupInterface, UniqueIdHelper, Loading, Locale } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { Icon, Table, TableBody, TableCell, TableRow } from "@mui/material";

interface Props { personId: string }

export const PersonAttendance: React.FC<Props> = (props) => {
  const [records, setRecords] = React.useState<AttendanceRecordInterface[]>(null);
  const [groups, setGroups] = React.useState<GroupInterface[]>(null);
  const isMounted = useMountedState();

  const loadData = () => {
    if (!UniqueIdHelper.isMissing(props.personId)) {
      ApiHelper.get("/attendancerecords?personId=" + props.personId, "AttendanceApi").then(data => {
        if(isMounted()) {
          setRecords(data);
        }});
      ApiHelper.get("/groups", "MembershipApi").then(data => {
        if(isMounted()) {
          setGroups(data);
        }});
    }
  }

  const getRows = () => {
    const rows: JSX.Element[] = [];

    if (records.length === 0) {
      rows.push(<TableRow key="0"><TableCell>{Locale.label("people.personAttendance.noAttMsg")}</TableCell></TableRow>);
      return rows;
    }

    let lastVisitDate = new Date(2000, 1, 1);
    let lastCampusId = "notset";
    let lastServiceId = "notset";

    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      const group = ArrayHelper.getOne(groups, "id", r.groupId);

      const cols: JSX.Element[] = [];
      let showRest = false;
      if (r.visitDate === lastVisitDate && !showRest) cols.push(<TableCell></TableCell>);
      else {
        cols.push(<TableCell><Icon>calendar_month</Icon>{DateHelper.formatHtml5Date(r.visitDate)}</TableCell>);
        lastVisitDate = r.visitDate;
        showRest = true;
      }
      if (r.campus?.id === lastCampusId && !showRest) cols.push(<TableCell></TableCell>);
      else {
        cols.push(<TableCell><Icon>church</Icon>{r.campus?.name}</TableCell>);
        lastCampusId = r.campus?.id;
        showRest = true;
      }
      if (r.service?.id === lastServiceId && !showRest) cols.push(<TableCell></TableCell>);
      else {
        cols.push(<TableCell><Icon>calendar_month</Icon>{r.service?.name}</TableCell>);
        lastServiceId = r.service?.id;
        showRest = true;
      }
      if (r.serviceTime === undefined) cols.push(<TableCell></TableCell>);
      else cols.push(<TableCell><Icon>schedule</Icon>{r.serviceTime?.name}</TableCell>);
      if (group === null) cols.push(<TableCell><Icon>group</Icon></TableCell>);
      else cols.push(<TableCell><Icon>group</Icon><Link to={"/groups/" + group.id}>{group.name}</Link></TableCell>)
      rows.push(<TableRow>{cols}</TableRow>);
    }
    return rows;
  }

  React.useEffect(loadData, [props.personId, isMounted]);

  const getTable = () => {
    if (!records || !groups) return <Loading />;
    else return (<Table><TableBody>{getRows()}</TableBody></Table>);
  }

  return (
    <DisplayBox headerIcon="calendar_month" headerText={Locale.label("people.personAttendance.att")}>
      {getTable()}
    </DisplayBox>
  );
}

