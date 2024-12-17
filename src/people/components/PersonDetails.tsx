import React from "react";
import { Person, Groups, Household, Merge } from "./"
import { UserHelper, ApiHelper, PersonInterface,Permissions, PersonHelper } from "@churchapps/apphelper"
import { Grid, Icon } from "@mui/material"
import { useParams } from "react-router-dom";
import { ImageEditor } from "@churchapps/apphelper";

interface Props {
  person:PersonInterface
  loadData: () => void
}
export const PersonDetails = (props:Props) => {
  const params = useParams();
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
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <Person id="personDetailsBox" person={person} togglePhotoEditor={togglePhotoEditor} updatedFunction={props.loadData} showMergeSearch={handleShowSearch} />
        </Grid>
        <Grid item md={4} xs={12}>
          {addMergeSearch}
          {imageEditor}
          <Household person={person} reload={person?.photoUpdated} />
        </Grid>
      </Grid>
    </>
  )

}
