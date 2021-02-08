import React from "react";
import { DisplayBox, ApiHelper } from "."
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

interface Props { personId: number }

export const Groups: React.FC<Props> = (props) => {
    const [groupMembers, setGroupMembers] = React.useState(null);

    React.useEffect(() => {
        if (props.personId > 0) ApiHelper.get("/groupmembers?personId=" + props.personId, "MembershipApi").then(data => setGroupMembers(data))
    }, [props.personId]);

    const items = [];
    if (groupMembers !== null && groupMembers.length !== 0) {
        for (var i = 0; i < groupMembers.length; i++) {
            var gm = groupMembers[i];
            items.push(<tr key={gm.id}><td><i className="fas fa-list"></i> <Link to={"/groups/" + gm.groupId}>{gm.group.name}</Link></td></tr>);
        }
    } else {
        items.push(<tr key="0"><td>Not part of any group yet.</td></tr>);
    }
		console.log('items', items);
    return <DisplayBox headerIcon="fas fa-list" headerText="Groups"><Table size="sm"><tbody>{items}</tbody></Table></DisplayBox>
}