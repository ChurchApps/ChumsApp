import React, { memo } from "react";
import { Household, Merge, PersonEdit } from "./";
import { type PersonInterface, PersonHelper } from "@churchapps/apphelper";
import { ImageEditor } from "@churchapps/apphelper";

interface Props {
  person: PersonInterface;
  updatedFunction: () => void;
  inPhotoEditMode: boolean;
  setInPhotoEditMode: (show: boolean) => void;
  editMode: string;
  setEditMode: (mode: string) => void;
}
export const PersonDetails = memo((props: Props) => {
  const [person, setPerson] = React.useState<PersonInterface>(props.person);
  const [showMergeSearch, setShowMergeSearch] = React.useState<boolean>(false);
  const { inPhotoEditMode, setInPhotoEditMode, editMode, setEditMode } = props;

  React.useEffect(() => setPerson(props.person), [props.person]);

  const handlePhotoUpdated = (dataUrl: string) => {
    const updatedPerson = { ...person };
    updatedPerson.photo = dataUrl;
    if (!dataUrl) {
      updatedPerson.photoUpdated = null;
    }
    setPerson(updatedPerson);
    setInPhotoEditMode(false);
  };

  const togglePhotoEditor = (show: boolean, updatedPerson?: PersonInterface) => {
    setInPhotoEditMode(show);
    if (updatedPerson) {
      setPerson(updatedPerson);
    }
  };

  const imageEditor = inPhotoEditMode && <ImageEditor aspectRatio={4 / 3} photoUrl={PersonHelper.getPhotoUrl(person)} onCancel={() => togglePhotoEditor(false)} onUpdate={handlePhotoUpdated} />;

  const handleShowSearch = () => {
    setShowMergeSearch(true);
  };

  const hideMergeBox = () => {
    setShowMergeSearch(false);
  };

  const addMergeSearch = showMergeSearch ? <Merge hideMergeBox={hideMergeBox} person={person} /> : null;

  const handleUpdated = () => {
    setEditMode("display");
    props.updatedFunction();
  };

  if (!person) return null;

  return (
    <>
      {addMergeSearch}
      {imageEditor}

      {editMode === "edit" ? (
        <PersonEdit id="personDetailsBox" person={person} updatedFunction={handleUpdated} togglePhotoEditor={togglePhotoEditor} showMergeSearch={handleShowSearch} />
      ) : (
        <>
          <Household person={person} reload={person?.photoUpdated} />
        </>
      )}
    </>
  );
});
