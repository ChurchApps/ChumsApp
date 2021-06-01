import React, { useEffect } from "react";
import { PersonView, PersonEdit, PersonInterface, UserHelper, Permissions } from "."

interface Props {
    id?: string
    person: PersonInterface,
    photoUrl: string,
    togglePhotoEditor: (show: boolean) => void,
    updatedFunction: () => void,
    showMergeSearch: () => void
}

export const Person: React.FC<Props> = (props) => {
    const [mode, setMode] = React.useState("display");
    const [addFormId, setAddFormId] = React.useState("");

    const handleEdit = (e: React.MouseEvent) => { e.preventDefault(); setMode("edit"); }
    const handleUpdated = () => { setMode("display"); props.updatedFunction(); }
    const getEditFunction = () => { return (UserHelper.checkAccess(Permissions.membershipApi.people.edit)) ? handleEdit : null; }
    const handleFormAdded = (id: string) => { setAddFormId(id); props.updatedFunction(); }

    useEffect(() => {
        setAddFormId("");
    }, [props.person])

    if (mode === "display") return <PersonView id={props.id} person={props.person} editFunction={getEditFunction()} addFormId={addFormId} formAddedFunction={handleFormAdded} photoUrl={props.photoUrl} />
    else return <PersonEdit id={props.id} person={props.person} updatedFunction={handleUpdated} photoUrl={props.photoUrl} togglePhotoEditor={props.togglePhotoEditor} showMergeSearch={props.showMergeSearch} />
}