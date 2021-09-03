import React, { useRef } from "react";
import { ApiHelper, DisplayBox, FormInterface, FormEdit, UserHelper, Permissions, Loading } from "./components"
import { Link } from "react-router-dom"
import { Row, Col, Table } from "react-bootstrap";

export const FormsPage = () => {
  const [forms, setForms] = React.useState<FormInterface[]>(null);
  const [selectedFormId, setSelectedFormId] = React.useState("notset");
  const isSubscribed = useRef(true)

  const loadData = () => { ApiHelper.get("/forms", "MembershipApi").then(data => { if (isSubscribed.current) { setForms(data) } }); }

  const getRows = () => {
    const result: JSX.Element[] = [];
    if (forms.length === 0) {
      result.push(<tr key="0"><td>No custom forms have been created yet. They will appearing here when added.</td></tr>);
      return result;
    }
    const canEdit = UserHelper.checkAccess(Permissions.membershipApi.forms.edit)
    for (let i = 0; i < forms.length; i++) {
      const editLink = (canEdit) ? (<button aria-label="editForm" className="no-default-style" onClick={() => { setSelectedFormId(forms[i].id); }}><i className="fas fa-pencil-alt"></i></button>) : null;
      const formLink = (forms[i].contentType === "form") ? <a href={"http://test.localhost:3301/forms/" + forms[i].id}>{"http://test.localhost:3301/form/" + forms[i].id}</a> : null;
      result.push(<tr key={i}>
        <td><i className="fas fa-align-left" /> <Link to={"/forms/" + forms[i].id}>{forms[i].name}</Link></td>
        <td>{formLink}</td>
        <td>{editLink}</td>
      </tr>);
    }
    return result;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (forms.length === 0) {
      return rows;
    }
    rows.push(<tr key="header"><th colSpan={3}>Name</th></tr>);
    return rows;
  }

  const handleUpdate = () => { loadData(); setSelectedFormId("notset"); }

  const getSidebar = () => {
    if (selectedFormId === "notset") return <></>
    else return (<FormEdit formId={selectedFormId} updatedFunction={handleUpdate}></FormEdit>)
  }

  const getEditContent = () => {
    if (!UserHelper.checkAccess(Permissions.membershipApi.forms.edit)) return null;
    else return (<button aria-label="addForm" className="no-default-style" onClick={() => { setSelectedFormId(""); }}><i className="fas fa-plus"></i></button>);
  }

  React.useEffect(() => { loadData(); return () => { isSubscribed.current = false } }, []);

  if (!UserHelper.checkAccess(Permissions.membershipApi.forms.view)) return (<></>);
  else {
    let contents = <Loading />
    if (forms) {
      contents = (<Table>
        <thead>{getTableHeader()}</thead>
        <tbody>{getRows()}</tbody>
      </Table>);
    }
    return (
      <>
        <h1><i className="fas fa-align-left"></i> Forms</h1>
        <Row>
          <Col lg={8}>
            <DisplayBox id="formsBox" headerText="Forms" headerIcon="fas fa-align-left" editContent={getEditContent()}>
              {contents}
            </DisplayBox>
          </Col>
          <Col lg={4}>{getSidebar()}</Col>
        </Row>
      </>
    );
  }
}

