import React from "react";
import { useNavigate } from "react-router-dom";
import { ApiHelper, DateHelper, InputBox, PersonInterface, TaskInterface, UserHelper } from "@churchapps/apphelper";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Locale } from "@churchapps/apphelper";

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
    const peopleArray = [p];

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
        case "familyMember": {
          const newPerson: PersonInterface = { name: { first: value, last: p.name.last }, contactInfo: {}, householdId: p.householdId };
          peopleArray.push(newPerson);
        }
      }
    });

    await ApiHelper.post("/people", peopleArray, "MembershipApi");
    await ApiHelper.post("/tasks", [task], "DoingApi");
    navigate("/tasks");
  };

  return (
    <InputBox headerIcon="assignment_return" headerText={Locale.label("tasks.requestedChanges.requestedChanges")} saveText={Locale.label("tasks.requestedChanges.apply")} saveFunction={handleApply} isSubmitting={props.task.status === Locale.label("tasks.taskPage.closed")}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "1000 !important" }}>{Locale.label("tasks.requestedChanges.field")}</TableCell>
            <TableCell sx={{ fontWeight: "1000 !important" }}>{Locale.label("tasks.requestedChanges.value")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>
    </InputBox>
  );
};
