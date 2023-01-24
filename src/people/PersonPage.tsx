import React from "react";
import { Person, Groups, Tabs, Household, UserHelper, ApiHelper, PersonInterface, Merge, Permissions, PersonHelper, PhoneExtentionInterface } from "./components"
import { Grid, Icon } from "@mui/material"
import { useParams } from "react-router-dom";
import { ImageEditor } from "../appBase/components";
import { formattedPhoneNumber } from "./components/PersonEdit";

export const PersonPage = () => {
  const params = useParams();
  const [person, setPerson] = React.useState<PersonInterface>(null);
  const [inPhotoEditMode, setInPhotoEditMode] = React.useState<boolean>(false);
  const [showMergeSearch, setShowMergeSearch] = React.useState<boolean>(false);
  const [extention, setExtention] = React.useState<PhoneExtentionInterface>({homeExtention: "", workExtention: "", mobileExtention: "" })
  const loadData = () => {
    ApiHelper.get("/people/" + params.id, "MembershipApi").then(data => {
      const p = { ...data },
        ex = { ...extention } as any;
      let field = ["homePhone", "workPhone", "mobilePhone"],
        key = Object.keys(extention) as any;
      for (const [index, iterator] of field.entries()) {
        let [phone, exten] = p.contactInfo[iterator] && p.contactInfo[iterator].split('x');
        if (phone) {
          p.contactInfo[iterator] = formattedPhoneNumber(phone);
          ex[key[index]] = exten ?? '';
        }
      }

      setExtention(ex)
      setPerson(p)
    });
  }

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
  const getGroups = () => (UserHelper.checkAccess(Permissions.membershipApi.groupMembers.view)) ? <Groups personId={person?.id} /> : null

  const handleShowSearch = () => {
    setShowMergeSearch(true)
  }

  const hideMergeBox = () => {
    setShowMergeSearch(false)
  }

  const addMergeSearch = (showMergeSearch) ? <Merge hideMergeBox={hideMergeBox} person={person} /> : <></>;
  React.useEffect(loadData, [params.id]);

  return (
    <>
      <h1><Icon>person</Icon> {person?.name?.display}</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <Person id="personDetailsBox" person={person} togglePhotoEditor={togglePhotoEditor} updatedFunction={loadData} showMergeSearch={handleShowSearch} extention={extention} />
          <Tabs person={person} />
        </Grid>
        <Grid item md={4} xs={12}>
          {addMergeSearch}
          {imageEditor}
          <Household person={person} reload={person?.photoUpdated} />
          {getGroups()}
        </Grid>
      </Grid>
    </>
  )

}
