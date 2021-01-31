import React from "react";
import { ApiHelper, DisplayBox, RoleInterface, RolePermissionInterface, RoleCheck } from ".";
import { Row, Col } from "react-bootstrap";

interface Props { role: RoleInterface }

export const RolePermissions: React.FC<Props> = (props) => {
    const [rolePermissions, setRolePermissions] = React.useState<RolePermissionInterface[]>([]);
    const loadData = React.useCallback(() => { ApiHelper.get("/rolepermissions/roles/" + props.role.id, "AccessApi").then(data => setRolePermissions(data)); }, [props.role]);
    React.useEffect(() => { if (props.role.id !== undefined) loadData() }, [props.role, loadData]);

    return (
        <DisplayBox id="rolePermissionsBox" headerText="Edit Permissions" headerIcon="fas fa-lock" >
            <Row>
                <Col xl={6}>
                    <div><b>People:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="People" action="Edit" label="Edit" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Households" action="Edit" label="Edit Households" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="People" action="View Notes" label="View Notes" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="People" action="Edit Notes" label="Edit Notes" />
                </Col>
                <Col xl={6}>
                    <div><b>Groups:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Groups" action="View" label="View" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Groups" action="Edit" label="Edit" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Group Members" action="View" label="View Members" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Group Members" action="Edit" label="Edit Members" />
                </Col>
            </Row>
            <hr />
            <Row>
                <Col xl={6}>
                    <div><b>Attendance:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Attendance" action="View Summary" label="View Summary" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Attendance" action="View" label="View Individual" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Attendance" action="Edit" label="Edit" />
                </Col>
                <Col xl={6}>
                    <div><b>Donations:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Donations" action="View Summary" label="View Summary" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Donations" action="View" label="View Individual" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Donations" action="Edit" label="Edit" />
                </Col>
            </Row>
            <hr />
            <Row>
                <Col xl={6}>
                    <div><b>Forms:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Forms" action="View" label="View" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Forms" action="Edit" label="Edit" />
                </Col>
                <Col xl={6}>
                    <div><b>Roles:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Roles" action="View" label="View" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Roles" action="Edit" label="Edit" />
                </Col>
            </Row>
            <hr />
            <Row>
                <Col xl={6}>
                    <div><b>Services:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Services" action="Edit" label="Edit" />
                </Col>
                <Col xl={6}>
                    <div><b>Admin:</b></div>
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Admin" action="Import" label="Import/Export" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Admin" action="Delete Church" label="Delete Account" />
                    <RoleCheck roleId={props.role.id} rolePermissions={rolePermissions} contentType="Admin" action="Edit Settings" label="Edit Settings" />
                </Col>
            </Row>
        </DisplayBox>
    );
}

