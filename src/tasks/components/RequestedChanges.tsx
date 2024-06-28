import React from "react";
import { useNavigate } from "react-router-dom";
import { ApiHelper, DateHelper, InputBox, PersonInterface, TaskInterface, UserHelper } from "@churchapps/apphelper";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

interface Props { task: TaskInterface; }

export const RequestedChanges = (props: Props) => {
  const requestedChanges: { field: string; label: string; value: string }[] = JSON.parse(props.task?.data);
  const navigate = useNavigate();

  const getRows = () => {
    let rows: JSX.Element[] = [];
    requestedChanges?.forEach((ch, i) => {
      let val: any = ch.value;
      if (ch.field === "photo") val = <img src={ch.value} style={{ maxWidth: "70px", maxHeight: "70px" }} alt="New Profile Pic" />
      rows.push(
        <TableRow key={i}>
          <TableCell>{ch.label}</TableCell>
          <TableCell>{val}</TableCell>
        </TableRow>
      );
    });
    return rows;
  };

  const handleApply = async () => {
    let task: TaskInterface = { ...props.task, status: "Closed", dateClosed: new Date() };
    const person = await ApiHelper.get("/people/" + props.task.associatedWithId, "MembershipApi");
    let p = { ...person } as PersonInterface;

    requestedChanges.forEach((change) => {
      const value = change.value;
      switch (change.field) {
        case "name.first": p.name.first = value; break;
        case "name.middle": p.name.middle = value; break;
        case "name.last": p.name.last = value; break;
        case "photo": {
          p.photo = value;
          const getTime = value.split("?dt=")[1];
          p.photoUpdated = new Date(+getTime); break;
        }
        case "birthDate": p.birthDate = DateHelper.convertToDate(value); break;
        case "contactInfo.email": p.contactInfo.email = value; break;
        case "contactInfo.address1": p.contactInfo.address1 = value; break;
        case "contactInfo.address2": p.contactInfo.address2 = value; break;
        case "contactInfo.city": p.contactInfo.city = value; break;
        case "contactInfo.state": p.contactInfo.state = value; break;
        case "contactInfo.zip": p.contactInfo.zip = value; break;
        case "contactInfo.homePhone": p.contactInfo.homePhone = value; break;
        case "contactInfo.mobilePhone": p.contactInfo.mobilePhone = value; break;
        case "contactInfo.workPhone": p.contactInfo.workPhone = value; break;
      }
    });

    await ApiHelper.post("/people", [p], "MembershipApi");
    await ApiHelper.post("/tasks", [task], "DoingApi");
    navigate("/tasks");
  };

  return (
    <InputBox headerIcon="assignment_return" headerText="Requested Changes" saveText="Apply" saveFunction={handleApply} isSubmitting={props.task.status === "Closed"}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "1000 !important" }}>Field</TableCell>
            <TableCell sx={{ fontWeight: "1000 !important" }}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>
    </InputBox>
  );
};
