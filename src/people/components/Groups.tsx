import React from "react";
import { DisplayBox, ApiHelper, UniqueIdHelper, Loading } from "@churchapps/apphelper"
import { Link } from "react-router-dom";
import { Icon, Table, TableBody, TableRow, TableCell, Box } from "@mui/material";
import { useMountedState } from "@churchapps/apphelper";

interface Props { personId: string, title?: string }

export const Groups: React.FC<Props> = (props) => {
  const [groupMembers, setGroupMembers] = React.useState(null);
  const isMounted = useMountedState();

  React.useEffect(() => {
    if (!UniqueIdHelper.isMissing(props.personId)) ApiHelper.get("/groupmembers?personId=" + props.personId, "MembershipApi").then(data => {
      if(isMounted()) {
        setGroupMembers(data);
      }
    })
  }, [props.personId, isMounted]);

  const getRecords = () => {
    if (!groupMembers) return <Loading size="sm" />
    else if (groupMembers.length === 0) return (<p>Not currently a member of any groups.</p>)
    else {
      const items = [];
      for (let i = 0; i < groupMembers.length; i++) {
        let gm = groupMembers[i];
        items.push(<TableRow key={gm.id}><TableCell><Box sx={{display: "flex", alignItems: "center"}}><Icon sx={{marginRight: "5px"}}>group</Icon><Link to={"/groups/" + gm.groupId}>{gm.group.name}</Link></Box></TableCell></TableRow>);
      }
      return (<Table size="small"><TableBody>{items}</TableBody></Table>)
    }
  }

  return <DisplayBox headerIcon="group" headerText={props.title || "Groups"} help="chums/groups">{getRecords()}</DisplayBox>
}
