import React, { ChangeEvent } from "react";
import { ServiceInterface, InputBox, ErrorMessages, ApiHelper, CampusInterface, UniqueIdHelper } from "./";

interface Props {
    service: ServiceInterface,
    updatedFunction: () => void
}

export const ServiceEdit: React.FC<Props> = (props) => {
  const [service, setService] = React.useState({} as ServiceInterface);
  const [campuses, setCampuses] = React.useState([] as CampusInterface[]);
  const [errors, setErrors] = React.useState([]);

  const handleSave = () => {
    if (validate()) {
      let s = { ...service };
      if (UniqueIdHelper.isMissing(s.campusId)) s.campusId = campuses[0].id;
      ApiHelper.post("/services", [s], "AttendanceApi").then(props.updatedFunction);
    }
  }
  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this service?")) ApiHelper.delete("/services/" + service.id, "AttendanceApi").then(props.updatedFunction); }
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const loadData = React.useCallback(() => {
    ApiHelper.get("/campuses", "AttendanceApi").then(data => {
      setCampuses(data);
      if (data.length > 0) {
        if (UniqueIdHelper.isMissing(service?.campusId)) {
          let s = { ...props.service };
          s.campusId = data[0].id;
          setService(s);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.service]);

  const validate = () => {
    let errors = [];
    if (service.name === "") errors.push("Service name cannot be blank.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let s = { ...service };
    switch (e.currentTarget.name) {
    case "serviceName": s.name = e.currentTarget.value; break;
    case "campus": s.campusId = e.currentTarget.value; break;
    }
    setService(s);
  }

  const getCampusOptions = () => {
    let options = [];
    for (let i = 0; i < campuses.length; i++) options.push(<option value={campuses[i].id}>{campuses[i].name}</option>);
    return options;
  }

  React.useEffect(() => {
    setService(props.service);
    loadData();
  }, [props.service, loadData]);


  if (service === null || service.id === undefined) return null;

  return (
    <InputBox id="serviceBox" data-cy="service-box" cancelFunction={props.updatedFunction} saveFunction={handleSave} deleteFunction={handleDelete} headerText={service.name} headerIcon="far fa-calendar-alt">
      <ErrorMessages errors={errors} />
      <div className="form-group">
        <label>Campus</label>
        <select name="campus" data-cy="select-campus" className="form-control" value={service?.campusId || 0} onChange={handleChange} onKeyDown={handleKeyDown}>{getCampusOptions()}</select>
      </div>
      <div className="form-group">
        <label>Service Name</label>
        <input name="serviceName" data-cy="service-name" type="text" className="form-control" value={service?.name || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
    </InputBox>
  );
}
