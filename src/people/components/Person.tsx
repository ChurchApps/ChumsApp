import React from "react";
import { PersonView, PersonEdit, PersonInterface, UserHelper, Permissions } from "."

interface Props {
    id?: string
    person: PersonInterface,
    photoUrl: string,
    togglePhotoEditor: (show: boolean) => void,
    updatedFunction: (person: PersonInterface) => void,
    showMergeSearch: () => void
}

export const Person: React.FC<Props> = (props) => {
    const [mode, setMode] = React.useState("display");
    //const [person, setPerson] = React.useState(props.person);
    const [addFormId, setAddFormId] = React.useState("");
    const handleEdit = (e: React.MouseEvent) => { e.preventDefault(); setMode("edit"); }
    //const handleAddForm = (formId: string) => { setMode("display"); setAddFormId(formId); }
    const handleUpdated = (p: PersonInterface) => { setMode("display"); props.updatedFunction(p); }
    const getEditFunction = () => { return (UserHelper.checkAccess(Permissions.membershipApi.people.edit)) ? handleEdit : null; }
    const handleFormAdded = (id: string) => { setAddFormId(id); props.updatedFunction(props.person); }

    if (mode === "display") return <PersonView id={props.id} person={props.person} editFunction={getEditFunction()} addFormId={addFormId} formAddedFunction={handleFormAdded} photoUrl={props.photoUrl} />
    else return <PersonEdit id={props.id} person={props.person} updatedFunction={handleUpdated} photoUrl={props.photoUrl} togglePhotoEditor={props.togglePhotoEditor} showMergeSearch={props.showMergeSearch} />
}