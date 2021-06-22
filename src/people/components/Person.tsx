import React from "react";
import { PersonView, PersonEdit, PersonInterface, UserHelper, Permissions } from "."

interface Props {
  id?: string
  person: PersonInterface,
  togglePhotoEditor: (show: boolean) => void,
  updatedFunction: () => void,
  showMergeSearch: () => void
}

export const Person: React.FC<Props> = ({ id, person, togglePhotoEditor, updatedFunction, showMergeSearch }) => {
  const [mode, setMode] = React.useState("display");

  const handleEdit = (e: React.MouseEvent) => { e.preventDefault(); setMode("edit"); }
  const handleUpdated = () => { setMode("display"); updatedFunction(); }
  const getEditFunction = () => (UserHelper.checkAccess(Permissions.membershipApi.people.edit)) ? handleEdit : null

  if (mode === "display") return <PersonView id={id} person={person} editFunction={getEditFunction()} updatedFunction={updatedFunction} />
  else return <PersonEdit id={id} person={person} updatedFunction={handleUpdated} togglePhotoEditor={togglePhotoEditor} showMergeSearch={showMergeSearch} />
}
