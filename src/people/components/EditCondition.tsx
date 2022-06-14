import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React from "react";
import { ApiHelper, SearchCondition } from ".";
import { Permissions } from "."
import { GroupInterface } from "../../helpers";
interface Props {
  conditionAdded: (condition: any) => void
}

export function EditCondition(props: Props) {

  const [condition, setCondition] = React.useState<SearchCondition>({ field: "displayName", operator: "equals", value: "" });
  const [loadedOptions, setLoadedOptions] = React.useState<any[]>([]);
  const [loadedOptionsField, setLoadedOptionsField] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    let c = { ...condition }
    console.log(e.target.name)
    switch (e.target.name) {

      case "field":
        c.field = e.target.value;
        break;
      case "operator":
        c.operator = e.target.value;
        break;
      case "value":
        c.value = e.target.value;
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
        options = [<MenuItem value="Unspecified">Unspecified</MenuItem>, <MenuItem value="Male">Male</MenuItem>, <MenuItem value="Female">Female</MenuItem>]
        setDefaultValue("Unspecified");
        result = getValueSelect(options);
        break;
      case "maritalStatus":
        options = [<MenuItem value="Unknown">Unknown</MenuItem>, <MenuItem value="Single">Single</MenuItem>, <MenuItem value="Married">Married</MenuItem>, <MenuItem value="Divorced">Divorced</MenuItem>, <MenuItem value="Widowed">Widowed</MenuItem>]
        setDefaultValue("Unknown");
        result = getValueSelect(options);
        break;
      case "membershipStatus":
        options = [<MenuItem value="Visitor">Visitor</MenuItem>, <MenuItem value="Member">Member</MenuItem>, <MenuItem value="Staff">Staff</MenuItem>]
        setDefaultValue("Visitor");
        result = getValueSelect(options);
        break;
      case "groupMember":
        loadedOptions.forEach(o => { options.push(<MenuItem value={JSON.stringify(o)}>{o.text}</MenuItem>); });
        setDefaultValue((loadedOptions?.length > 0) ? JSON.stringify(loadedOptions[0]) : "");
        result = getValueSelect(options);
        break;
      case "birthMonth":
      case "anniversaryMonth":
        options = [<MenuItem value="1">January</MenuItem>, <MenuItem value="2">February</MenuItem>, <MenuItem value="3">March</MenuItem>, <MenuItem value="4">April</MenuItem>, <MenuItem value="5">May</MenuItem>, <MenuItem value="6">June</MenuItem>, <MenuItem value="7">July</MenuItem>, <MenuItem value="8">August</MenuItem>, <MenuItem value="9">September</MenuItem>, <MenuItem value="10">October</MenuItem>, <MenuItem value="11">November</MenuItem>, <MenuItem value="12">December</MenuItem>]
        setDefaultValue("1");
        result = getValueSelect(options);
        break;
      case "birthDate":
      case "anniversary":
        result = <TextField fullWidth label="Value" type="date" style={{ marginBottom: 5 }} name="value" placeholder="Value" value={condition.value} onChange={handleChange} />
        break;
      case "age":
      case "yearsMarried":
        result = <TextField fullWidth label="Value" type="number" style={{ marginBottom: 5 }} name="value" placeholder="Value" value={condition.value} onChange={handleChange} />
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
        ApiHelper.get("/groups", "MembershipApi").then((groups: GroupInterface[]) => {
          const options: any[] = [];
          groups.forEach(g => { options.push({ value: g.id, text: g.name }); });
          setLoadedOptions(options);
        });
      }
    }
  }, [condition?.field.toString()]); //eslint-disable-line

  const getValueSelect = (options: JSX.Element[]) => (<FormControl fullWidth>
    <InputLabel>Value</InputLabel>
    <Select name="value" label="Value" type="text" placeholder="Value" value={condition.value} onChange={handleChange}>
      {options}
    </Select>
  </FormControl>)

  const getOperatorOptions = () => {
    let result = [
      <MenuItem value="equals">=</MenuItem>,
      <MenuItem value="contains">contains</MenuItem>,
      <MenuItem value="startsWith">starts with</MenuItem>,
      <MenuItem value="endsWith">ends with</MenuItem>,
      <MenuItem value="greaterThan">&gt;</MenuItem>,
      <MenuItem value="greaterThanEqual">&gt;=</MenuItem>,
      <MenuItem value="lessThan">&lt;</MenuItem>,
      <MenuItem value="lessThanEqual">&lt;=</MenuItem>,
      <MenuItem value="notEquals">!=</MenuItem>
    ]

    switch (condition?.field) {
      case "gender":
        result = [
          <MenuItem value="equals">=</MenuItem>,
          <MenuItem value="notEquals">!=</MenuItem>
        ]
        break;
      case "groupMember":
        if (condition.operator !== "in" && condition.operator !== "notIn") {
          const c = { ...condition }
          c.operator = "in";
          setCondition(c);
        }
        result = [
          <MenuItem value="in">is member of</MenuItem>,
          <MenuItem value="notIn">is not member of</MenuItem>
        ]
        break;
    }
    return result;
  }

  return <>
    <FormControl fullWidth>
      <InputLabel>Field</InputLabel>
      <Select name="field" label="Field" type="text" value={condition.field} onChange={handleChange}>
        <MenuItem value="person" disabled>Person</MenuItem>
        <MenuItem value="displayName">Display Name</MenuItem>
        <MenuItem value="firstName">First Name</MenuItem>
        <MenuItem value="lastName">Last Name</MenuItem>
        <MenuItem value="middleName">Middle Name</MenuItem>
        <MenuItem value="nickName">Nick Name</MenuItem>
        <MenuItem value="prefix">Prefix</MenuItem>
        <MenuItem value="suffix">Suffix</MenuItem>
        <MenuItem value="birthDate">Birth Date</MenuItem>
        <MenuItem value="birthMonth">Birth Month</MenuItem>
        <MenuItem value="age">Age</MenuItem>
        <MenuItem value="gender">Gender</MenuItem>
        <MenuItem value="maritalStatus">Marital Status</MenuItem>
        <MenuItem value="anniversary">Anniversary</MenuItem>
        <MenuItem value="anniversaryMonth">Anniversary Month</MenuItem>
        <MenuItem value="yearsMarried">Years Married</MenuItem>
        <MenuItem value="phone">Phone</MenuItem>
        <MenuItem value="email">Email</MenuItem>
        <MenuItem value="address">Address</MenuItem>
        <MenuItem value="city">City</MenuItem>
        <MenuItem value="state">State/Province</MenuItem>
        <MenuItem value="zip">Zip/Postal</MenuItem>
        <MenuItem value="membership" disabled>Membership</MenuItem>
        <MenuItem value="membershipStatus">Membership Status</MenuItem>
        {(Permissions.membershipApi.groupMembers) && <MenuItem value="groupMember">Group Member</MenuItem>}
      </Select>
    </FormControl>
    <FormControl fullWidth>
      <InputLabel>Operator</InputLabel>
      <Select name="operator" label="Operator" type="text" placeholder="Value" value={condition.operator} onChange={handleChange}>
        {getOperatorOptions()}
      </Select>
    </FormControl>

    {getValueField()}
    <Button variant="outlined" style={{ width: "100%" }} onClick={() => { props.conditionAdded(condition) }}>Save Condition</Button>
  </>
}

