import React from "react";
import { InputBox, ApiHelper, UniqueIdHelper, ErrorMessages } from "./";
import { FormControl, InputLabel, Select, SelectChangeEvent, TextField, MenuItem } from "@mui/material";
import { useMountedState, ServiceInterface, CampusInterface } from "@churchapps/apphelper";

interface Props {
  service: ServiceInterface,
  updatedFunction: () => void
}

export const ServiceEdit: React.FC<Props> = (props) => {
  const [service, setService] = React.useState({} as ServiceInterface);
  const [campuses, setCampuses] = React.useState([] as CampusInterface[]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isMounted = useMountedState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setErrors([]);
    const s = { ...service } as ServiceInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "name": s.name = value; break;
      case "campus": s.campusId = value; break;
    }
    setService(s);
  }

  const validate = () => {
    const result = [];
    if (!service.name) result.push("Service name is required.");
    if (!service.campusId) result.push("Please select a campus.");
    setErrors(result);
    return result.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      setIsSubmitting(true);
      ApiHelper.post("/services", [service], "AttendanceApi").then(props.updatedFunction)
        .finally(() => { setIsSubmitting(false) });
    }
  }
  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this service?")) ApiHelper.delete("/services/" + service.id, "AttendanceApi").then(props.updatedFunction); }

  const loadData = React.useCallback(() => {
    ApiHelper.get("/campuses", "AttendanceApi").then(data => {
      if(isMounted()) {
        setCampuses(data);
      }
      if (data.length > 0) {
        if (UniqueIdHelper.isMissing(service?.campusId)) {
          let s = { ...props.service };
          s.campusId = data[0].id;
          if(isMounted()) {
            setService(s);
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.service, isMounted]);

  const getCampusOptions = () => {
    let options = [];
    for (let i = 0; i < campuses.length; i++) options.push(<MenuItem key={i} value={campuses[i].id}>{campuses[i].name}</MenuItem>);
    return options;
  }

  React.useEffect(() => {
    setService(props.service);
    loadData();
  }, [props.service, loadData, isMounted]);

  if (service === null || service.id === undefined) return null;

  return (
    <InputBox id="serviceBox" data-cy="service-box" cancelFunction={props.updatedFunction} saveFunction={handleSave} deleteFunction={props.service?.id ? handleDelete : null} headerText={service.name} headerIcon="calendar_month" isSubmitting={isSubmitting}>
      <ErrorMessages errors={errors} />
      <FormControl fullWidth>
        <InputLabel id="campus">Campus</InputLabel>
        <Select name="campus" labelId="campus" label="Campus" value={service.campusId} onChange={handleChange}>
          {getCampusOptions()}
        </Select>
      </FormControl>
      <TextField fullWidth label="Service Name" id="name" name="name" type="text" value={service.name} onChange={handleChange} />
    </InputBox>
  );
}
