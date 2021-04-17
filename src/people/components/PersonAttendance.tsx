import React from "react";
import { DisplayBox, ApiHelper, AttendanceRecordInterface, Helper, GroupInterface, UniqueIdHelper } from ".";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { ArrayHelper } from "../../helpers";

interface Props { personId: string }

export const PersonAttendance: React.FC<Props> = (props) => {
    const [records, setRecords] = React.useState<AttendanceRecordInterface[]>([]);
    const [groups, setGroups] = React.useState<GroupInterface[]>([]);

    const loadData = () => {
        if (!UniqueIdHelper.isMissing(props.personId)) {
            ApiHelper.get("/attendancerecords?personId=" + props.personId, "AttendanceApi").then(data => setRecords(data));
            ApiHelper.get("/groups", "MembershipApi").then(data => setGroups(data));
        }
    }

    const getRows = () => {
        var rows: JSX.Element[] = [];
 
        if (records.length === 0) {
            rows.push(<tr key="0">Attendance will appear once service has been attended.</tr>);
            return rows;
        }

        var lastVisitDate = new Date(2000, 1, 1);
        var lastCampusId = "notset";
        var lastServiceId = "notset";

        for (let i = 0; i < records.length; i++) {
            var r = records[i];
            console.log(groups);
            console.log(r);
            let group = ArrayHelper.getOne(groups, "id", r.groupId);

            var cols: JSX.Element[] = [];
            var showRest = false;
            if (r.visitDate === lastVisitDate && !showRest) cols.push(<td></td>);
            else {
                cols.push(<td><i className="far fa-calendar-alt"></i> {Helper.formatHtml5Date(r.visitDate)}</td>);
                lastVisitDate = r.visitDate;
                showRest = true;
            }
            if (r.campus?.id === lastCampusId && !showRest) cols.push(<td></td>);
            else {
                cols.push(<td><i className="fas fa-church"></i> {r.campus?.name}</td>);
                lastCampusId = r.campus?.id;
                showRest = true;
            }
            if (r.service?.id === lastServiceId && !showRest) cols.push(<td></td>);
            else {
                cols.push(<td><i className="fas fa-calendar-alt"></i> {r.service?.name}</td>);
                lastServiceId = r.service?.id;
                showRest = true;
            }
            if (r.serviceTime === undefined) cols.push(<td></td>);
            else cols.push(<td><i className="far fa-clock"></i> {r.serviceTime?.name}</td>);
            if (group === null) cols.push(<td><i className="fas fa-list"></i></td>);
            else cols.push(<td><i className="fas fa-list"></i> <Link to={"/groups/" + group.id}>{group.name}</Link></td>)
            rows.push(<tr>{cols}</tr>);
        }
        return rows;
    }

    React.useEffect(loadData, [props.personId]);


    return (
        <DisplayBox headerIcon="far fa-calendar-alt" headerText="Attendance" >
            <Table><tbody>{getRows()}</tbody></Table>
        </DisplayBox>
    );
}

