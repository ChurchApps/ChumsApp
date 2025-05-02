import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { useState } from "react";
import { ChoicesEdit } from ".";
import { useMountedState, QuestionInterface, ApiHelper, InputBox, UniqueIdHelper, ErrorMessages } from "@churchapps/apphelper";
import { PaymentEdit } from "./PaymentEdit";
import { useAppTranslation } from "../../contexts/TranslationContext";

interface Props {
  questionId: string,
  formId: string,
  updatedFunction: () => void
}

export function FormQuestionEdit(props: Props) {
  const { t } = useAppTranslation();
  const [question, setQuestion] = useState<QuestionInterface>({ title: "", fieldType: "Textbox", placeholder: "", required: false, description: "", choices: null } as QuestionInterface);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isMounted = useMountedState();

  function loadData() {
    if (!isMounted()) {
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

  const getChoices = (fieldType: string) => {
    let result = <></>;
    switch (fieldType) {
      case "Multiple Choice":
      case "Checkbox":
        result = <ChoicesEdit question={question} updatedFunction={setQuestion} />;
        break;
      case "Payment":
        result = <PaymentEdit question={question} updatedFunction={setQuestion} />;
        break;
      default:
        result = <TextField fullWidth label={t("forms.formQuestionEdit.plcOp")} id="placeholder" type="text" name="placeholder" value={question.placeholder || ""} onChange={handleChange} />;
        break;
    }
    return result;
  }

  const validate = () => {
    const result = [];
    if (!question.title) result.push(t("forms.formQuestionEdit.questionReq"));
    if (!question.fieldType) result.push(t("forms.formQuestionEdit.fieldReq"));
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
    if (window.confirm(t("forms.formQuestionEdit.confirmMsg"))) {
      ApiHelper.delete("/questions/" + question.id + "/?formId=" + props.formId, "MembershipApi").then(props.updatedFunction);
    }
  }

  React.useEffect(loadData, [props.questionId || props.formId]); //eslint-disable-line

  return (
    <InputBox id="questionBox" headerIcon="help" headerText={t("forms.formQuestionEdit.questionEdit")} saveFunction={handleSave} cancelFunction={props.updatedFunction} isSubmitting={isSubmitting} deleteFunction={(!UniqueIdHelper.isMissing(question.id)) ? handleDelete : undefined} help="chums/forms">
      <ErrorMessages errors={errors} />
      <FormControl fullWidth>
        <InputLabel id="provider">{t("forms.formQuestionEdit.prov")}</InputLabel>
        <Select name="fieldType" labelId="provider" label={t("forms.formQuestionEdit.prov")} value={question.fieldType} onChange={handleChange}>
          <MenuItem value="Textbox">{t("forms.formQuestionEdit.textBox")}</MenuItem>
          <MenuItem value="Whole Number">{t("forms.formQuestionEdit.wholeNum")}</MenuItem>
          <MenuItem value="Decimal">{t("forms.formQuestionEdit.decNum")}</MenuItem>
          <MenuItem value="Date">{t("forms.formQuestionEdit.date")}</MenuItem>
          <MenuItem value="Yes/No">{t("forms.formQuestionEdit.yesNo")}</MenuItem>
          <MenuItem value="Email">{t("person.email")}</MenuItem>
          <MenuItem value="Phone Number">{t("forms.formQuestionEdit.phoneNum")}</MenuItem>
          <MenuItem value="Text Area">{t("forms.formQuestionEdit.textArea")}</MenuItem>
          <MenuItem value="Multiple Choice">{t("forms.formQuestionEdit.multiChoice")}</MenuItem>
          <MenuItem value="Checkbox">{t("forms.formQuestionEdit.checkBox")}</MenuItem>
          <MenuItem value="Payment">{t("forms.formQuestionEdit.payment")}</MenuItem>
        </Select>
      </FormControl>

      <TextField fullWidth label={t("common.title")} id="title" type="text" name="title" value={question.title || ""} onChange={handleChange} />
      <TextField fullWidth label={t("forms.formQuestionEdit.desc")} id="description" type="text" name="description" value={question.description || ""} onChange={handleChange} />

      {getChoices(question.fieldType)}
      {question.fieldType !== "Payment" && <FormControlLabel control={<Checkbox />} label={t("forms.formQuestionEdit.ansReq")} name="required" checked={!!question.required} onChange={handleCheckChange} />}
    </InputBox>
  );
}
