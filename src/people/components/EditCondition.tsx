import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import React from "react";
import { ApiHelper, SearchCondition, Permissions, GroupInterface, Loading, FundInterface, CampusInterface, DateHelper, ServiceInterface, ServiceTimeInterface, Locale } from "@churchapps/apphelper";
import { useAppTranslation } from "../../contexts/TranslationContext";

interface Props {
  conditionAdded: (condition: any) => void
}

export function EditCondition(props: Props) {
  const { t } = useAppTranslation();

  const [condition, setCondition] = React.useState<SearchCondition>({ field: "displayName", operator: "equals", value: "" });
  const [loadedOptions, setLoadedOptions] = React.useState<any[]>([]);
  const [loadedOptionsField, setLoadedOptionsField] = React.useState("");
  const [loadingOptions, setLoadingOptions] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    let c = { ...condition };
    const { name, value } = e.target;

    switch (name) {
      case "field":
        c.field = value;
        c.operator = "equals";
        c.value = "";
        break;
      case "operator":
        c.operator = value;
        if (c.field === "memberDonations" || c.field === "memberAttendance") {
          c.value = "";
        }
        break;
      case "value":
        const parsedValue = (c.field === "memberAttendance" || c.field === "memberDonations") && JSON.parse(c?.value);
        c.value = e.target.value;
        if (parsedValue && Array.isArray(parsedValue)) {
          const newValue = [JSON.parse(e.target.value), parsedValue[1]];
          c.value = JSON.stringify(newValue);
        }
        break;
      case "from":
        const parsed = JSON.parse(c?.value);
        let newObj;
        if (Array.isArray(parsed)) {
          newObj = [{ value: parsed[0].value, text: parsed[0].text }, { from: e.target.value, to: parsed[1]?.to }];
        } else {
          newObj = [{ value: parsed.value, text: parsed.text }, { from: e.target.value, to: parsed.to }];
        }
        c.value = JSON.stringify(newObj);
        break;
      case "to":
        const parsedObj = JSON.parse(c?.value);
        let obj;
        if (Array.isArray(parsedObj)) {
          obj = [{ value: parsedObj[0].value, text: parsedObj[0].text }, { from: parsedObj[1]?.from, to: e.target.value }];
        } else {
          obj = [{ value: parsedObj.value, text: parsedObj.text }, { from: parsedObj?.from, to: e.target.value }];
        }
        c.value = JSON.stringify(obj);
        break;
    }
    setCondition(c);
  }

  const setDefaultValue = (val: string) => {
    if (!condition.value && val !== "") {
      let c = { ...condition }
      c.value = val;
      setCondition(c);
    }
  }

  const getValueField = () => {
    let options: JSX.Element[] = [];
    let result: JSX.Element = null;
    switch (condition.field) {
      case "gender":
        options = [<MenuItem key="/Unspecified" value="Unspecified">{t("person.unspecified")}</MenuItem>, <MenuItem value="Male">{t("person.male")}</MenuItem>, <MenuItem value="Female">{t("person.female")}</MenuItem>]
        setDefaultValue("Unspecified");
        result = getValueSelect(options);
        break;
      case "maritalStatus":
        options = [<MenuItem key="/Unknown" value="Unknown">{t("person.unknown")}</MenuItem>, <MenuItem value="Single">{t("person.single")}</MenuItem>, <MenuItem value="Married">{t("person.married")}</MenuItem>, <MenuItem value="Divorced">{t("person.divorced")}</MenuItem>, <MenuItem value="Widowed">{t("person.widowed")}</MenuItem>]
        setDefaultValue("Unknown");
        result = getValueSelect(options);
        break;
      case "membershipStatus":
        options = [<MenuItem key="/Visitor" value="Visitor">{t("person.visitor")}</MenuItem>, <MenuItem key="Regular Attendee" value="Regular Attendee">{t("person.regularAttendee")}</MenuItem>, <MenuItem value="Member">{t("person.member")}</MenuItem>, <MenuItem value="Staff">{t("person.staff")}</MenuItem>, <MenuItem key="Inactive" value="Inactive">{t("person.inactive")}</MenuItem>]
        setDefaultValue("Visitor");
        result = getValueSelect(options);
        break;
      case "groupMember":
        loadedOptions.forEach((o, i) => { options.push(<MenuItem key={i} value={JSON.stringify(o)}>{o.text}</MenuItem>); });
        setDefaultValue((loadedOptions?.length > 0) ? JSON.stringify(loadedOptions[0]) : "");
        result = getValueSelect(options);
        break;
      case "birthMonth":
      case "anniversaryMonth":
        options = [<MenuItem key="January" value="1">{t("month.jan")}</MenuItem>, <MenuItem key="February" value="2">{t("month.feb")}</MenuItem>, <MenuItem key="March" value="3">{t("month.mar")}</MenuItem>, <MenuItem key="April" value="4">{t("month.apr")}</MenuItem>, <MenuItem key="May" value="5">{t("month.may")}</MenuItem>, <MenuItem key="June" value="6">{t("month.june")}</MenuItem>, <MenuItem key="July" value="7">{t("month.july")}</MenuItem>, <MenuItem key="August" value="8">{t("month.aug")}</MenuItem>, <MenuItem key="September" value="9">{t("month.sep")}</MenuItem>, <MenuItem key="October" value="10">{t("month.oct")}</MenuItem>, <MenuItem key="November" value="11">{t("month.nov")}</MenuItem>, <MenuItem key="December" value="12">{t("month.dec")}</MenuItem>]
        setDefaultValue("1");
        result = getValueSelect(options);
        break;
      case "birthDate":
      case "anniversary":
        result = <TextField fullWidth label="Value" type="date" InputLabelProps={{ shrink: true }} style={{ marginBottom: 5 }} name="value" placeholder="Value" value={condition.value} onChange={handleChange} />
        break;
      case "age":
      case "yearsMarried":
        result = <TextField fullWidth label="Value" type="number" style={{ marginBottom: 5 }} name="value" placeholder="Value" value={condition.value} onChange={handleChange} />
        break;
      case "memberDonations":
        let defaultDonationValue;
        if (condition.operator === "donatedToAny") {
          options.push(<MenuItem key="any" value={JSON.stringify({ value: "any", text: "Any" })}>{t("people.editCondition.any")}</MenuItem>);
          defaultDonationValue = JSON.stringify([{ value: "any", text: "Any" }, { from: DateHelper.formatHtml5Date(new Date()), to: DateHelper.formatHtml5Date(new Date()) }]);
        } else {
          loadedOptions.forEach((o, i) => { options.push(<MenuItem key={i} value={JSON.stringify(o)}>{o.text}</MenuItem>); });
          defaultDonationValue = (loadedOptions?.length > 0) ? JSON.stringify([loadedOptions[0], { from: DateHelper.formatHtml5Date(new Date()), to: DateHelper.formatHtml5Date(new Date()) }]) : "";
        }
        setDefaultValue(defaultDonationValue);
        result = <>
          {getValueSelect(options)}
          <Stack direction="row" spacing={2} sx={{ marginTop: "16px", marginBottom: "8px" }}>
            <TextField fullWidth label={t("people.editCondition.from")} name="from" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
            <TextField fullWidth label={t("people.editCondition.to")} name="to" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
          </Stack>
        </>;
        break;
      case "memberAttendance":
        let defaultAttendanceValue;
        const defaultDateObj = { from: DateHelper.formatHtml5Date(new Date()), to: DateHelper.formatHtml5Date(new Date()) };
        if (condition.operator === "attendedAny") {
          options.push(<MenuItem key="any" value={JSON.stringify({ value: "any", text: "Any" })}>{t("people.editCondition.any")}</MenuItem>);
          defaultAttendanceValue = JSON.stringify([{ value: "any", text: "Any" }, defaultDateObj]);
        }
        else if (condition.operator === "attendedService") {
          const serviceOptions: any[] = loadedOptions.length > 0 && loadedOptions.filter(item => 'services' in item)[0]?.services;
          serviceOptions && serviceOptions.forEach((o, i) => { options.push(<MenuItem key={i} value={JSON.stringify(o)}>{o.text}</MenuItem>); });
          defaultAttendanceValue = (serviceOptions?.length > 0) ? JSON.stringify([serviceOptions[0], defaultDateObj]) : "";
        }
        else if (condition.operator === "attendedServiceTime") {
          const serviceTimeOptions: any[] = loadedOptions.length > 0 && loadedOptions.filter(item => 'serviceTimes' in item)[0]?.serviceTimes;
          serviceTimeOptions && serviceTimeOptions.forEach((o, i) => { options.push(<MenuItem key={i} value={JSON.stringify(o)}>{o.text}</MenuItem>); });
          defaultAttendanceValue = (serviceTimeOptions?.length > 0) ? JSON.stringify([serviceTimeOptions[0], defaultDateObj]) : "";
        }
        else if (condition.operator === "attendedGroup") {
          const groupOptions: any[] = loadedOptions.length > 0 && loadedOptions.filter(item => 'groups' in item)[0]?.groups;
          groupOptions && groupOptions.forEach((o, i) => { options.push(<MenuItem key={i} value={JSON.stringify(o)}>{o.text}</MenuItem>); });
          defaultAttendanceValue = (groupOptions?.length > 0) ? JSON.stringify([groupOptions[0], defaultDateObj]) : "";
        }
        else {
          const campusOptions: any[] = loadedOptions.length > 0 && loadedOptions.filter(item => 'campuses' in item)[0]?.campuses;
          campusOptions && campusOptions.forEach((o, i) => { options.push(<MenuItem key={i} value={JSON.stringify(o)}>{o.text}</MenuItem>); });
          defaultAttendanceValue = (campusOptions?.length > 0) ? JSON.stringify([campusOptions[0], defaultDateObj]) : "";
        }
        setDefaultValue(defaultAttendanceValue);
        result = <>
          {getValueSelect(options)}
          <Stack direction="row" spacing={2} sx={{ marginTop: "16px", marginBottom: "8px" }}>
            <TextField fullWidth label={t("people.editCondition.from")} name="from" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
            <TextField fullWidth label={t("people.editCondition.to")} name="to" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
          </Stack>
        </>;
        break;
      default:
        result = <TextField fullWidth label="Value" style={{ marginBottom: 5 }} name="value" type="text" placeholder="Value" value={condition.value} onChange={handleChange} />
        break;
    }
    return result;
  }

  React.useEffect(() => {
    if (condition.field !== loadedOptionsField) {
      setLoadedOptionsField(condition.field);
      if (condition.field === "groupMember") {
        setLoadingOptions(true);
        ApiHelper.get("/groups", "MembershipApi").then((groups: GroupInterface[]) => {
          const options: any[] = [];
          groups.forEach(g => { options.push({ value: g.id, text: g.name }); });
          setLoadedOptions(options);
          setLoadingOptions(false);
        });
      }
      if (condition.field === "memberDonations") {
        setLoadingOptions(true);
        ApiHelper.get("/funds", "GivingApi").then((funds: FundInterface[]) => {
          const options: any[] = [];
          funds.forEach(f => { options.push({ value: f.id, text: f.name }); });
          setLoadedOptions(options);
          setLoadingOptions(false);
        })
      }
      if (condition.field === "memberAttendance") {
        const optionsArray: any[] = [];
        setLoadingOptions(true);
        ApiHelper.get("/campuses", "AttendanceApi").then((campuses: CampusInterface[]) => {
          const options: any[] = [];
          campuses.forEach(c => { options.push({ value: c.id, text: c.name }); });
          optionsArray.push({ campuses: options });
        });
        ApiHelper.get("/services", "AttendanceApi").then((services: ServiceInterface[]) => {
          const options: any[] = [];
          services.forEach(s => { options.push({ value: s.id, text: `${s.campus.name} - ${s.name}` }); });
          optionsArray.push({ services: options });
        });
        ApiHelper.get("/serviceTimes", "AttendanceApi").then((serviceTimes: ServiceTimeInterface[]) => {
          const options: any[] = [];
          serviceTimes.forEach(st => { options.push({ value: st.id, text: st.longName }); });
          optionsArray.push({ serviceTimes: options });
        });
        ApiHelper.get("/groups", "MembershipApi").then((groups: GroupInterface[]) => {
          const options: any[] = [];
          groups.forEach(g => { options.push({ value: g.id, text: g.name }); });
          optionsArray.push({ groups: options });
          setLoadingOptions(false);
        });
        setLoadedOptions(optionsArray);
      }
    }
  }, [condition?.field.toString()]); //eslint-disable-line

  const getValueSelect = (options: JSX.Element[]) => {
    const parsedValue = (condition.field === "memberAttendance" || condition.field === "memberDonations") && condition.value !== "" && JSON.parse(condition.value);
    const selectValue = (parsedValue && Array.isArray(parsedValue)) ? JSON.stringify(parsedValue[0]) : condition.value;
    return (<FormControl fullWidth>
      <InputLabel>{t("people.editCondition.value")}</InputLabel>
      <Select name="value" label={t("people.editCondition.value")} type="text" placeholder="Value" value={selectValue} onChange={handleChange}>
        {options}
      </Select>
    </FormControl>)
  }

  const getOperatorOptions = () => {
    let result = [];

    switch (condition?.field) {
      case "gender":
        result = [
          <MenuItem key="/gender-equals" value="equals">=</MenuItem>,
          <MenuItem key="/gender-notEquals" value="notEquals">!=</MenuItem>
        ]
        break;
      case "groupMember":
        if (condition.operator !== "in" && condition.operator !== "notIn") {
          const c = { ...condition }
          c.operator = "in";
          setCondition(c);
        }
        result = [
          <MenuItem key="/in" value="in">{t("people.editCondition.isMem")}</MenuItem>,
          <MenuItem key="/notIn" value="notIn">{t("people.editCondition.notMem")}</MenuItem>
        ]
        break;
      case "memberDonations":
        if (condition.operator !== "donatedTo" && condition.operator !== "donatedToAny") {
          const c = { ...condition };
          c.operator = "donatedTo";
          setCondition(c);
        }
        result = [
          <MenuItem key="/donatedToAny" value="donatedToAny">{t("people.editCondition.hasDon")}</MenuItem>,
          <MenuItem key="/donatedTo" value="donatedTo">{t("people.editCondition.donTo")}</MenuItem>
        ];
        break;
      case "memberAttendance":
        if (condition.operator !== "attendedCampus" && condition.operator !== "attendedAny" && condition.operator !== "attendedService" && condition.operator !== "attendedServiceTime" && condition.operator !== "attendedGroup") {
          const c = { ...condition };
          c.operator = "attendedCampus";
          setCondition(c);
        }
        result = [
          <MenuItem key="/attendedAny" value="attendedAny">{t("people.editCondition.attGen")}</MenuItem>,
          <MenuItem key="/attendedCampus" value="attendedCampus">{t("people.editCondition.attCamp")}</MenuItem>,
          <MenuItem key="/attendedService" value="attendedService">{t("people.editCondition.attServ")}</MenuItem>,
          <MenuItem key="/attendedServiceTime" value="attendedServiceTime">{t("people.editCondition.attServTime")}</MenuItem>,
          <MenuItem key="/attendedGroup" value="attendedGroup">{t("people.editCondition.attGroup")}</MenuItem>
        ]
        break;
      default:
        result = [
          <MenuItem key="/equals" value="equals">=</MenuItem>,
          <MenuItem key="/contains" value="contains">{t("people.editCondition.contains")}</MenuItem>,
          <MenuItem key="/startsWith" value="startsWith">{t("people.editCondition.startW")}</MenuItem>,
          <MenuItem key="/endsWith" value="endsWith">{t("people.editCondition.endW")}</MenuItem>,
          <MenuItem key="/greaterThan" value="greaterThan">&gt;</MenuItem>,
          <MenuItem key="/greaterThanEqual" value="greaterThanEqual">&gt;=</MenuItem>,
          <MenuItem key="/lessThan" value="lessThan">&lt;</MenuItem>,
          <MenuItem key="/lessThanEqual" value="lessThanEqual">&lt;=</MenuItem>,
          <MenuItem key="/notEquals" value="notEquals">!=</MenuItem>
        ]
        break;
    }
    return result;
  }

  return <>
    <FormControl fullWidth>
      <InputLabel>{t("people.editCondition.field")}</InputLabel>
      <Select name="field" label={t("people.editCondition.field")} type="text" value={condition.field} onChange={handleChange}>
        <MenuItem key="/person" value="person" disabled>{t("common.person")}</MenuItem>
        <MenuItem key="/displayName" value="displayName">{t("person.displayName")}</MenuItem>
        <MenuItem key="/firstName" value="firstName">{t("person.firstName")}</MenuItem>
        <MenuItem key="/lastName" value="lastName">{t("person.lastName")}</MenuItem>
        <MenuItem key="/middleName" value="middleName">{t("person.middleName")}</MenuItem>
        <MenuItem key="/nickName" value="nickName">{t("person.nickName")}</MenuItem>
        <MenuItem key="/prefix" value="prefix">{t("person.prefix")}</MenuItem>
        <MenuItem key="/suffix" value="suffix">{t("person.suffix")}</MenuItem>
        <MenuItem key="/birthDate" value="birthDate">{t("person.birthDate")}</MenuItem>
        <MenuItem key="/birthMonth" value="birthMonth">{t("people.editCondition.bMonth")}</MenuItem>
        <MenuItem key="/age" value="age">{t("person.age")}</MenuItem>
        <MenuItem key="/gender64" value="gender">{t("person.gender")}</MenuItem>
        <MenuItem key="/maritalStatus" value="maritalStatus">{t("person.maritalStatus")}</MenuItem>
        <MenuItem key="/anniversary" value="anniversary">{t("person.anniversary")}</MenuItem>
        <MenuItem key="/anniversaryMonth" value="anniversaryMonth">{t("people.editCondition.anniMonth")}</MenuItem>
        <MenuItem key="/yearsMarried" value="yearsMarried">{t("people.editCondition.marYears")}</MenuItem>
        <MenuItem key="/phone" value="phone">{t("person.phone")}</MenuItem>
        <MenuItem key="/email" value="email">{t("person.email")}</MenuItem>
        <MenuItem key="/address" value="address">{t("person.address")}</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth>
      <InputLabel>{t("people.editCondition.operator")}</InputLabel>
      <Select name="operator" label={t("people.editCondition.operator")} type="text" value={condition.operator} onChange={handleChange}>
        {getOperatorOptions()}
      </Select>
    </FormControl>
    {loadingOptions ? <Loading /> : <>{getValueField()}</>}
    <Button variant="outlined" fullWidth onClick={() => { props.conditionAdded(condition) }}>{Locale.label("people.editCondition.saveCon")}</Button>
  </>
}

