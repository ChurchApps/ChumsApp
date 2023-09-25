import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Icon, Table, TableBody, TableRow, TableCell, TableHead, Stack, Button, Paper, Switch, Tooltip, IconButton } from "@mui/material";
import { Info } from "@mui/icons-material";
import { DisplayBox, PersonAdd, PersonInterface, ApiHelper, MemberPermissionInterface, PersonHelper } from "@churchapps/apphelper";

interface Props { formId: string }

export const FormMembers: React.FC<Props> = (props) => {
  const [filterList, setFilterList] = useState<string[]>([]);
  const [formMembers, setFormMembers] = useState<MemberPermissionInterface[]>([]);

  const loadData = () => {
    ApiHelper.get("/memberpermissions/form/" + props.formId, "MembershipApi").then(results => {
      let filterMembers: string[] = [];
      results.forEach((member: MemberPermissionInterface) => filterMembers.push(member.memberId));
      setFilterList(filterMembers);
      setFormMembers(results);
    });
  }

  const addPerson = (p: PersonInterface) => {
    const newMember = {
      memberId: p.id,
      contentType: "form",
      contentId: props.formId,
      action: "view",
      personName: p.name.display
    };
    ApiHelper.post("/memberpermissions?formId=" + props.formId, [newMember], "MembershipApi").then(result => {
      let fm = [...formMembers];
      fm.push(result[0]);
      setFormMembers(fm);
    })
    updateFilterList(p.id, "add");
  }

  const handleActionChange = (personId: string, action: {}) => {
    let member;
    let fm = [...formMembers];
    const fmArray = fm.map((p: MemberPermissionInterface) => {
      if (p.memberId === personId) {
        p = {...p, ...action};
        member = p;
      }
      return p;
    });
    ApiHelper.post("/memberpermissions?formId=" + props.formId, [member], "MembershipApi");
    setFormMembers(fmArray);
  }


  const handleRemoveMember = (personId: string) => {
    updateFilterList(personId, "remove");
    let fm = [...formMembers];
    fm = fm.filter((p: MemberPermissionInterface) => p.memberId !== personId);
    setFormMembers(fm);
    ApiHelper.delete("/memberpermissions/member/" + personId + "?formId=" + props.formId, "MembershipApi");
  }

  const getRows = () => {
    let rows: JSX.Element[] = [];
    formMembers.forEach(fm => {
      rows.push(
        <TableRow key={fm.memberId}>
          <TableCell><Link to={"/people/" + fm.memberId}>{fm.personName}</Link></TableCell>
          <TableCell>
            <Stack direction="row" spacing={1}>
              <Button variant={fm.action === "admin" ? "contained" : "outlined"} onClick={(e) => { handleActionChange(fm.memberId, {action: "admin"}) }}>Admin</Button>
              <Button variant={fm.action === "view" ? "contained" : "outlined"} onClick={(e) => { handleActionChange(fm.memberId, {action: "view"}) }}>View Only</Button>
            </Stack>
          </TableCell>
          <TableCell>{<a href="about:blank" onClick={(e) => { e.preventDefault(); handleRemoveMember(fm.memberId); }} style={{display: "flex", alignItems: "center", color: "#dc3545"}}><Icon sx={{marginRight: "5px"}}>person_remove</Icon> Remove</a>}</TableCell>
          <TableCell><Switch checked={fm.emailNotification === true} onChange={(e) => { handleActionChange(fm.memberId, {emailNotification: e.target.checked}) }} /></TableCell>
        </TableRow>
      );
    });
    return rows;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    rows.push(<TableRow key="header" sx={{textAlign: "left"}}><th>Name</th><th>Permission</th><th>Action</th><th>Email Notification<Tooltip title="Whenever the form is submitted, you'll get notified via mail." arrow><IconButton><Info fontSize="small" color="primary" /></IconButton></Tooltip></th></TableRow>);
    return rows;
  }

  const getTable = () => (<Paper sx={{ width: "100%", overflowX: "auto" }}>
    <Table id="formMembersTable" padding="normal">
      <TableHead>{getTableHeader()}</TableHead>
      <TableBody sx={{padding: 0}}>{getRows()}</TableBody>
    </Table>
  </Paper>
  );

  const updateFilterList = (id: string, action: string) => {
    let fl = [...filterList];
    if (action === "add") fl.push(id);
    if (action === "remove") fl = fl.filter(memberId => memberId !== id);
    setFilterList(fl);
  }

  React.useEffect(loadData, [props.formId]);

  return (
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Form Members" headerIcon="group" help="chums/forms">
          {getTable()}
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        <DisplayBox headerText="Add Person" headerIcon="person_add">
          <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={addPerson} filterList={filterList} />
        </DisplayBox>
      </Grid>
    </Grid>
  );
}
