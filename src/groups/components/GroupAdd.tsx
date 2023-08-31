import { TextField } from "@mui/material";
import React from "react";
import { ApiHelper, GroupInterface, InputBox, ErrorMessages } from "@churchapps/apphelper";

interface Props { updatedFunction: () => void }

export const GroupAdd: React.FC<Props> = (props) => {
  const [group, setGroup] = React.useState<GroupInterface>({ categoryName: "", name: "" });
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
    if (!group.categoryName) result.push("Category name is required.");
    if (!group.name) result.push("Group name is required.");
    setErrors(result);
    return result.length === 0;
  }

  return (
    <InputBox headerText="New Group" headerIcon="group" cancelFunction={handleCancel} saveFunction={handleAdd} saveText="Add Group" isSubmitting={isSubmitting}>
      <ErrorMessages errors={errors} />
      <TextField fullWidth={true} label="Category Name" type="text" id="categoryName" name="categoryName" value={group.categoryName} onChange={handleChange} />
      <TextField fullWidth={true} label="Group Name" type="text" id="groupName" name="name" value={group.name} onChange={handleChange} />
    </InputBox>
  );
}
