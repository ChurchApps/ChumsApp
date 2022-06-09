import React from "react";
import { ServiceTimeInterface, ServiceInterface, InputBox, ApiHelper } from "./";
import { ErrorMessages } from "../../components";
import { FormControl, InputLabel, Select, SelectChangeEvent, TextField } from "@mui/material";

interface Props {
  serviceTime: ServiceTimeInterface,
  updatedFunction: () => void
}

export const ServiceTimeEdit: React.FC<Props> = (props) => {
  const [serviceTime, setServiceTime] = React.useState({} as ServiceTimeInterface);
  const [services, setServices] = React.useState([] as ServiceInterface[]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setErrors([]);
    const st = { ...serviceTime } as ServiceTimeInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "name": st.name = value; break;
      case "serviceId": st.serviceId = value; break;
    }
    setServiceTime(st);
  }

  const validate = () => {
    const result = [];
    if (!serviceTime.name) result.push("Service time name is required.");
    if (!serviceTime.serviceId) result.push("Please select a servie");
    setErrors(result);
    return result.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      setIsSubmitting(true)
      ApiHelper.post("/servicetimes", [serviceTime], "AttendanceApi")
        .then(props.updatedFunction)
        .finally(() => { setIsSubmitting(false) });
    }
  }
  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this service time?")) ApiHelper.delete("/servicetimes/" + serviceTime.id, "AttendanceApi").then(props.updatedFunction); }

  const loadData = React.useCallback(() => {
    ApiHelper.get("/services", "AttendanceApi").then(data => {
      setServices(data);
      if (data.length > 0) {
        let st = { ...props.serviceTime };
        st.serviceId = data[0].id;
        setServiceTime(st);
      }
    });
  }, [props.serviceTime]);

  const getServiceOptions = () => {
    let options = [];
    for (let i = 0; i < services.length; i++) options.push(<option value={services[i].id}>{services[i].name}</option>);
    return options;
  }

  React.useEffect(() => {
    setServiceTime(props.serviceTime);
    loadData();
  }, [props.serviceTime, loadData]);

  if (serviceTime === null || serviceTime.id === undefined) return null;
  return (
    <InputBox id="serviceTimeBox" data-cy="service-time-box" cancelFunction={props.updatedFunction} saveFunction={handleSave} deleteFunction={props.serviceTime?.id ? handleDelete : null} headerText={serviceTime.name} isSubmitting={isSubmitting} headerIcon="schedule">
      <ErrorMessages errors={errors} />
      <FormControl fullWidth>
        <InputLabel>Service</InputLabel>
        <Select name="service" value={serviceTime.serviceId} onChange={handleChange}>
          {getServiceOptions()}
        </Select>
      </FormControl>
      <TextField fullWidth label="Service Time Name" id="name" name="name" type="text" value={serviceTime.name} onChange={handleChange} />
    </InputBox>
  );
}
