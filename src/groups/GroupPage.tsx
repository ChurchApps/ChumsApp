import React from "react";
import { ApiHelper, MembersAdd, DisplayBox, GroupInterface, GroupDetails, PersonAdd, PersonInterface, Tabs, SessionAdd, SessionInterface, PersonHelper } from "./components";
import { useParams } from "react-router-dom";
import { Grid, Icon } from "@mui/material"

export const GroupPage = () => {
  const params = useParams();

  const [group, setGroup] = React.useState({} as GroupInterface);
  const [addedPerson, setAddedPerson] = React.useState({} as PersonInterface);
  const [addedSession, setAddedSession] = React.useState({} as SessionInterface);
  const [addPersonVisible, setAddPersonVisible] = React.useState(false);
  const [addSessionVisible, setAddSessionVisible] = React.useState(false);
  const [addMemberVisible, setAddMemberVisible] = React.useState(false);

  const addPerson = (p: PersonInterface) => setAddedPerson(p);
  const loadData = () => { ApiHelper.get("/groups/" + params.id, "MembershipApi").then(data => setGroup(data)); }
  const handleSessionAdd = (session: SessionInterface) => { setAddedSession(session); setAddSessionVisible(false); }

  React.useEffect(loadData, []); //eslint-disable-line

  const handleSidebarVisibility = (name: string, visible: boolean) => {
    if (name === "addPerson") setAddPersonVisible(visible);
    else if (name === "addSession") setAddSessionVisible(visible);
    else if (name === "addMember") setAddMemberVisible(visible);
  }

  const getSidebarModules = () => {
    const result = [] as JSX.Element[];
    if (addSessionVisible) result.push(<SessionAdd key="sessionAdd" group={group} updatedFunction={handleSessionAdd} />);
    if (addPersonVisible) result.push(<DisplayBox key="displayBox" id="personAddBox" headerIcon="person" headerText="Add Person"><PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={addPerson} /></DisplayBox>);
    if (addMemberVisible) result.push(<MembersAdd key="membersAdd" group={group} addFunction={addPerson} />);
    return result;
  }

  const handleAddedCallback = () => {
    setAddedPerson(null);

    setAddedSession(null);
  }

  const handleGroupUpdated = (g: GroupInterface) => {
    setGroup(g);
    loadData();
  }

  return (
    <>
      <h1><Icon>people</Icon> {group?.name}</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <GroupDetails group={group} updatedFunction={handleGroupUpdated} />
          <Tabs group={group} addedPerson={addedPerson} addedSession={addedSession} addedCallback={handleAddedCallback} sidebarVisibilityFunction={handleSidebarVisibility} />
        </Grid>
        <Grid item md={4} xs={12}>{getSidebarModules()}</Grid>
      </Grid>
    </>
  );
}
