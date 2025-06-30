import React from "react";
import { FormEdit, EnvironmentHelper } from "./components"
import { ApiHelper, DisplayBox, type FormInterface, UserHelper, Permissions, Loading, Locale } from "@churchapps/apphelper";
import { Link } from "react-router-dom"
import { Icon, Table, TableBody, TableCell, TableRow, TableHead, Box, Paper, Tabs, Tab } from "@mui/material"
import { SmallButton } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";

export const FormsPage = () => {
  const [forms, setForms] = React.useState<FormInterface[]>(null);
  const [archivedForms, setArchivedForms] = React.useState<FormInterface[]>(null);
  const [selectedFormId, setSelectedFormId] = React.useState("notset");
  const [selectedTab, setSelectedTab] = React.useState("forms");
  const [tabIndex, setTabIndex] = React.useState(0);
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);

  const loadData = () => {
    ApiHelper.get("/forms", "MembershipApi").then(data => { setForms(data) });
    ApiHelper.get("/forms/archived", "MembershipApi").then(data => { setArchivedForms(data) });
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    if (!forms.length) {
      result.push(<TableRow key="0"><TableCell>{Locale.label("forms.formsPage.noCustomMsg")}</TableCell></TableRow>);
      return result;
    }

    const formData = (selectedTab === "forms") ? forms : archivedForms;
    formData.forEach((form: FormInterface) => {
      const canEdit = (
        UserHelper.checkAccess(Permissions.membershipApi.forms.admin)
        || (UserHelper.checkAccess(Permissions.membershipApi.forms.edit) && form.contentType !== "form")
        || form?.action === "admin"
      );
      const editLink = (canEdit && selectedTab === "forms") ? (<SmallButton icon="edit" text="Edit" onClick={() => { setSelectedFormId(form.id); }} data-testid={`edit-form-button-${form.id}`} ariaLabel={`Edit form ${form.name}`} />) : null;
      const formUrl = EnvironmentHelper.B1Url.replace("{key}", UserHelper.currentUserChurch.church.subDomain) + "/forms/" + form.id;
      const formLink = (form.contentType === "form") ? <a href={formUrl}>{formUrl}</a> : null;
      const archiveLink = (canEdit && selectedTab === "forms") ? (<SmallButton icon="delete" text="Archive" color="error" onClick={() => { handleArchiveChange(form, true); }} data-testid={`archive-form-button-${form.id}`} ariaLabel={`Archive form ${form.name}`} />) : null;
      const unarchiveLink = (canEdit && selectedTab === "archived") ? (<SmallButton icon="undo" text="Restore" color="success" onClick={() => { handleArchiveChange(form, false); }} data-testid={`restore-form-button-${form.id}`} ariaLabel={`Restore form ${form.name}`} />) : null;
      result.push(<TableRow key={form.id}>
        <TableCell><Box sx={{ display: "flex", alignItems: "center" }}><Icon sx={{ fontSize: 20, marginRight: "5px" }}>format_align_left</Icon> <Link to={"/forms/" + form.id}>{form.name}</Link></Box></TableCell>
        <TableCell>{formLink}</TableCell>
        <TableCell style={{ textAlign: "right" }}>{archiveLink || unarchiveLink} {editLink}</TableCell>
      </TableRow>);
    });
    return result;
  }

  const handleArchiveChange = (form: FormInterface, archive: boolean) => {
    const conf = archive ? window.confirm(Locale.label("forms.formsPage.confirmMsg1")) : window.confirm(Locale.label("forms.formsPage.confirmMsg2"));
    if (!conf) return;
    form.archived = archive;
    ApiHelper.post("/forms", [form], "MembershipApi").then(() => loadData());
  }

  const getArchivedRows = () => {
    const result: JSX.Element[] = [];
    if (!archivedForms.length) {
      result.push(<TableRow key="0"><TableCell>{Locale.label("forms.formsPage.noArch")}</TableCell></TableRow>);
      return result;
    }
    return getRows();
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (forms.length === 0) {
      return rows;
    }
    rows.push(<TableRow key="header"><th colSpan={3}>{Locale.label("common.name")}</th></TableRow>);
    return rows;
  }

  const handleUpdate = () => { loadData(); setSelectedFormId("notset"); }

  const getSidebar = () => {
    if (selectedFormId === "notset" || selectedTab === "archived") return <></>
    if (selectedTab === "forms") return (<FormEdit formId={selectedFormId} updatedFunction={handleUpdate}></FormEdit>)
  }

  const getEditContent = () => {
    if (!formPermission || selectedTab === "archived") return null;
    else return (<button aria-label="addForm" className="no-default-style" onClick={() => { setSelectedFormId(""); }}><Icon>add</Icon></button>);
  }

  React.useEffect(loadData, []);

  if (!forms && !archivedForms) return (<></>);
  else {
    const title = (selectedTab === "forms") ? Locale.label("forms.formsPage.forms") : Locale.label("forms.formsPage.archForms");
    const icon = (selectedTab === "forms") ? "format_align_left" : "archive";
    let contents = <Loading />
    if (forms && archivedForms) {
      contents = (<Table>
        <TableHead>{getTableHeader()}</TableHead>
        <TableBody>{selectedTab === "forms" ? getRows() : getArchivedRows()}</TableBody>
      </Table>);
    }

    const getTab = (index: number, keyName: string, icon: string, text: string) => (
      <Tab key={index} style={{ textTransform: "none", color: "#000" }} onClick={() => { setSelectedTab(keyName); setTabIndex(index); }} label={<>{text}</>} />
    )

    const tabs = [];
    let defaultTab = "";
    tabs.push(getTab(0, "forms", "format_align_left", Locale.label("forms.formsPage.forms"))); if (defaultTab === "") defaultTab = "forms";
    if (archivedForms?.length > 0) { tabs.push(getTab(1, "archived", "archive", Locale.label("forms.formsPage.archForms"))); if (defaultTab === "") defaultTab = "archived"; }
    if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

    return (
      <>
        <Banner><h1>{title}</h1></Banner>
        <div id="mainContent">
          {getSidebar()}
          <Paper>
            <Box>
              <Tabs value={tabIndex} style={{ borderBottom: "1px solid #CCC" }} data-cy="group-tabs">
                {tabs}
              </Tabs>
              <DisplayBox id="formsBox" headerText={title} headerIcon={icon} editContent={getEditContent()}>
                {contents}
              </DisplayBox>
            </Box>
          </Paper>
        </div>
      </>
    );
  }
}

