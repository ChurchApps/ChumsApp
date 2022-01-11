import React from "react";
import { Person, Groups, Tabs, Household, ImageEditor, UserHelper, ApiHelper, PersonInterface, Merge, Permissions, AddNote, NoteInterface } from "./components"
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

export const PersonPage = () => {
  const params = useParams();
  const [person, setPerson] = React.useState<PersonInterface>(null);
  const [notes, setNotes] = React.useState<NoteInterface[]>(null)
  const [inPhotoEditMode, setInPhotoEditMode] = React.useState<boolean>(false);
  const [showMergeSearch, setShowMergeSearch] = React.useState<boolean>(false);
  const [showNoteBox, setShowNoteBox] = React.useState<boolean>(false);
  const [noteId, setNoteId] = React.useState<string>("");

  const loadData = () => { ApiHelper.get("/people/" + params.id, "MembershipApi").then(data => setPerson(data)); }

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
    <ImageEditor updatedFunction={handlePhotoUpdated} person={person} onCancel={() => togglePhotoEditor(false)} />
  );
  const getGroups = () => (UserHelper.checkAccess(Permissions.membershipApi.groupMembers.view)) ? <Groups personId={person?.id} /> : null

  const handleShowSearch = () => {
    setShowMergeSearch(true)
  }

  const hideMergeBox = () => {
    setShowMergeSearch(false)
  }

  const handleNotesClick = (noteId?: string) => {
    setNoteId(noteId);
    setShowNoteBox(true);
  }

  function loadNotes() {
    ApiHelper.get(
      "/notes/person/" + person?.id, "MembershipApi"
    ).then((data) => setNotes(data));
  };

  const addMergeSearch = (showMergeSearch) ? <Merge hideMergeBox={hideMergeBox} person={person} /> : <></>;
  React.useEffect(loadData, [params.id]);
  React.useEffect(loadNotes, [person?.id]);

  return (
    <Row>
      <Col lg={8}>
        <Person id="personDetailsBox" person={person} togglePhotoEditor={togglePhotoEditor} updatedFunction={loadData} showMergeSearch={handleShowSearch} />
        <Tabs person={person} showNoteBox={handleNotesClick} notes={notes} />
      </Col>
      <Col lg={4}>
        {addMergeSearch}
        {imageEditor}
        <Household person={person} reload={person?.photoUpdated} />
        {getGroups()}
        {showNoteBox && <AddNote contentId={person.id} noteId={noteId} close={() => setShowNoteBox(false)} updatedFunction={loadNotes} />}
      </Col>
    </Row>
  )

}
