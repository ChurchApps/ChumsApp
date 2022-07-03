import React from "react";
import { Avatar, Grid, Icon, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { DisplayBox } from "../components";
import { SmallButton } from "../appBase/components";


export const TasksPage = () => {
  const editContent = <SmallButton icon="add" onClick={() => { }} />


  return (
    <>
      <h1><Icon>list_alt</Icon> Tasks</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox headerIcon="list_alt" headerText="Tasks" editContent={editContent}>
            <h4>Assigned to Me</h4>
            <Table>
              <TableHead>
                <TableCell>#</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>For</TableCell>
                <TableCell>Title</TableCell>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell><a href="about:blank">102</a></TableCell>
                  <TableCell>12 hours ago</TableCell>
                  <TableCell><a href="#" style={{ whiteSpace: "nowrap", display: "block" }}>
                    <Avatar sx={{ width: 32, height: 32, marginRight: 1, float: "left" }}><img src="https://content.staging.churchapps.org/AOjIt0W-SeY/membership/people/bTrK6d0kvF6.png?dt=1649905513000" style={{ maxHeight: 32 }} /></Avatar>
                    Jeremy Zongker
                  </a></TableCell>
                  <TableCell>Background check needed</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <br />
            <h4>Requested by Me</h4>
            <Table>
              <TableHead>
                <TableCell>#</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>For</TableCell>
                <TableCell>Title</TableCell>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell><a href="about:blank">102</a></TableCell>
                  <TableCell>12 hours ago</TableCell>
                  <TableCell><a href="#" style={{ whiteSpace: "nowrap", display: "block" }}>
                    <Avatar sx={{ width: 32, height: 32, marginRight: 1, float: "left" }}><img src="https://content.staging.churchapps.org/AOjIt0W-SeY/membership/people/bTrK6d0kvF6.png?dt=1649905513000" style={{ maxHeight: 32 }} /></Avatar>
                    Jeremy Zongker
                  </a></TableCell>
                  <TableCell>Background check needed</TableCell>
                </TableRow>
              </TableBody>
            </Table>

          </DisplayBox>
        </Grid>
        <Grid item md={4} xs={12}>
          <DisplayBox headerIcon="list_alt" headerText="Task Details" editContent={editContent}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Date Created" value="2022-07-01" type="date" disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Associated with" value="Jeremy Zongker" InputProps={{ endAdornment: <InputAdornment position="end"><Icon>search</Icon></InputAdornment> }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Created by" value="Jeremy Zongker" InputProps={{ endAdornment: <InputAdornment position="end"><Icon>search</Icon></InputAdornment> }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Assigned to" value="Jeremy Zongker" InputProps={{ endAdornment: <InputAdornment position="end"><Icon>search</Icon></InputAdornment> }} />
              </Grid>
            </Grid>
          </DisplayBox>

        </Grid>
      </Grid>
    </>
  );
}
