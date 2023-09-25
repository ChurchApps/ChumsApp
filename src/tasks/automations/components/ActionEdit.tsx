import { Icon, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, ActionInterface, ApiHelper } from "@churchapps/apphelper";
import { ContentPicker } from "../../components/ContentPicker";

interface Props {
  action: ActionInterface,
  onCancel: () => void,
  onSave: (action: ActionInterface) => void,
}

export const ActionEdit = (props: Props) => {
  const [action, setAction] = React.useState<ActionInterface>(null);
  const [errors, setErrors] = React.useState([]);
  const [taskDetails, setTaskDetails] = React.useState<any>({});
  const [modalField, setModalField] = React.useState("");

  const init = () => {
    setAction(props.action);
    if (props.action.actionData) {
      const details = JSON.parse(props.action.actionData);
      setTaskDetails(details);
    }
  }

  React.useEffect(init, [props.action]);

  const validate = () => {
    const result: string[] = [];
    setErrors(result);
    return result.length === 0;
  }

  const handleSave = async () => {
    if (validate()) {
      ApiHelper.post("/actions", [action], "DoingApi").then(d => {
        props.onSave(d[0]);
      });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const val = e.target.value;
    const a = { ...action };
    switch (e.target.name) {
      case "actionType":
        a.actionType = val;
        break;
    }
    setAction(a);
  }

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const val = e.target.value;
    const d = { ...taskDetails };
    switch (e.target.name) {
      case "title":
        d.title = val;
        break;
      case "note":
        d.note = val;
        break;
    }
    setTaskDetails(d);
    updateActionData(d);
  }

  const updateActionData = (d: any) => {
    const a = { ...action };
    a.actionData = JSON.stringify(d);
    setAction(a);
  }

  const handleContentPicked = (contentType: string, contentId: string, label: string) => {
    const d = { ...taskDetails };
    switch (modalField) {
      case "assignedTo":
        d.assignedToType = contentType;
        d.assignedToId = contentId;
        d.assignedToLabel = label;
        break;
    }
    setTaskDetails(d);
    updateActionData(d);
    setModalField("");
  }

  const handleModalClose = () => { setModalField(""); }

  if (!action) return <></>
  return (
    <InputBox headerIcon="settings_suggest" headerText="Edit Action" saveFunction={handleSave} cancelFunction={props.onCancel} help="chums/automations">
      <ErrorMessages errors={errors} />
      <Select fullWidth label="Action Type" value={action?.actionType} onChange={handleChange}>
        <MenuItem value="task">Assign a Task</MenuItem>
      </Select>
      <TextField fullWidth label="Assign to" value={taskDetails.assignedToLabel || ""} InputProps={{ endAdornment: <Icon>search</Icon> }} onFocus={(e) => { e.target.blur(); setModalField("assignedTo") }} />
      <TextField fullWidth label="Task Title" value={taskDetails?.title || ""} name="title" onChange={handleDetailsChange} />
      <TextField fullWidth label="Task Note" value={taskDetails?.note || ""} name="note" onChange={handleDetailsChange} multiline={true} />
      {(modalField !== "") && <ContentPicker onClose={handleModalClose} onSelect={handleContentPicked} />}
    </InputBox>
  );
}
