import React from "react";
import { ApiHelper, GroupInterface, InputBox } from ".";

interface Props { updatedFunction: () => void }

export const GroupAdd: React.FC<Props> = (props) => {
    const [categoryName, setCategoryName] = React.useState("");
    const [groupName, setGroupName] = React.useState("");
    const handleCancel = () => { props.updatedFunction(); };
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }
    const handleAdd = () => {
        var group = { categoryName: categoryName, name: groupName } as GroupInterface
        ApiHelper.post("/groups", [group], "MembershipApi").then(() => props.updatedFunction());
    };

    return (
        <InputBox headerText="Group Members" headerIcon="fas fa-users" cancelFunction={handleCancel} saveFunction={handleAdd} saveText="Add Group" >
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

