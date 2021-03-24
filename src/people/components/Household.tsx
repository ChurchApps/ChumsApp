import React from "react";
import { DisplayBox, PersonHelper, ApiHelper, HouseholdEdit, UserHelper, PersonInterface, Permissions, UniqueIdHelper } from ".";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";


interface Props { person: PersonInterface, reload: any }

export const Household: React.FC<Props> = (props) => {
    const [household, setHousehold] = React.useState(null);
    const [members, setMembers] = React.useState<PersonInterface[]>(null);
    const [mode, setMode] = React.useState("display");

    const handleEdit = () => setMode("edit");
    const handleUpdate = () => { loadData(); loadMembers(); setMode("display"); }
    const loadData = () => {
        if (!UniqueIdHelper.isMissing(props.person?.householdId)) ApiHelper.get("/households/" + props?.person.householdId, "MembershipApi").then(data => setHousehold(data));
    }
    const loadMembers = () => { if (household != null) { ApiHelper.get("/people/household/" + household.id, "MembershipApi").then(data => setMembers(data)); } }
    const getEditFunction = () => { return (UserHelper.checkAccess(Permissions.membershipApi.households.edit)) ? handleEdit : null }

    React.useEffect(loadData, [props.person]);
    React.useEffect(loadMembers, [household?.id, props.reload]);

    var rows = [];
    if (mode === "display") {
        if (members !== null) {
            for (var i = 0; i < members.length; i++) {
                var m = members[i];
                rows.push(
                    <tr key={m.id}>
                        <td><img src={PersonHelper.getPhotoUrl(m)} alt="avatar" /></td>
                        <td><Link to={"/people/" + m.id}>{m.name.display}</Link><div>{m.householdRole}</div></td>
                    </tr>
                );
            }
        }
        return (
            <DisplayBox id="householdBox" data-cy="household-box" headerIcon="fas fa-users" headerText={(household?.name || "") + " Household"} editFunction={getEditFunction()} >
                <Table size="sm" id="household"><tbody>{rows}</tbody></Table>
            </DisplayBox>
        );
    }
    else return <HouseholdEdit household={household} members={members} updatedFunction={handleUpdate} person={props.person} />
}

