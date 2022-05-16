import React from "react";
import { SearchCondition } from ".";
import { Button, FormControl } from "react-bootstrap";

interface Props {
  conditionAdded: (condition: any) => void
}

export function EditCondition(props: Props) {

  const [condition, setCondition] = React.useState<SearchCondition>({ field: "displayName", operator: "equals", value: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let c = { ...condition }
    switch (e.currentTarget.id) {
      case "field":
        c.field = e.currentTarget.value;
        break;
      case "operator":
        c.operator = e.currentTarget.value;
        break;
      case "value":
        c.value = e.currentTarget.value;
        break;
    }
    setCondition(c);
  }

  const getValueField = () => {
    let options: JSX.Element = <></>;
    let result: JSX.Element = null;
    switch (condition.field) {
      case "gender":
        options = <><option value="Unspecified">Unspecified</option><option value="Male">Male</option><option value="Female">Female</option></>
        result = getValueSelect(options);
        break;
      case "maritalStatus":
        options = <><option value="Unknown">Unknown</option><option value="Single">Single</option><option value="Married">Married</option><option value="Divorced">Divorced</option><option value="Widowed">Widowed</option></>
        result = getValueSelect(options);
        break;
      case "membershipStatus":
        options = <><option value="Visitor">Visitor</option><option value="Member">Member</option><option value="Staff">Staff</option></>
        result = getValueSelect(options);
        break;
      case "birthDate":
      case "anniversary":
        result = <FormControl type="date" style={{ marginBottom: 5 }} id="value" placeholder="Value" value={condition.value} onChange={handleChange} />
        break;
      default:
        result = <FormControl style={{ marginBottom: 5 }} id="value" type="text" placeholder="Value" value={condition.value} onChange={handleChange} />
        break;
    }
    return result;
  }

  const getValueSelect = (options: JSX.Element) => {
    return (<FormControl as="select" style={{ marginBottom: 5 }} id="value" type="text" placeholder="Value" value={condition.value} onChange={handleChange} >
      {options}
    </FormControl>)
  }

  return <>
    <FormControl as="select" style={{ marginBottom: 5 }} id="field" type="text" placeholder="Value" value={condition.field} onChange={handleChange}>
      <option value="displayName">Display Name</option>
      <option value="firstName">First Name</option>
      <option value="lastName">Last Name</option>
      <option value="middleName">Middle Name</option>
      <option value="nickName">Nick Name</option>
      <option value="prefix">Prefix</option>
      <option value="suffix">Suffix</option>
      <option value="birthDate">Birth Date</option>
      <option value="gender">Gender</option>
      <option value="maritalStatus">Marital Status</option>
      <option value="anniversary">Anniversary</option>
      <option value="membershipStatus">Membership Status</option>
      <option value="phone">Phone</option>
      <option value="email">Email</option>
      <option value="address">Address</option>
      <option value="city">City</option>
      <option value="state">State/Province</option>
      <option value="zip">Zip/Postal</option>
    </FormControl>
    <FormControl as="select" style={{ marginBottom: 5 }} id="operator" type="text" placeholder="Value" value={condition.operator} onChange={handleChange}>
      <option value="equals">=</option>
      <option value="contains">contains</option>
      <option value="startsWith">starts with</option>
      <option value="endsWith">ends with</option>
      <option value="greaterThan">&gt;</option>
      <option value="greaterThanEqual">&gt;=</option>
      <option value="lessThan">&lt;</option>
      <option value="lessThanEqual">&lt;=</option>
      <option value="notEquals">!=</option>
    </FormControl>
    {getValueField()}
    <Button variant="success" className="btn-block" onClick={() => { props.conditionAdded(condition) }}>Save Condition</Button>
  </>
}
