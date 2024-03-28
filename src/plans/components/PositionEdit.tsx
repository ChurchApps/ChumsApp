import React from "react";
import { FormControl, TextField } from "@mui/material";
import { ApiHelper, ErrorMessages, InputBox } from "@churchapps/apphelper";
import { PositionInterface } from "../../helpers";
import ReactSelect from "react-select";


interface Props { position: PositionInterface, updatedFunction: () => void }

type OptionType = {
  value: string;
  label: string;
};


export const PositionEdit = (props:Props) => {

  const [position, setPosition] = React.useState<PositionInterface>(props.position);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [categoryInput, setCategoryInput] = React.useState("");
  const [categoryOptions, setCategoryOptions] = React.useState<OptionType[]>([{ value: "Test", label: "Test" }]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const p = { ...position } as PositionInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "categoryName": p.categoryName = value; break;
      case "name": p.name = value; break;
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

  return (<>
    <ErrorMessages errors={errors} />
    <InputBox headerText="Add a Position" headerIcon="assignment" saveFunction={handleSave} cancelFunction={props.updatedFunction} deleteFunction={(position.id) ? handleDelete : null }>
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
    </InputBox>
  </>);
}

