import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { useState } from "react";
import { ChoicesEdit } from ".";
import { useMountedState, QuestionInterface, ApiHelper, InputBox, UniqueIdHelper, ErrorMessages } from "@churchapps/apphelper";

interface Props {
  questionId: string,
  formId: string,
  updatedFunction: () => void
}

export function FormQuestionEdit(props: Props) {
  const [question, setQuestion] = useState<QuestionInterface>({ title: "", fieldType: "Textbox", placeholder: "", required: false, description: "", choices: null } as QuestionInterface);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isMounted = useMountedState();

  function loadData() {
    if(!isMounted()) {
      return;
    }
    if (props.questionId) ApiHelper.get("/questions/" + props.questionId + "?formId=" + props.formId, "MembershipApi").then((data: QuestionInterface) => setQuestion(data));
    else setQuestion({ formId: props.formId, fieldType: "Textbox" } as QuestionInterface);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setErrors([]);
    const q = { ...question } as QuestionInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "fieldType": q.fieldType = value; break;
      case "title": q.title = value; break;
      case "description": q.description = value; break;
      case "placeholder": q.placeholder = value; break;
    }
    setQuestion(q);
  }

  const handleCheckChange = (e: React.SyntheticEvent<Element | Event>, checked: boolean) => {
    setErrors([]);
    const q = { ...question } as QuestionInterface;
    q.required = checked;
    setQuestion(q);
  }

  const validate = () => {
    const result = [];
    if (!question.title) result.push("Question is required.");
    if (!question.fieldType) result.push("Field type is required.");
    setErrors(result);
    return result.length === 0;
  }

  function handleSave() {
    if (validate()) {
      setIsSubmitting(true);
      ApiHelper.post("/questions/", [question], "MembershipApi").then(() => props.updatedFunction()).finally(() => { setIsSubmitting(false) });
    }
  }

  function handleDelete() {
    if (window.confirm("Are you sure you wish to permanently delete this question?")) {
      ApiHelper.delete("/questions/" + question.id + "/?formId=" + props.formId, "MembershipApi").then(props.updatedFunction);
    }
  }

  React.useEffect(loadData, [props.questionId || props.formId]); //eslint-disable-line

  return (
    <InputBox id="questionBox" headerIcon="help" headerText="Edit Question" saveFunction={handleSave} cancelFunction={props.updatedFunction} isSubmitting={isSubmitting} deleteFunction={(!UniqueIdHelper.isMissing(question.id)) ? handleDelete : undefined}>
      <ErrorMessages errors={errors} />
      <FormControl fullWidth>
        <InputLabel id="provider">Provider</InputLabel>
        <Select name="fieldType" labelId="provider" label="Provider" value={question.fieldType} onChange={handleChange}>
          <MenuItem value="Textbox">Textbox</MenuItem>
          <MenuItem value="Whole Number">Whole Number</MenuItem>
          <MenuItem value="Decimal">Decimal</MenuItem>
          <MenuItem value="Date">Date</MenuItem>
          <MenuItem value="Yes/No">Yes/No</MenuItem>
          <MenuItem value="Email">Email</MenuItem>
          <MenuItem value="Phone Number">Phone Number</MenuItem>
          <MenuItem value="Text Area">Text Area</MenuItem>
          <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
        </Select>
      </FormControl>

      <TextField fullWidth label="Title" id="title" type="text" name="title" value={question.title || ""} onChange={handleChange} />
      <TextField fullWidth label="Description" id="description" type="text" name="description" value={question.description || ""} onChange={handleChange} />

      {
        question.fieldType === "Multiple Choice"
          ? <ChoicesEdit question={question} updatedFunction={setQuestion} />
          : <TextField fullWidth label="Placeholder (optional)" id="placeholder" type="text" name="placeholder" value={question.placeholder || ""} onChange={handleChange} />
      }
      <FormControlLabel control={<Checkbox />} label="Require an answer for this question" name="required" checked={!!question.required} onChange={handleCheckChange} />
    </InputBox>
  );
}
