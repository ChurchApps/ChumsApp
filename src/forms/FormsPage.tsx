import React, { useRef } from "react";
import { ApiHelper, DisplayBox, FormInterface, FormEdit, UserHelper, Permissions, Loading, EnvironmentHelper } from "./components"
import { Link } from "react-router-dom"
import { Grid, Icon, Table, TableBody, TableCell, TableRow, TableHead, Box, Paper, Tabs, Tab } from "@mui/material"
import { SmallButton } from "../appBase/components";

export const FormsPage = () => {
  const [forms, setForms] = React.useState<FormInterface[]>(null);
  const [archivedForms, setArchivedForms] = React.useState<FormInterface[]>(null);
  const [selectedFormId, setSelectedFormId] = React.useState("notset");
  const [selectedTab, setSelectedTab] = React.useState("forms");
  const [tabIndex, setTabIndex] = React.useState(0);
  const isSubscribed = useRef(true);
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);

  const loadData = () => {
    ApiHelper.get("/forms", "MembershipApi").then(data => { if (isSubscribed.current) { setForms(data) } });
    ApiHelper.get("/forms/archived", "MembershipApi").then(data => { if (isSubscribed.current) { setArchivedForms(data) } });
  }

  const getRows = () => {
    let result: JSX.Element[] = [];
    if (!forms.length) {
      result.push(<TableRow key="0"><TableCell>No custom forms have been created yet. They will appear here when added.</TableCell></TableRow>);
      return result;
    }

    const formData = (selectedTab === "forms") ? forms : archivedForms;
    formData.forEach((form: FormInterface) => {
      const canEdit = (
        UserHelper.checkAccess(Permissions.membershipApi.forms.admin)
        || (UserHelper.checkAccess(Permissions.membershipApi.forms.edit) && form.contentType !== "form")
        || form?.action === "admin"
      );
      const editLink = (canEdit && selectedTab === "forms") ? (<SmallButton icon="edit" text="Edit" onClick={() => { setSelectedFormId(form.id); }} />) : null;
      const formUrl = EnvironmentHelper.B1Url.replace("{key}", UserHelper.currentChurch.subDomain) + "/forms/" + form.id;
      const formLink = (form.contentType === "form") ? <a href={formUrl}>{formUrl}</a> : null;
      const archiveLink = (canEdit && selectedTab === "forms") ? (<SmallButton icon="delete" text="Archive" color="error" onClick={() => { handleArchiveChange(form, true); }} />) : null;
      const unarchiveLink = (canEdit && selectedTab === "archived") ? (<SmallButton icon="undo" text="Restore" color="success" onClick={() => { handleArchiveChange(form, false); }} />) : null;
      result.push(<TableRow key={form.id}>
        <TableCell><Box sx={{ display: "flex", alignItems: "center" }}><Icon sx={{ fontSize: 20, marginRight: "5px" }}>format_align_left</Icon> <Link to={"/forms/" + form.id}>{form.name}</Link></Box></TableCell>
        <TableCell>{formLink}</TableCell>
        <TableCell style={{ textAlign: "right" }}>{archiveLink || unarchiveLink} {editLink}</TableCell>
      </TableRow>);
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
      result.push(<TableRow key="0"><TableCell>No archived forms.</TableCell></TableRow>);
      return result;
    }
    return getRows();
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (forms.length === 0) {
      return rows;
    }
    rows.push(<TableRow key="header"><th colSpan={3}>Name</th></TableRow>);
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

  React.useEffect(() => { loadData(); return () => { isSubscribed.current = false } }, []);

  if (!forms && !archivedForms) return (<></>);
  else {
    let title = (selectedTab === "forms") ? "Forms" : "Archived Forms";
    let icon = (selectedTab === "forms") ? "format_align_left" : "archive";
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

    let tabs = [];
    let defaultTab = "";
    tabs.push(getTab(0, "forms", "format_align_left", "Forms")); if (defaultTab === "") defaultTab = "forms";
    if (archivedForms?.length > 0) { tabs.push(getTab(1, "archived", "archive", "Archived Forms")); if (defaultTab === "") defaultTab = "archived"; }
    if (selectedTab === "" && defaultTab !== "") setSelectedTab(defaultTab);

    return (
      <>
        <h1><Icon>description</Icon> {title}</h1>
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
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

          </Grid>
          <Grid item md={4} xs={12}>{getSidebar()}</Grid>
        </Grid>
      </>
    );
  }
}

