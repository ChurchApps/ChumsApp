import React from "react";
import { ApiHelper, DisplayBox, RoleInterface, PersonAdd, PersonInterface, RoleMemberInterface, UserHelper, Permissions } from "./components";
import { RouteComponentProps } from "react-router-dom"
import { RoleMembers } from "./components/RoleMembers";
import { RolePermissions } from "./components/RolePermissions";
import { Row, Col } from "react-bootstrap";

type TParams = { id?: string };
export const RolePage = ({ match }: RouteComponentProps<TParams>) => {
    const [role, setRole] = React.useState<RoleInterface>({} as RoleInterface);

    const loadData = () => { ApiHelper.get("/roles/" + match.params.id, "AccessApi").then(data => setRole(data)); }

    const addPerson = (p: PersonInterface) => {
        const email = p.contactInfo?.email;
        if (email === undefined || email === null || email === "") alert("You must first enter an email address for this person.");
        else {
            var rm: RoleMemberInterface = {
                roleId: role.id,
                userId: p.userId,
                user: { displayName: p.name.display, email: p.contactInfo.email }
            };
        }
        ApiHelper.post("/rolemembers", [rm], "AccessApi").then(async (data: RoleMemberInterface[]) => {
            if (p.userId === undefined || p.userId === null || p.userId === 0) {
                p.userId = data[0].userId;
                await ApiHelper.post("/people", [p], "MembershipApi");
            }
            loadData();
        });
    }

    const getSidebar = () => {
        if (!UserHelper.checkAccess(Permissions.accessApi.roles.edit)) return (null);
        else return (<>
            <DisplayBox id="roleMemberAddBox" headerIcon="fas fa-user" headerText="Add Person"><PersonAdd addFunction={addPerson} /></DisplayBox>
            <RolePermissions role={role} />
        </>);
    }

    React.useEffect(loadData, []);

    if (!UserHelper.checkAccess(Permissions.accessApi.roles.view)) return (<></>);
    else {
        return (
            <>
                <h1><i className="fas fa-lock"></i> {role.name}</h1>
                <Row>
                    <Col lg={8}><RoleMembers role={role} /></Col>
                    <Col lg={4}>{getSidebar()}</Col>
                </Row>
            </>
        );
    }
}

