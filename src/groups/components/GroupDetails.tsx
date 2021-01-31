import React from "react";
import { GroupInterface, DisplayBox, GroupDetailsEdit, ServiceTimes, UserHelper, Permissions } from ".";
import { Row, Col } from "react-bootstrap";

interface Props { group: GroupInterface, updatedFunction: (group: GroupInterface) => void }

export const GroupDetails: React.FC<Props> = (props) => {
    const [mode, setMode] = React.useState("display");
    const handleEdit = () => setMode("edit");
    const getEditFunction = () => { return (UserHelper.checkAccess(Permissions.membershipApi.groups.edit)) ? handleEdit : null }

    const handleUpdated = (g: GroupInterface) => { setMode("display"); props.updatedFunction(g); }

    if (mode === "edit") return <GroupDetailsEdit group={props.group} updatedFunction={handleUpdated} />
    else return (
        <DisplayBox id="groupDetailsBox" data-cy="group-details-box" headerText="Group Details" headerIcon="fas fa-list" editFunction={getEditFunction()} >
            <Row>
                <Col><label>Category:</label> {props.group.categoryName}</Col>
                <Col><label>Name:</label> {props.group.name}</Col>
            </Row>
            <Row>
                <Col><label>Track Attendance:</label> {(props.group.trackAttendance?.toString().replace("false", "No").replace("true", "Yes") || "")}</Col>
                <Col><label>Parent Pickup:</label> {(props.group.parentPickup?.toString().replace("false", "No").replace("true", "Yes") || "")}</Col>
            </Row>
            <ServiceTimes group={props.group} />
        </DisplayBox>
    );
}

