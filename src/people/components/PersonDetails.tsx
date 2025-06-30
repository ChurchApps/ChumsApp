import React from "react";
import { Person, Household, Merge } from "./"
import { type PersonInterface, PersonHelper } from "@churchapps/apphelper"
import { ImageEditor } from "@churchapps/apphelper";

interface Props {
  person:PersonInterface
  loadData: () => void
}
export const PersonDetails = (props:Props) => {
  const [person, setPerson] = React.useState<PersonInterface>(props.person);
  const [inPhotoEditMode, setInPhotoEditMode] = React.useState<boolean>(false);
  const [showMergeSearch, setShowMergeSearch] = React.useState<boolean>(false);

  React.useEffect(() => setPerson(props.person), [props.person]);


  const handlePhotoUpdated = (dataUrl: string) => {
    const updatedPerson = { ...person };
    updatedPerson.photo = dataUrl;
    if (!dataUrl) {
      updatedPerson.photoUpdated = null;
    }
    setPerson(updatedPerson);
    setInPhotoEditMode(false);
  }

  const togglePhotoEditor = (show: boolean, updatedPerson?: PersonInterface) => {
    setInPhotoEditMode(show);
    if (updatedPerson) {
      setPerson(updatedPerson)
    }
  }

  const imageEditor = inPhotoEditMode && (
    <ImageEditor
      aspectRatio={4 / 3}
      photoUrl={PersonHelper.getPhotoUrl(person)}
      onCancel={() => togglePhotoEditor(false)}
      onUpdate={handlePhotoUpdated}
    />
  );


  const handleShowSearch = () => {
    setShowMergeSearch(true)
  }

  const hideMergeBox = () => {
    setShowMergeSearch(false)
  }

  const addMergeSearch = (showMergeSearch) ? <Merge hideMergeBox={hideMergeBox} person={person} /> : <></>;

  return (
    <>
      {addMergeSearch}
      {imageEditor}
      <Person id="personDetailsBox" person={person} togglePhotoEditor={togglePhotoEditor} updatedFunction={props.loadData} showMergeSearch={handleShowSearch} />


      <Household person={person} reload={person?.photoUpdated} />


    </>
  )

}
