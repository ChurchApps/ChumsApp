import React from "react";
import { ApiHelper, InputBox, RoleInterface } from ".";

interface Props {
    roleId: number,
    updatedFunction: () => void
}


export const RoleEdit: React.FC<Props> = (props) => {

    const [role, setRole] = React.useState<RoleInterface>({} as RoleInterface);


    const loadData = () => {
        if (props.roleId > 0) ApiHelper.get("/roles/" + props.roleId, "AccessApi").then((data: RoleInterface) => setRole(data));
        else setRole({} as RoleInterface);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var r = { ...role };
        r.name = e.currentTarget.value;

        setRole(r);
    }

    const handleSave = () => {
        const r = { ...role };
        r.appName = "CHUMS";
        ApiHelper.post("/roles", [r], "AccessApi").then(() => props.updatedFunction());
    }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
    const handleCancel = () => props.updatedFunction();
    const handleDelete = () => {
        if (window.confirm("Are you sure you wish to permanently delete this role?")) {
            ApiHelper.delete("/roles/" + role.id, "AccessApi").then(() => props.updatedFunction());
        }
    }

    React.useEffect(loadData, [props.roleId]);


    return (
        <InputBox id="roleBox" headerIcon="fas fa-lock" headerText="Edit Role" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={(props.roleId > 0) ? handleDelete : undefined} >
            <div className="form-group">
                <label>Role Name</label>
                <input type="text" className="form-control" value={role.name} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
        </InputBox>
    );
}
