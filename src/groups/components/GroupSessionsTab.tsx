import React from "react";

import { type GroupInterface, type PersonInterface, PersonHelper, type SessionInterface } from "@churchapps/apphelper";
import { Grid } from "@mui/material";
import { PersonAddAdvanced } from "../../people/components/PersonAddAdvanced";
import { GroupSessions } from "./GroupSessions";
import { MembersAdd } from "./MembersAdd";
import { SessionAdd } from "./SessionAdd";

interface Props {
  group: GroupInterface;
}

export const GroupSessionsTab = (props: Props) => {
  const [addedPerson, setAddedPerson] = React.useState({} as PersonInterface);
  const [addedSession, setAddedSession] = React.useState({} as SessionInterface);
  const [addSessionVisible, setAddSessionVisible] = React.useState(false);
  const [hiddenPeople, setHiddenPeople] = React.useState([] as string[]);

  const addPerson = (p: PersonInterface) => setAddedPerson(p);

  const handleAddedCallback = () => {
    setAddedPerson(null);
  };

  const handleSidebarVisibility = (name: string, visible: boolean) => {
    if (name === "addSession") setAddSessionVisible(visible);
  };

  const handleSessionAdd = (session: SessionInterface) => {
    setAddedSession(session);
    setAddSessionVisible(false);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <GroupSessions
            group={props.group}
            sidebarVisibilityFunction={handleSidebarVisibility}
            addedSession={addedSession}
            addedPerson={addedPerson}
            addedCallback={handleAddedCallback}
            setHiddenPeople={setHiddenPeople}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {addSessionVisible && <SessionAdd key="sessionAdd" group={props.group} updatedFunction={handleSessionAdd} />}
          {!addSessionVisible && (
            <>
              <PersonAddAdvanced getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={addPerson} showCreatePersonOnNotFound />
              <MembersAdd key="membersAdd" group={props.group} addFunction={addPerson} hiddenPeople={hiddenPeople} />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};
