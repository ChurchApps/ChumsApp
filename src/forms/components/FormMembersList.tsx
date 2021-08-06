import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DisplayBox, FormInterface, PersonAdd, PersonInterface } from ".";
import { MemberPermissionInterface, PersonHelper } from "../../helpers";

interface Props {
  form: FormInterface,
  formMembers: MemberPermissionInterface[],
  setAdmin: (personId: string) => void,
  removeMember: (personId: string) => void,
  setFormMembers: (newFormMembers: any) => void
}

export const FormMembersList: React.FC<Props> = (props) => {
  const [formMembers, setFormMembers] = useState<MemberPermissionInterface[]>([]);

  const handleSetAdmin = (formMember: MemberPermissionInterface) => {
    formMember.action = "admin";
    props.setAdmin(formMember.id);
  }

  const addPerson = (p: PersonInterface) => {
    const newMember = {
      memberId: p.id,
      contentType: "form",
      contentId: props.form.id,
      action: "view",
      personName: p.name.display
    };
    let fm = [...formMembers];
    fm.push(newMember);
    setFormMembers(fm);
  }

  const getRows = () => {
    // let canEdit = UserHelper.checkAccess(Permissions.membershipApi.groupMembers.edit);
    let canEdit = props.form.id || true;
    let rows: JSX.Element[] = [];
    formMembers.forEach(fm => {
      let makeAdminLink = (canEdit && fm.action === "view") ? <a href="about:blank" onClick={(e) => { e.preventDefault(); handleSetAdmin(fm); }} data-index={fm.id}>Make Admin</a> : <></>
      rows.push(
        <tr key={fm.memberId}>
          <td><Link to={"/people/" + fm.memberId}>{fm.personName}</Link></td>
          <td>{makeAdminLink}</td>
          <td>{<a href="about:blank" onClick={(e) => { e.preventDefault(); props.removeMember(fm.memberId); }} className="text-danger"><i className="fas fa-user-times"></i></a>}</td>
        </tr>
      );
    });
    return rows;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    rows.push(<tr key="header"><th>Name</th><th>Permission</th><th></th></tr>);
    return rows;
  }

  const getTable = () => (
    <Table id="formMembersTable">
      <thead>{getTableHeader()}</thead>
      <tbody>{getRows()}</tbody>
    </Table>
  )

  React.useEffect(() => { setFormMembers(props.formMembers) }, [props.formMembers]);

  return (
    <>
      <DisplayBox headerText="Form Members" headerIcon="fas fa-users">
        {getTable()}
      </DisplayBox>
      <label>Add Members</label> <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={addPerson} />
    </>
  );
}
