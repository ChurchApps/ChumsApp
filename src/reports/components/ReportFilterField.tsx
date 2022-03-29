import React from "react";
import { ReportInterface, ParameterInterface, ApiHelper, ArrayHelper, DateHelper } from "../../components";
import { FormControl } from "react-bootstrap";

interface Props {
  parameter: ParameterInterface,
  report: ReportInterface,
  onChange: (parameter: ParameterInterface, permittedChildIds: string[]) => void
}

export const ReportFilterField = (props: Props) => {

  const [rawData, setRawData] = React.useState<any[]>(null);
  const [secondaryData, setSecondaryData] = React.useState<any[]>(null);

  const init = async () => {
    switch (props.parameter.sourceKey) {
      case "month":
        setRawData(getMonths());
        break;
      case "campus":
        ApiHelper.get("/campuses", "AttendanceApi").then(data => { data.unshift({ id: "", name: "Any" }); setRawData(data); })
        break;
      case "service":
        ApiHelper.get("/services", "AttendanceApi").then(data => { data.unshift({ id: "", name: "Any" }); setRawData(data); })
        break;
      case "serviceTime":
        ApiHelper.get("/serviceTimes", "AttendanceApi").then(data => { data.unshift({ id: "", name: "Any" }); setRawData(data); })
        break;
      case "group":
        ApiHelper.get("/groups", "MembershipApi").then(data => { data.unshift({ id: "", name: "Any" }); setRawData(data); })
        ApiHelper.get("/groupServiceTimes", "AttendanceApi").then(data => { setSecondaryData(data); })
        break;
    }
    setDefaultValue();
  }

  const setDefaultValue = () => {
    switch (props.parameter.source) {
      case "date":
        if (props.parameter.defaultValue) {
          let dt = new Date();
          if (props.parameter.defaultValue === "yesterday") dt.setDate(dt.getDate() - 1);
          if (props.parameter.defaultValue === "lastYear") dt.setFullYear(dt.getFullYear() - 1);
          if (props.parameter.defaultValue === "lastSunday") dt = DateHelper.getLastSunday();
          const p = { ...props.parameter };
          p.value = DateHelper.formatHtml5Date(dt);
          props.onChange(p, []);
        }
        break;
    }
  }

  const getMonths = () => {
    const list = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novermber", "December"]
    const result = [];
    for (let i = 0; i < list.length; i++) result.push({ value: (i + 1).toString(), text: list[i] });
    return result;
  }

  const getIdName = () => {
    const result: { value: string, text: string }[] = [];
    filterOptions().forEach(d => { result.push({ value: d.id, text: d.name }); });
    return result;
  }

  const filterOptions = () => {
    let result = rawData;
    if (props.parameter.requiredParentIds?.length > 0) {
      switch (props.parameter.sourceKey) {
        case "service":
          result = ArrayHelper.getAllArray(rawData, "campusId", props.parameter.requiredParentIds);
          result.unshift({ id: "", name: "Any" });
          break;
        case "serviceTime":
          result = ArrayHelper.getAllArray(rawData, "serviceId", props.parameter.requiredParentIds);
          result.unshift({ id: "", name: "Any" });
          break;
        case "group":
          const times = ArrayHelper.getAllArray(secondaryData, "serviceTimeId", props.parameter.requiredParentIds)
          result = ArrayHelper.getAllArray(rawData, "id", ArrayHelper.getUniqueValues(times, "groupId"));
          result.unshift({ id: "", name: "Any" });
          break;
      }
    }
    return result;
  }

  const getOptions = () => {
    let options: { value: string, text: string }[] = []
    if (rawData) {
      switch (props.parameter.sourceKey) {
        case "campus":
        case "service":
        case "serviceTime":
        case "group":
          options = getIdName();
          break;
        case "month":
          options = rawData;
          break;
      }
    }

    const result: JSX.Element[] = [];

    options.forEach(o => { result.push(<option value={o.value}>{o.text}</option>) });
    return result;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const p = { ...props.parameter };
    p.value = e.currentTarget.value;
    let parentIds = [];
    if (p.value) parentIds.push(p.value);
    props.onChange(p, parentIds);
  }

  React.useEffect(() => { init() }, [props.parameter.keyName]); //eslint-disable-line

  let result = <></>
  switch (props.parameter.source) {
    case "dropdown":
      result = (<FormControl as="select" value={props.parameter.value} onChange={handleChange} name={props.parameter.keyName}>{getOptions()}</FormControl>);
      break;
    case "date":
      result = (<FormControl type="date" value={props.parameter.value} onChange={handleChange} name={props.parameter.keyName} />);
      break;
  }
  return result;

}
