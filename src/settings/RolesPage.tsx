import React from "react";
import { ApiHelper, DisplayBox, RoleInterface, RoleEdit, UserHelper, Permissions } from "./components";
import { Link } from "react-router-dom"
import { Row, Col, Table } from "react-bootstrap";

export const RolesPage = () => {

    const [roles, setRoles] = React.useState<RoleInterface[]>([]);
    const [selectedRoleId, setSelectedRoleId] = React.useState("notset");

    const loadData = () => { ApiHelper.get("/roles/app/CHUMS", "AccessApi").then(data => setRoles(data)); }
    const getEditContent = () => {
        if (!UserHelper.checkAccess(Permissions.accessApi.roles.edit)) return null;
        else return (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedRoleId(""); }} ><i className="fas fa-plus"></i></a>);
    }

    const getRows = () => {
        var result = [];
        const canEdit = UserHelper.checkAccess(Permissions.accessApi.roles.edit);
        for (let i = 0; i < roles.length; i++) {
            const editLink = (canEdit) ? (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setSelectedRoleId(roles[i].id); }}><i className="fas fa-pencil-alt"></i></a>) : null;
            result.push(<tr key={i}>
                <td><i className="fas fa-lock" /> <Link to={"/settings/roles/" + roles[i].id}>{roles[i].name}</Link></td>
                <td>{editLink}</td>
            </tr>);
        }
        return result;
    }

    const handleUpdate = () => { loadData(); setSelectedRoleId("notset"); }

    const getSidebar = () => {
        if (selectedRoleId === "notset") return <></>
        else return (<RoleEdit roleId={selectedRoleId} updatedFunction={handleUpdate} ></RoleEdit>)
    }

    React.useEffect(loadData, []);

    if (!UserHelper.checkAccess(Permissions.accessApi.roles.view)) return (<></>);
    return (
        <>
            <h1><i className="fas fa-lock"></i> Roles</h1>
            <Row>
                <Col lg={8}>
                    <DisplayBox id="rolesBox" headerText="Roles" headerIcon="fas fa-lock" editContent={getEditContent()} >
                        <Table id="roleMemberTable">
                            <thead><tr><th>Name</th><th></th></tr></thead>
                            <tbody>{getRows()}</tbody>
                        </Table>
                    </DisplayBox>
                </Col>
                <Col lg={4}>{getSidebar()}</Col>
            </Row>
        </>
    );
}

