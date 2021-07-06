import React from "react";
import { Person, Groups, Tabs, Household, ImageEditor, UserHelper, ApiHelper, PersonInterface, Merge, Permissions, AddNote } from "./components"
import { Row, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const PersonPage = ({ match }: RouteComponentProps<TParams>) => {
  const [person, setPerson] = React.useState<PersonInterface>(null);
  const [inPhotoEditMode, setInPhotoEditMode] = React.useState<boolean>(false);
  const [showMergeSearch, setShowMergeSearch] = React.useState<boolean>(false);
  const [showNoteBox, setShowNoteBox] = React.useState<boolean>(false);

  const loadData = () => { ApiHelper.get("/people/" + match.params.id, "MembershipApi").then(data => setPerson(data)); }

  const handlePhotoUpdated = (dataUrl: string) => {
    const updatedPerson = {...person};
    updatedPerson.photo = dataUrl;
    if (!dataUrl) {
      updatedPerson.photoUpdated = null;
    }
    setPerson(updatedPerson);
    setInPhotoEditMode(false);
  }

  const togglePhotoEditor = (show: boolean) => { setInPhotoEditMode(show); }

  const imageEditor = inPhotoEditMode && (
    <ImageEditor updatedFunction={handlePhotoUpdated} person={person} onCancel={() => togglePhotoEditor(false)} />
  );
  const getGroups = () => (UserHelper.checkAccess(Permissions.membershipApi.groupMembers.view)) ? <Groups personId={person?.id} /> : null

  const handleShowSearch = () => {
    setShowMergeSearch(true)
  }

  const hideMergeBox = () => {
    setShowMergeSearch(false)
  }

  const addMergeSearch = (showMergeSearch) ? <Merge hideMergeBox={hideMergeBox} person={person} /> : <></>;
  React.useEffect(loadData, [match.params.id]);

  return (
    <Row>
      <Col lg={8}>
        <Person id="personDetailsBox" person={person} togglePhotoEditor={togglePhotoEditor} updatedFunction={loadData} showMergeSearch={handleShowSearch} />
        <Tabs person={person} showNoteBox={() => setShowNoteBox(!showNoteBox)} />
      </Col>
      <Col lg={4}>
        {addMergeSearch}
        {imageEditor}
        <Household person={person} reload={person?.photoUpdated} />
        {getGroups()}
        {showNoteBox && <AddNote contentId={person.id} close={() => setShowNoteBox(false)} />}
      </Col>
    </Row>
  )

}
