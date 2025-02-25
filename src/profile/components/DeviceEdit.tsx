import React, { useEffect } from "react";
import { SelectChangeEvent, TextField } from "@mui/material";
import { ApiHelper, ErrorMessages, InputBox } from "@churchapps/apphelper";
import { DeviceInterface } from "../DevicesPage";
import { DeviceContent } from "./DeviceContent";

interface Props { device: DeviceInterface, updatedFunction: () => void }

export const DeviceEdit = (props: Props) => {
  const [device, setDevice] = React.useState<DeviceInterface>(props.device);
  const [errors, setErrors] = React.useState<string[]>([]);

  useEffect(() => {
    setDevice(props.device);
  }, [props.device]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setErrors([]);
    let value = e.target.value;
    const d = { ...device };
    switch (e.target.name) {
      case "label": d.label = value; break;
    }
    setDevice(d);
  }


  const validate = () => {
    const result = [];
    if (!device.label) result.push("Please enter a label for this device.");
    setErrors(result);
    return result.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/devices", [device], "MessagingApi").then((data) => { props.updatedFunction(); });
    }
  }

  return (<>
    <ErrorMessages errors={errors} />
    <InputBox headerText="Edit Device" headerIcon="tv" saveFunction={handleSave} cancelFunction={props.updatedFunction}>
      <TextField fullWidth label="Label" name="label" type="text" value={device?.label} onChange={handleChange} />
      <DeviceContent device={device} />
    </InputBox>
  </>);
}

