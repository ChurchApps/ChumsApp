import React from "react";
import { DisplayBox, ApiHelper, HouseholdEdit, UserHelper, PersonInterface, Permissions, UniqueIdHelper, Loading, PersonHelper } from ".";
import { Link } from "react-router-dom";
import { Table, TableBody, TableRow, TableCell } from "@mui/material"

interface Props {
  person: PersonInterface,
  reload: any
}

export const Household: React.FC<Props> = (props) => {
  const [household, setHousehold] = React.useState(null);
  const [members, setMembers] = React.useState<PersonInterface[]>(null);
  const [mode, setMode] = React.useState("display");
  const [, setPhoto] = React.useState("");

  const handleEdit = () => setMode("edit");
  const handleUpdate = () => {
    loadData();
    loadMembers();
    setMode("display");
  }
  const loadData = () => {
    if (!UniqueIdHelper.isMissing(props.person?.householdId)) {
      ApiHelper.get("/households/" + props?.person.householdId, "MembershipApi")
        .then(data => setHousehold(data));
    }
  }
  const loadMembers = () => {
    if (household != null) {
      ApiHelper.get("/people/household/" + household.id, "MembershipApi").then(data => setMembers(data));
    }
  }
  const getEditFunction = () => (UserHelper.checkAccess(Permissions.membershipApi.people.edit)) ? handleEdit : undefined
  React.useEffect(loadData, [props.person]);
  React.useEffect(() => {
    setPhoto(PersonHelper.getPhotoUrl(props.person))
  }, [props.person]);
  React.useEffect(loadMembers, [household?.id, props.reload]); //eslint-disable-line

  const getRows = () => {
    let rows = [];
    if (members !== null) {
      for (let i = 0; i < members.length; i++) {
        let m = members[i];
        rows.push(
          <TableRow key={m.id}>
            <TableCell><img src={PersonHelper.getPhotoUrl(m)} alt="avatar" /></TableCell>
            <TableCell><Link to={"/people/" + m.id}>{m.name.display}</Link>
              <div>{m.householdRole}</div>
            </TableCell>
          </TableRow>
        );
      }
    }
    return rows;
  }

  const getTable = () => {
    if (!members) return <Loading size="sm" />
    else return (<Table size="small" id="household">
      <TableBody>{getRows()}</TableBody>
    </Table>);
  }

  if (mode === "display") {
    return (
      <DisplayBox id="householdBox" headerIcon="group" headerText={(household?.name || "") + " Household"} editFunction={getEditFunction()} ariaLabel="editHousehold">
        {getTable()}
      </DisplayBox>
    );
  } else return <HouseholdEdit household={household} currentMembers={members} updatedFunction={handleUpdate} currentPerson={props.person} />
}

