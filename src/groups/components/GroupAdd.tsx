import { TextField } from "@mui/material";
import React from "react";
import { ApiHelper, GroupInterface, InputBox, ErrorMessages, Locale } from "@churchapps/apphelper";

interface Props { updatedFunction: () => void, tags: string, categoryName?:string}

export const GroupAdd: React.FC<Props> = (props) => {
  const [group, setGroup] = React.useState<GroupInterface>({ categoryName: props.categoryName || "", name: "", tags: props.tags });
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCancel = () => { props.updatedFunction(); };
  const handleAdd = () => {
    if (validate()) {
      setIsSubmitting(true);
      ApiHelper.post("/groups", [group], "MembershipApi").finally(() => {
        setIsSubmitting(false)
        props.updatedFunction()
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const g = { ...group } as GroupInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "name": g.name = value; break;
      case "categoryName": g.categoryName = value; break;
    }
    setGroup(g);
  }

  const validate = () => {
    const result = [];
    if (!group.categoryName) result.push(Locale.label("groups.groupAdd.catReq"));
    if (!group.name) result.push(Locale.label("groups.groupAdd.groupReq"));
    setErrors(result);
    return result.length === 0;
  }

  let label = Locale.label("groups.groupAdd.group");
  if (props.tags==="team") label = Locale.label("groups.groupAdd.team");
  else if (props.tags==="ministry") label = Locale.label("groups.groupAdd.ministry");


  return (
    <InputBox headerText={Locale.label("groups.groupAdd.new") + label} headerIcon="group" cancelFunction={handleCancel} saveFunction={handleAdd} saveText="Add" isSubmitting={isSubmitting}>
      <ErrorMessages errors={errors} />
      {(props.tags==="standard") && <TextField fullWidth={true} label={Locale.label("groups.groupAdd.catName")} type="text" id="categoryName" name="categoryName" value={group.categoryName} onChange={handleChange} />}
      <TextField fullWidth={true} label={Locale.label("groups.groupAdd.name")} type="text" id="groupName" name="name" value={group.name} onChange={handleChange} />
    </InputBox>
  );
}
