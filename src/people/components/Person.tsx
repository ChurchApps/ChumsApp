import React from "react";
import { PersonView, PersonEdit } from ".";
import { type PersonInterface } from "@churchapps/helpers";
import { UserHelper, Permissions } from "@churchapps/apphelper";

interface Props {
  id?: string;
  person: PersonInterface;
  togglePhotoEditor: (show: boolean, inProgressEditPerson: PersonInterface) => void;
  updatedFunction: () => void;
  showMergeSearch: () => void;
}

export const Person: React.FC<Props> = ({ id, person, togglePhotoEditor, updatedFunction, showMergeSearch }) => {
  const [mode, setMode] = React.useState("display");

  const handleEdit = () => {
    setMode("edit");
  };
  const handleUpdated = () => {
    setMode("display");
    updatedFunction();
  };
  const getEditFunction = () => (UserHelper.checkAccess(Permissions.membershipApi.people.edit) ? handleEdit : undefined);

  if (mode === "display") return <PersonView id={id} person={person} editFunction={getEditFunction()} updatedFunction={updatedFunction} />;
  else {
    return <PersonEdit id={id} person={person} updatedFunction={handleUpdated} togglePhotoEditor={togglePhotoEditor} showMergeSearch={showMergeSearch} />;
  }
};
