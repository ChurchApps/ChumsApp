import React, { useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DisplayBox, FormInterface, PersonAdd, PersonInterface } from ".";
import { MemberPermissionInterface, PersonHelper } from "../../helpers";

interface Props { formId: string }

export const FormMembers: React.FC<Props> = (props) => {
  const [formMembers, setFormMembers] = useState<MemberPermissionInterface[]>([]);

  const addPerson = (p: PersonInterface) => {
    const newMember = {
      memberId: p.id,
      contentType: "form",
      contentId: props.formId,
      action: "view",
      personName: p.name.display
    };
    let fm = [...formMembers];
    fm.push(newMember);
    setFormMembers(fm);
  }

  const handleSetAdmin = (personId: string) => {
    let fm = [...formMembers];
    fm.map((p: MemberPermissionInterface) => {
      if (p.memberId === personId) p.action = "admin"
    });
    setFormMembers(fm);
  }

  const handleRemoveMember = (personId: string) => {
    let fm = [...formMembers];
    console.log(fm, personId);
    fm = fm.filter((p: MemberPermissionInterface) => p.memberId !== personId);
    console.log(fm);
    setFormMembers(fm);
  }

  const getRows = () => {
    // let canEdit = UserHelper.checkAccess(Permissions.membershipApi.groupMembers.edit);
    let canEdit = props.formId || true;
    let rows: JSX.Element[] = [];
    formMembers.forEach(fm => {
      let makeAdminLink = (canEdit && fm.action === "view") ? <a href="about:blank" onClick={(e) => { e.preventDefault(); handleSetAdmin(fm.memberId); }} data-index={fm.id}>Make Admin</a> : <></>
      rows.push(
        <tr key={fm.memberId}>
          <td><Link to={"/people/" + fm.memberId}>{fm.personName}</Link></td>
          <td>{makeAdminLink}</td>
          <td>{<a href="about:blank" onClick={(e) => { e.preventDefault(); handleRemoveMember(fm.memberId); }} className="text-danger"><i className="fas fa-user-times"></i> Remove</a>}</td>
        </tr>
      );
    });
    return rows;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    rows.push(<tr key="header"><th>Name</th><th>Permission</th><th>Action</th></tr>);
    return rows;
  }

  const getTable = () => (
    <Table id="formMembersTable">
      <thead>{getTableHeader()}</thead>
      <tbody>{getRows()}</tbody>
    </Table>
  );

  return (
    <>
      <Row>
        <Col lg={8}>
          <DisplayBox headerText="Form Members" headerIcon="fas fa-users">
            {getTable()}
          </DisplayBox>
        </Col>
        <Col lg={4}>
          <DisplayBox headerText="Add Person" headerIcon="fas fa-users">
            <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={addPerson} />
          </DisplayBox>
        </Col>
      </Row>
    </>
  );
}
