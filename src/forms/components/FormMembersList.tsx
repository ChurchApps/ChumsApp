import zhCN from "date-fns/esm/locale/zh-CN/index";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DisplayBox, FormInterface, PersonInterface } from ".";
import { MemberPermissionInterface } from "../../helpers";

interface Props {
  form: FormInterface,
  formMembers: MemberPermissionInterface[],
  setAdmin: (personId: string) => void
}

export const FormMembersList: React.FC<Props> = (props) => {
  const [formMembers, setFormMembers] = useState<MemberPermissionInterface[]>([]);

  const handleSetAdmin = (formMember: MemberPermissionInterface) => {
    formMember.action = "admin";
    props.setAdmin(formMember.id);
  }

  const getRows = () => {
    // let canEdit = UserHelper.checkAccess(Permissions.membershipApi.groupMembers.edit);
    let canEdit = props.form.id || true;
    let rows: JSX.Element[] = [];
    formMembers.forEach(fm => {
      let makeAdminLink = (canEdit && fm.action === "view") ? <a href="about:blank" onClick={(e) => { e.preventDefault(); handleSetAdmin(fm); }} data-index={fm.id}>Make Admin</a> : <></>
      rows.push(
        <tr key={fm.id}>
          <td><Link to={"/people/" + fm.id}>{fm.personName}</Link></td>
          {/* <td>{fm.action}</td> */}
          <td>{makeAdminLink}</td>
          <td>{<a href="" className="text-danger"><i className="fas fa-user-times"></i> Remove</a>}</td>
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
    <DisplayBox headerText="Form Members" headerIcon="fas fa-users">
      {getTable()}
    </DisplayBox>
  );
}
