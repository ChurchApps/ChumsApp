import React from "react";
import { ReportInterface, ParameterInterface, ApiHelper } from "../../components";
import { FormControl } from "react-bootstrap";

interface Props { parameter: ParameterInterface, report: ReportInterface, onChange: (parameter: ParameterInterface) => void }

export const ReportFilterField = (props: Props) => {

  const [rawData, setRawData] = React.useState<any[]>(null);

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
    rawData.forEach(d => { result.push({ value: d.id, text: d.name }); });
    return result;

  }

  const getOptions = () => {
    let options: { value: string, text: string }[] = []
    if (rawData) {
      switch (props.parameter.sourceKey) {
        case "group":
          options = getIdName();
          break;
        case "month":
          options = rawData;
          break;
        //case "manual": options = p.options; break;
      }
    }

    const result: JSX.Element[] = [];

    options.forEach(o => { result.push(<option value={o.value}>{o.text}</option>) });
    return result;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const p = { ...props.parameter };
    p.value = e.currentTarget.value;
    props.onChange(p);
  }

  React.useEffect(() => { init() }, [props.parameter.keyName]); //eslint-disable-line

  return (
    <FormControl as="select" value={props.parameter.value} onChange={handleChange} name={props.parameter.keyName}>
      {getOptions()}
    </FormControl>
  );

}
