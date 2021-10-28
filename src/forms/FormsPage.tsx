import React, { useRef } from "react";
import { ApiHelper, DisplayBox, FormInterface, FormEdit, UserHelper, Permissions, Loading, EnvironmentHelper } from "./components"
import { Link } from "react-router-dom"
import { Row, Col, Table } from "react-bootstrap";

export const FormsPage = () => {
  const [forms, setForms] = React.useState<FormInterface[]>(null);
  const [archivedForms, setArchivedForms] = React.useState<FormInterface[]>(null);
  const [selectedFormId, setSelectedFormId] = React.useState("notset");
  const [selectedTab, setSelectedTab] = React.useState("forms");
  const isSubscribed = useRef(true);
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);

  const loadData = () => {
    ApiHelper.get("/forms", "MembershipApi").then(data => setForms(data));
    ApiHelper.get("/forms/archived", "MembershipApi").then(data => {if (isSubscribed.current) { setArchivedForms(data) }});
  }

  const getRows = () => {
    let result: JSX.Element[] = [];
    if (!forms.length) {
      result.push(<tr key="0"><td>No custom forms have been created yet. They will appear here when added. --- USER: {UserHelper?.person?.name?.display} == {UserHelper?.user?.id} == ADMIN: { "" + UserHelper.checkAccess(Permissions.membershipApi.forms.admin) } EDIT: { "" + UserHelper.checkAccess(Permissions.membershipApi.forms.edit) }</td></tr>);
      return result;
    }

    const formData = (selectedTab === "forms") ? forms : archivedForms;
    formData.forEach((form: FormInterface) => {
      const canEdit = (
        UserHelper.checkAccess(Permissions.membershipApi.forms.admin)
        || (UserHelper.checkAccess(Permissions.membershipApi.forms.edit) && form.contentType !== "form")
        || form?.action === "admin"
      );
      const editLink = (canEdit && selectedTab === "forms") ? (<button aria-label="editForm" className="no-default-style" onClick={() => { setSelectedFormId(form.id); }}><i className="fas fa-pencil-alt"></i></button>) : null;
      const formUrl = EnvironmentHelper.B1Url.replace("{key}", UserHelper.currentChurch.subDomain) + "/forms/" + form.id;
      const formLink = (form.contentType === "form") ? <a href={formUrl}>{formUrl}</a> : null;
      const archiveLink = (canEdit && selectedTab === "forms") ? (<button aria-label="archiveForm" className="no-default-style" onClick={() => { handleArchiveChange(form, true); }}><i className="fas fa-archive"></i></button>) : null;
      const unarchiveLink = (canEdit && selectedTab === "archived") ? (<button className="no-default-style" onClick={() => { handleArchiveChange(form, false); }}><i className="fas fa-undo"></i></button>) : null;
      result.push(<tr key={form.id}>
        <td><i className="fas fa-align-left" /> <Link to={"/forms/" + form.id}>{form.name}</Link></td>
        <td>{formLink}</td>
        <td>{archiveLink || unarchiveLink}</td>
        <td>{editLink}</td>
      </tr>);
    });
    return result;
  }

  const handleArchiveChange = (form: FormInterface, archive: boolean) => {
    const conf = archive ? window.confirm("Are you sure you want to archive this form?") : window.confirm("Are you sure you want to restore this form?");
    if (!conf) return;
    form.archived = archive;
    ApiHelper.post("/forms", [form], "MembershipApi").then(data => loadData());
  }

  const getArchivedRows = () => {
    let result: JSX.Element[] = [];
    if (!archivedForms.length) {
      result.push(<tr key="0"><td>No archived forms.</td></tr>);
      return result;
    }
    return getRows();
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (forms.length === 0) {
      return rows;
    }
    rows.push(<tr key="header"><th colSpan={4}>Name</th></tr>);
    return rows;
  }

  const handleUpdate = () => { loadData(); setSelectedFormId("notset"); }

  const getSidebar = () => {
    if (selectedFormId === "notset" || selectedTab === "archived") return <></>
    if (selectedTab === "forms") return (<FormEdit formId={selectedFormId} updatedFunction={handleUpdate}></FormEdit>)
  }

  const getEditContent = () => {
    if (!formPermission || selectedTab === "archived") return null;
    else return (<button aria-label="addForm" className="no-default-style" onClick={() => { setSelectedFormId(""); }}><i className="fas fa-plus"></i></button>);
  }

  React.useEffect(() => { loadData(); return () => { isSubscribed.current = false } }, []);

  if (!forms && !archivedForms) return (<></>);
  else {
    let title = (selectedTab === "forms") ? "Forms" : "Archived Forms";
    let icon = (selectedTab === "forms") ? "fas fa-align-left" : "fas fa-archive";
    let contents = <Loading />
    if (forms && archivedForms) {
      contents = (<Table>
        <thead>{getTableHeader()}</thead>
        <tbody>{selectedTab === "forms" ? getRows() : getArchivedRows() }</tbody>
      </Table>);
    }
    return (
      <>
        <h1><i className={icon}></i> {title}</h1>
        <ul className="nav nav-tabs">
          <li className="nav-item" key="forms"><a href="about:blank" onClick={e => { e.preventDefault(); setSelectedTab("forms"); }} className={(selectedTab === "forms") ? "nav-link active" : "nav-link"}><i className="fas fa-align-left"></i> Forms</a></li>
          { archivedForms?.length > 0 && <li className="nav-item" key="archived"><a href="about:blank" onClick={e => { e.preventDefault(); setSelectedTab("archived"); }} className={(selectedTab === "archived") ? "nav-link active" : "nav-link"}><i className="fa fa-archive"></i> Archived forms</a></li> }
        </ul>
        <Row>
          <Col lg={8}>
            <DisplayBox id="formsBox" headerText={title} headerIcon={icon} editContent={getEditContent()}>
              {contents}
            </DisplayBox>
          </Col>
          <Col lg={4}>{getSidebar()}</Col>
        </Row>
      </>
    );
  }
}

