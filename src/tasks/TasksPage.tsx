import React from "react";
import { Grid, Icon, Typography } from "@mui/material";
import { DisplayBox } from "../components";
import { SmallButton } from "../appBase/components";
import { Link } from "react-router-dom";
import { NewTask } from "./components";

export const TasksPage = () => {
  const [showAdd, setShowAdd] = React.useState(false);

  const editContent = <SmallButton icon="add" onClick={() => { setShowAdd(true) }} />

  return (
    <>
      <h1><Icon>list_alt</Icon> Tasks</h1>
      {showAdd && <NewTask onCancel={() => { setShowAdd(false); }} onSave={() => { setShowAdd(false); }} />}

      <DisplayBox headerIcon="list_alt" headerText="Tasks" editContent={editContent}>

        <h4>Assigned to Me</h4>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            Title
          </Grid>
          <Grid item xs={3}>Associated with</Grid>
          <Grid item xs={3}>Assigned to</Grid>
        </Grid>
        <div style={{ borderBottom: "1px solid #CCC", paddingTop: 10, paddingBottom: 10 }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <b><Link to="/tasks/102">Background check needed</Link></b><br />
              <Typography variant="caption">#102 opened 12 hours ago by Jeremy Zongker</Typography>
            </Grid>
            <Grid item xs={3}>
              Jeremy Zongker
            </Grid>
            <Grid item xs={3}>
              Jeremy Zongker
            </Grid>
          </Grid>
        </div>
        <div style={{ borderBottom: "1px solid #CCC", paddingTop: 10, paddingBottom: 10 }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <b><a href="#">Background check needed</a></b><br />
              <Typography variant="caption">#102 opened 12 hours ago by Jeremy Zongker</Typography>
            </Grid>
            <Grid item xs={3}>
              John Doe
            </Grid>
            <Grid item xs={3}>
              Jeremy Zongker
            </Grid>
          </Grid>
        </div>

      </DisplayBox>
    </>
  );
}
