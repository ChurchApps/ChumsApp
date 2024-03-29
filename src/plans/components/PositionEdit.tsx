import React, { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ApiHelper, ErrorMessages, GroupInterface, InputBox } from "@churchapps/apphelper";
import { PositionInterface } from "../../helpers";
import ReactSelect from "react-select";


interface Props { position: PositionInterface, categoryNames:string[], updatedFunction: () => void }

type OptionType = {
  value: string;
  label: string;
};


export const PositionEdit = (props:Props) => {

  const options: OptionType[] = [];
  props.categoryNames.forEach(categoryName => options.push({ value: categoryName, label: categoryName }));

  const [position, setPosition] = React.useState<PositionInterface>(props.position);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [categoryInput, setCategoryInput] = React.useState("");
  const [categoryOptions, setCategoryOptions] = React.useState<OptionType[]>(options);
  const [groups, setGroups] = React.useState<GroupInterface[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent ) => {
    setErrors([]);
    const p = { ...position } as PositionInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "categoryName": p.categoryName = value; break;
      case "name": p.name = value; break;
      case "count": p.count = parseInt(value); break;
      case "groupId": p.groupId = value; break;
    }
    setPosition(p);
  }

  const handleSave = () => {
    const errors:string[] = [];
    if (!position.categoryName) errors.push("Category Name is required");
    if (!position.name) errors.push("Name is required");
    setErrors(errors);
    if (errors.length === 0) ApiHelper.post("/positions", [position], "DoingApi").then(props.updatedFunction);
  }

  const handleDelete = () => {
    ApiHelper.delete("/positions/" + position.id, "DoingApi").then(props.updatedFunction);
  }

  const categoryOption = (position?.categoryName === "" && categoryOptions.length > 0) ? categoryOptions[0] : { value: position.categoryName, label: position.categoryName }

  const handleCategoryChange = (newValue: { label: string, value: string }, obj: any) => {
    let p: PositionInterface = { ...position };
    p.categoryName = newValue.value;
    setCategoryInput("");
    setPosition(p);
  }

  const handleCategoryBlur = () => {
    if (categoryInput) {
      const options = [...categoryOptions]
      options.push({ value: categoryInput, label: categoryInput })
      let p: PositionInterface = { ...position };
      p.categoryName = categoryInput;
      setCategoryOptions(options);
      setPosition(p);
    }
  }

  const getGroupOptions = () => {
    let options = [];
    for (let i = 0; i < groups.length; i++) options.push(<MenuItem key={i} value={groups[i].id}>{groups[i].name}</MenuItem>);
    return options;
  }

  const loadData = () => {
    ApiHelper.get("/groups", "MembershipApi").then(data => setGroups(data));
  }

  useEffect(() => { loadData(); }, []);

  return (<>
    <ErrorMessages errors={errors} />
    <InputBox headerText={(props.position?.id) ? "Edit Position" : "Add a Position"} headerIcon="assignment" saveFunction={handleSave} cancelFunction={props.updatedFunction} deleteFunction={(position.id) ? handleDelete : null }>
      <FormControl fullWidth>
        <div style={{fontSize:12, color:"#999", position:"absolute", top:-8, left:10, backgroundColor:"#FFF", zIndex:999}}>Category Name</div>
        <ReactSelect onInputChange={(newValue: string) => { setCategoryInput(newValue) }}
          value={categoryOption}
          onChange={handleCategoryChange}
          options={categoryOptions}
          onBlur={handleCategoryBlur}
          className="comboBox"
        />
      </FormControl>
      <TextField fullWidth label="Name" id="name" name="name" type="text" value={position.name} onChange={handleChange} />
      <TextField fullWidth label="Volunteer Count" id="count" name="count" type="number" value={position.count} onChange={handleChange} />
      <FormControl fullWidth>
        <InputLabel>Volunteer Group</InputLabel>
        <Select name="groupId" label="Volunteer Group" value={position.groupId} onChange={handleChange}>
          {getGroupOptions()}
        </Select>
      </FormControl>
    </InputBox>
  </>);
}

