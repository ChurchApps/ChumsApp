import React from "react";
import { ApiHelper, GroupInterface, InputBox, ErrorMessages, ServiceTimesEdit } from ".";
import { Navigate } from "react-router-dom";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { Grid, TextField } from "@mui/material"

interface Props { group: GroupInterface, updatedFunction: (group: GroupInterface) => void }

export const GroupDetailsEdit: React.FC<Props> = (props) => {
  const [group, setGroup] = React.useState<GroupInterface>({} as GroupInterface);
  const [errors, setErrors] = React.useState([]);
  const [redirect, setRedirect] = React.useState("");

  const handleCancel = () => props.updatedFunction(group);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    let g = { ...group };
    switch (e.currentTarget.name) {
      case "categoryName": g.categoryName = e.currentTarget.value; break;
      case "name": g.name = e.currentTarget.value; break;
      case "trackAttendance": g.trackAttendance = (e.currentTarget.value === "true"); break;
      case "parentPickup": g.parentPickup = (e.currentTarget.value === "true"); break;
    }
    setGroup(g);
  }

  const validate = () => {
    let errors = [];
    if (group.categoryName === "") errors.push("Please enter a category name.");
    if (group.name === "") errors.push("Please enter a group name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/groups", [group], "MembershipApi").then(data => {
        setGroup(data);
        props.updatedFunction(data);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this group?")) {
      ApiHelper.delete("/groups/" + group.id.toString(), "MembershipApi").then(() => setRedirect("/groups"));
    }
  }

  React.useEffect(() => { setGroup(props.group) }, [props.group]);

  if (redirect !== "") return <Navigate to={redirect} />
  else return (
    <InputBox id="groupDetailsBox" headerText="Group Details" headerIcon="fas fa-list" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <TextField fullWidth type="text" name="categoryName" label="Category Name" value={group.categoryName} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
        <Grid item md={6} xs={12}>
          <FormGroup>
            <FormLabel>Group Name</FormLabel>
            <FormControl type="text" name="name" value={group.name} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <FormGroup>
            <FormLabel htmlFor="trackAttendance">Track Attendance</FormLabel>
            <FormControl as="select" id="trackAttendance" name="trackAttendance" data-cy="select-attendance-type" value={group.trackAttendance?.toString() || "false"} onChange={handleChange} onKeyDown={handleKeyDown}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </FormControl>
          </FormGroup>
        </Grid>
        <Grid item md={6} xs={12}>
          <FormGroup>
            <FormLabel>Parent Pickup</FormLabel>
            <FormControl as="select" name="parentPickup" value={group.parentPickup?.toString() || "false"} onChange={handleChange} onKeyDown={handleKeyDown}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </FormControl>
          </FormGroup>
        </Grid>
      </Grid>
      <ServiceTimesEdit group={group} />

    </InputBox>
  );
}

