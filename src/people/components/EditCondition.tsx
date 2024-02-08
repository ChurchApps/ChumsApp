import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import React from "react";
import { ApiHelper, SearchCondition, Permissions, GroupInterface, Loading, FundInterface, CampusInterface } from "@churchapps/apphelper";

interface Props {
  conditionAdded: (condition: any) => void
}

export function EditCondition(props: Props) {

  const [condition, setCondition] = React.useState<SearchCondition>({ field: "displayName", operator: "equals", value: "" });
  const [loadedOptions, setLoadedOptions] = React.useState<any[]>([]);
  const [loadedOptionsField, setLoadedOptionsField] = React.useState("");
  const [loadingOptions, setLoadingOptions] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    let c = { ...condition }
    switch (e.target.name) {

      case "field":
        c.field = e.target.value;
        c.operator = "equals";
        c.value = "";
        break;
      case "operator":
        c.operator = e.target.value;
        break;
      case "value":
        const parsedValue = c.field === "campus" && JSON.parse(c?.value);
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
        options = [<MenuItem key="/Unspecified" value="Unspecified">Unspecified</MenuItem>, <MenuItem value="Male">Male</MenuItem>, <MenuItem value="Female">Female</MenuItem>]
        setDefaultValue("Unspecified");
        result = getValueSelect(options);
        break;
      case "maritalStatus":
        options = [<MenuItem key="/Unknown" value="Unknown">Unknown</MenuItem>, <MenuItem value="Single">Single</MenuItem>, <MenuItem value="Married">Married</MenuItem>, <MenuItem value="Divorced">Divorced</MenuItem>, <MenuItem value="Widowed">Widowed</MenuItem>]
        setDefaultValue("Unknown");
        result = getValueSelect(options);
        break;
      case "membershipStatus":
        options = [<MenuItem key="/Visitor" value="Visitor">Visitor</MenuItem>, <MenuItem value="Member">Member</MenuItem>, <MenuItem value="Staff">Staff</MenuItem>]
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
        options = [<MenuItem key="January" value="1">January</MenuItem>, <MenuItem key="February" value="2">February</MenuItem>, <MenuItem key="March" value="3">March</MenuItem>, <MenuItem key="April" value="4">April</MenuItem>, <MenuItem key="May" value="5">May</MenuItem>, <MenuItem key="June" value="6">June</MenuItem>, <MenuItem key="July" value="7">July</MenuItem>, <MenuItem key="August" value="8">August</MenuItem>, <MenuItem key="September" value="9">September</MenuItem>, <MenuItem key="October" value="10">October</MenuItem>, <MenuItem key="November" value="11">November</MenuItem>, <MenuItem key="December" value="12">December</MenuItem>]
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
      case "donationMember":
        loadedOptions.forEach((o, i) => { options.push(<MenuItem key={i} value={JSON.stringify(o)}>{o.text}</MenuItem>); });
        setDefaultValue((loadedOptions?.length > 0) ? JSON.stringify(loadedOptions[0]) : "");
        result = getValueSelect(options);
        break;
      case "campus":
        loadedOptions.forEach((o, i) => { options.push(<MenuItem key={i} value={JSON.stringify(o)}>{o.text}</MenuItem>); });
        setDefaultValue((loadedOptions?.length > 0) ? JSON.stringify(loadedOptions[0]) : "");
        result = <>
          {getValueSelect(options)}
          <Stack direction="row" spacing={2} sx={{ marginTop: "16px", marginBottom: "8px" }}>
            <TextField fullWidth label="From" name="from" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
            <TextField fullWidth label="To" name="to" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
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
      if (condition.field === "donationMember") {
        setLoadingOptions(true);
        ApiHelper.get("/funds", "GivingApi").then((funds: FundInterface[]) => {
          const options: any[] = [];
          funds.forEach(f => { options.push({ value: f.id, text: f.name }); });
          setLoadedOptions(options);
          setLoadingOptions(false);
        })
      }
      if (condition.field === "campus") {
        setLoadingOptions(true);
        ApiHelper.get("/campuses", "AttendanceApi").then((data: CampusInterface[]) => {
          const options: any[] = [];
          data.forEach(c => { options.push({ value: c.id, text: c.name }); });
          setLoadedOptions(options);
          setLoadingOptions(false);
        });
      }
    }
  }, [condition?.field.toString()]); //eslint-disable-line

  const getValueSelect = (options: JSX.Element[]) => {
    const parsedValue = condition.field === "campus" && condition.value !== "" && JSON.parse(condition.value);
    const selectValue = (parsedValue && Array.isArray(parsedValue)) ? JSON.stringify(parsedValue[0]) : condition.value;
    return (<FormControl fullWidth>
      <InputLabel>Value</InputLabel>
      <Select name="value" label="Value" type="text" placeholder="Value" value={selectValue} onChange={handleChange}>
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
          <MenuItem key="/in" value="in">is member of</MenuItem>,
          <MenuItem key="/notIn" value="notIn">is not member of</MenuItem>
        ]
        break;
      case "donationMember":
        if (condition.operator !== "donatedTo") {
          const c = { ...condition };
          c.operator = "donatedTo";
          setCondition(c);
        }
        result = [
          <MenuItem key="/donatedTo" value="donatedTo">has donated to</MenuItem>
        ];
        break;
      case "campus":
        if (condition.operator !== "attenedCampus") {
          const c = { ...condition };
          c.operator = "attenedCampus";
          setCondition(c);
        }
        result = [
          <MenuItem key="/attenedCampus" value="attenedCampus">has attended</MenuItem>
        ]
        break;
      default:
        result = [
          <MenuItem key="/equals" value="equals">=</MenuItem>,
          <MenuItem key="/contains" value="contains">contains</MenuItem>,
          <MenuItem key="/startsWith" value="startsWith">starts with</MenuItem>,
          <MenuItem key="/endsWith" value="endsWith">ends with</MenuItem>,
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
      <InputLabel>Field</InputLabel>
      <Select name="field" label="Field" type="text" value={condition.field} onChange={handleChange}>
        <MenuItem key="/person" value="person" disabled>Person</MenuItem>
        <MenuItem key="/displayName" value="displayName">Display Name</MenuItem>
        <MenuItem key="/firstName" value="firstName">First Name</MenuItem>
        <MenuItem key="/lastName" value="lastName">Last Name</MenuItem>
        <MenuItem key="/middleName" value="middleName">Middle Name</MenuItem>
        <MenuItem key="/nickName" value="nickName">Nick Name</MenuItem>
        <MenuItem key="/prefix" value="prefix">Prefix</MenuItem>
        <MenuItem key="/suffix" value="suffix">Suffix</MenuItem>
        <MenuItem key="/birthDate" value="birthDate">Birth Date</MenuItem>
        <MenuItem key="/birthMonth" value="birthMonth">Birth Month</MenuItem>
        <MenuItem key="/age" value="age">Age</MenuItem>
        <MenuItem key="/gender64" value="gender">Gender</MenuItem>
        <MenuItem key="/maritalStatus" value="maritalStatus">Marital Status</MenuItem>
        <MenuItem key="/anniversary" value="anniversary">Anniversary</MenuItem>
        <MenuItem key="/anniversaryMonth" value="anniversaryMonth">Anniversary Month</MenuItem>
        <MenuItem key="/yearsMarried" value="yearsMarried">Years Married</MenuItem>
        <MenuItem key="/phone" value="phone">Phone</MenuItem>
        <MenuItem key="/email" value="email">Email</MenuItem>
        <MenuItem key="/address" value="address">Address</MenuItem>
        <MenuItem key="/city" value="city">City</MenuItem>
        <MenuItem key="/state" value="state">State/Province</MenuItem>
        <MenuItem key="/zip" value="zip">Zip/Postal</MenuItem>
        <MenuItem key="/membership" value="membership" disabled>Membership</MenuItem>
        <MenuItem key="/membershipStatus" value="membershipStatus">Membership Status</MenuItem>
        {(Permissions.membershipApi.groupMembers) && <MenuItem key="/groupMember" value="groupMember">Group Member</MenuItem>}
        <MenuItem key="/donation" value="donation" disabled>Donation</MenuItem>
        {(Permissions.givingApi.donations) && <MenuItem key="/donationMember" value="donationMember">Member</MenuItem>}
        <MenuItem key="/attendance" value="attendance" disabled>Attendance</MenuItem>
        {(Permissions.attendanceApi.attendance) && <MenuItem key="/campus" value="campus">Campus</MenuItem>}
      </Select>
    </FormControl>
    <FormControl fullWidth>
      <InputLabel>Operator</InputLabel>
      <Select name="operator" label="Operator" type="text" placeholder="Value" value={condition.operator} onChange={handleChange}>
        {getOperatorOptions()}
      </Select>
    </FormControl>

    {loadingOptions ? <Loading /> : <>{getValueField()}</>}
    <Button variant="outlined" fullWidth onClick={() => { props.conditionAdded(condition) }}>Save Condition</Button>
  </>
}

