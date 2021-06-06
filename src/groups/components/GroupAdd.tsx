import React, { useState } from "react";
import { ApiHelper, GroupInterface, InputBox, ErrorMessages } from ".";

interface Props { updatedFunction: () => void }

export const GroupAdd: React.FC<Props> = (props) => {
  const [categoryName, setCategoryName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleCancel = () => { props.updatedFunction(); };
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }
  const handleAdd = () => {
    let errors: string[] = [];

    if (!categoryName.trim()) errors.push("Please enter Category name");
    if (!groupName.trim()) errors.push("Please enter Group name");

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    let group = { categoryName: categoryName, name: groupName } as GroupInterface
    ApiHelper.post("/groups", [group], "MembershipApi").then(() => props.updatedFunction());
  };

  return (
    <InputBox headerText="Group Members" headerIcon="fas fa-users" cancelFunction={handleCancel} saveFunction={handleAdd} saveText="Add Group">
      <ErrorMessages errors={errors} />
      <div className="form-group">
        <label>Category Name</label>
        <input type="text" className="form-control" data-cy="category-name" value={categoryName} onChange={(e) => { setCategoryName(e.currentTarget.value) }} onKeyDown={handleKeyDown} />
      </div>
      <div className="form-group">
        <label>Group Name</label>
        <input type="text" className="form-control" data-cy="group-name" value={groupName} onChange={(e) => { setGroupName(e.currentTarget.value) }} onKeyDown={handleKeyDown} />
      </div>
    </InputBox>
  );
}

