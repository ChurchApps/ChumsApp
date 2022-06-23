import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { useState } from "react";
import { ApiHelper, InputBox, FormInterface, DateHelper } from ".";
import { ErrorMessages } from "../../components";

interface Props { formId: string, updatedFunction: () => void }

export function FormEdit(props: Props) {
  const [form, setForm] = useState<FormInterface>({ name: "", contentType: "person" } as FormInterface);
  const [standAloneForm, setStandAloneForm] = useState<boolean>(false);
  const [showDates, setShowDates] = useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function loadData() {
    if (props.formId) {
      ApiHelper.get("/forms/" + props.formId, "MembershipApi").then((data: FormInterface) => {
        if (data.restricted !== undefined && data.contentType === "form")
          setStandAloneForm(true);
        else
          setStandAloneForm(false);
        setForm(data);
        setShowDates(!!data.accessEndTime);
      });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setErrors([]);
    const f = { ...form } as FormInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "name": f.name = value; break;
      case "contentType": f.contentType = value; break;
      case "restricted": f.restricted = value === "true"; break;
      case "accessStartTime": f.accessStartTime = showDates ? DateHelper.convertToDate(value) : null; break;
      case "accessEndTime": f.accessEndTime = showDates ? DateHelper.convertToDate(value) : null; break;
    }
    setForm(f);
  }

  const validate = () => {
    const result = [];
    if (!form.name) result.push("Form name is required.");
    if (showDates) {
      if (!form.accessStartTime) result.push("Start date is required.");
      if (!form.accessEndTime) result.push("End date is required.");
    }
    setErrors(result);
    return result.length === 0;
  }

  function handleSave() {
    if (validate()) {
      setIsSubmitting(true);
      const f = form;
      if (showDates) {
        f.accessEndTime = null;
        f.accessStartTime = null;
      }

      ApiHelper.post("/forms", [f], "MembershipApi")
        .then(props.updatedFunction)
        .finally(() => { setIsSubmitting(false) })
    }
  }

  function handleDelete() {
    if (window.confirm("Are you sure you wish to permanently delete this form?")) {
      ApiHelper.delete("/forms/" + form.id, "MembershipApi")
        .then(() => props.updatedFunction());
    }
  }

  React.useEffect(loadData, [props.formId]);

  return (
    <InputBox id="formBox" headerIcon="format_align_left" headerText="Edit Form" saveFunction={handleSave} isSubmitting={isSubmitting} cancelFunction={props.updatedFunction} deleteFunction={(props.formId) ? handleDelete : undefined}>
      <ErrorMessages errors={errors} />
      <TextField fullWidth={true} label="Form Name" type="text" name="name" value={form.name} onChange={handleChange} />
      {!props.formId
        && <FormControl fullWidth>
          <InputLabel id="associate">Associate With</InputLabel>
          <Select name="contentType" labelId="associate" label="Associate With" value={form.contentType} onChange={e => { handleChange(e); if (e.target.value === "form") setStandAloneForm(true); }}>
            <MenuItem value="person">People</MenuItem>
            <MenuItem value="form">Stand Alone</MenuItem>
          </Select>
        </FormControl>
      }
      {standAloneForm
        && <>
          <FormControl fullWidth>
            <InputLabel>Form Access</InputLabel>
            <Select label="Form Access" name="restricted" value={form?.restricted?.toString()} onChange={handleChange}>
              <MenuItem value="false">Public</MenuItem>
              <MenuItem value="true">Restricted</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Set Form Availability Timeframe</InputLabel>
            <Select label="Set Form Availability Timeframe" name="limit" value={showDates.toString()} onChange={e => { setShowDates(e.target.value === "true") }}>
              <MenuItem value="false">No</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
            </Select>
          </FormControl>
        </>
      }
      {showDates
        && <>
          <TextField fullWidth={true} type="date" label="Availability Start Date" InputLabelProps={{shrink: true}} name="accessStartTime" value={DateHelper.formatHtml5Date(form.accessStartTime)} onChange={handleChange}
            InputProps={{ inputProps: { max: DateHelper.formatHtml5Date(form.accessEndTime) } }}
          />
          <TextField fullWidth={true} type="date" label="Availability End Date" InputLabelProps={{shrink: true}} name="accessEndTime" value={DateHelper.formatHtml5Date(form.accessEndTime)} onChange={handleChange}
            InputProps={{ inputProps: { min: DateHelper.formatHtml5Date(form.accessStartTime) } }}
          />
        </>
      }
    </InputBox>
  );
}
