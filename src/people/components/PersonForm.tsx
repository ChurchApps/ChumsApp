import React, { useState } from "react";
import { FormSubmission } from "./";
import { Button, Icon } from "@mui/material";
import { type FormSubmissionInterface, FormSubmissionEdit, DisplayBox, type FormInterface } from "@churchapps/apphelper";

interface Props {
  contentType: string,
  contentId: string,
  form: FormInterface,
  formSubmissions: FormSubmissionInterface[],
  updatedFunction: () => void
}

export const PersonForm: React.FC<Props> = (props) => {
  const [mode, setMode] = useState("display");
  const [editFormSubmissionId, setEditFormSubmissionId] = useState("");

  let submission:FormSubmissionInterface = null;
  props.formSubmissions?.forEach(fs => {
    if (fs.formId===props.form?.id) submission = fs;
  });

  const handleEdit = (formSubmissionId: string) => { setMode("edit"); setEditFormSubmissionId(formSubmissionId); }

  const handleUpdate = () => {
    setMode("display");
    setEditFormSubmissionId("");
    props.updatedFunction();
  }

  const handleAdd = () => { setMode("edit"); }

  if (mode === "edit") return <FormSubmissionEdit formSubmissionId={editFormSubmissionId} updatedFunction={handleUpdate} addFormId={props.form?.id} contentType={props.contentType} contentId={props.contentId} personId={props.contentId} />;

  if (submission) return (<DisplayBox headerText={props.form.name} headerIcon="description">
    <FormSubmission formSubmissionId={submission.id} editFunction={handleEdit} />
  </DisplayBox>);
  else return (<DisplayBox headerText={props.form.name} headerIcon="description">
    <Button variant="text" onClick={() => handleAdd()}><Icon>add</Icon> Add Form</Button>
  </DisplayBox>);


}
