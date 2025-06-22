import React from "react";

import {GroupInterface, PersonInterface, PersonHelper,  } from "@churchapps/apphelper";
import { Grid } from "@mui/material";
import { GroupMembers } from "./GroupMembers";
import { PersonAddAdvanced } from "../../people/components/PersonAddAdvanced";


interface Props {
  group: GroupInterface
}

export const GroupMembersTab = (props:Props) => {
  const a = 0
  const [addedPerson, setAddedPerson] = React.useState({} as PersonInterface);
  const addPerson = (p: PersonInterface) => setAddedPerson(p);

  const handleAddedCallback = () => {
    setAddedPerson(null);
  }


  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <GroupMembers group={props.group} addedPerson={addedPerson} addedCallback={handleAddedCallback} />
        </Grid>
        <Grid item md={4} xs={12}>
          <PersonAddAdvanced getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={addPerson} showCreatePersonOnNotFound />
        </Grid>
      </Grid>
    </>
  );
}
