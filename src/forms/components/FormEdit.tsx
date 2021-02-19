import React from "react";
import { ApiHelper, InputBox, FormInterface, UniqueIdHelper } from ".";

interface Props { formId: string, updatedFunction: () => void }

export const FormEdit: React.FC<Props> = (props) => {
    const [form, setForm] = React.useState<FormInterface>({} as FormInterface);

    const loadData = () => {
        if (!UniqueIdHelper.isMissing(props.formId)) ApiHelper.get("/forms/" + props.formId, "MembershipApi").then((data: FormInterface) => setForm(data));
        else setForm({ contentType: "person" } as FormInterface);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        var f = { ...form };
        switch (e.currentTarget.name) {
            case "formName": f.name = e.currentTarget.value; break;
            case "contentType": f.contentType = e.currentTarget.value; break;
        }

        setForm(f);
    }

    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
    const handleSave = () => ApiHelper.post("/forms", [form], "MembershipApi").then(() => props.updatedFunction());
    const handleCancel = () => props.updatedFunction();
    const handleDelete = () => {
        if (window.confirm("Are you sure you wish to permanently delete this form?")) {
            ApiHelper.delete("/forms/" + form.id, "MembershipApi").then(() => props.updatedFunction());
        }
    }

    React.useEffect(loadData, [props.formId]);


    return (
        <InputBox id="formBox" headerIcon="fas fa-align-left" headerText="Edit Form" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={(!UniqueIdHelper.isMissing(props.formId)) ? handleDelete : undefined} >
            <div className="form-group">
                <label>Form Name</label>
                <input name="formName" data-cy="form-name" type="text" className="form-control" value={form.name} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
            <div className="form-group">
                <label>Associate With</label>
                <select name="contentType" className="form-control" value={form.contentType} onChange={handleChange} onKeyDown={handleKeyDown}>
                    <option value="person">People</option>
                </select>
            </div>
        </InputBox>
    );
}
