import React from "react";
import { Grid, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import { DisplayBox, PersonHelper, PersonInterface, SmallButton } from "@churchapps/apphelper";

export const PlanPage = () => {
  const person:PersonInterface = {
    id: "bTrK6d0kvF6", photoUpdated: new Date(1649905513000), name: { display: "John Doe" },
    contactInfo: undefined
  };

  const getPersonLink = () => (
    <a href="about:blank">
      <img src={PersonHelper.getPhotoUrl(person)} alt="avatar" style={{height:20}} />
      {person.name.display}
    </a>
  )

  const getAddAssignmentLink = () => (
    <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button">
      <Icon color="primary">add</Icon>
    </IconButton>
  );

  const getAddTimeLink = () => (
    <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button">
      <Icon color="primary">add</Icon>
    </IconButton>
  );

  return (<>
    <h1><Icon>assignment</Icon> Service Plan for 4/27/2024</h1>
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Assignments" headerIcon="assignment" editContent={getAddAssignmentLink()}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Team</b></TableCell>
                <TableCell><b>Position</b></TableCell>
                <TableCell><b>People</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow style={{backgroundColor: "#FFF8E7"}}>
                <TableCell style={{paddingLeft:10, fontWeight:"bold"}}>Band</TableCell>
                <TableCell><a href="about:blank">Guitar</a></TableCell>
                <TableCell>{getPersonLink()}</TableCell>
              </TableRow>
              <TableRow style={{backgroundColor: "#FFF8E7"}}>
                <TableCell></TableCell>
                <TableCell><a href="about:blank">Bass</a></TableCell>
                <TableCell>{getPersonLink()}</TableCell>
              </TableRow>
              <TableRow style={{backgroundColor: "#FFF8E7"}}>
                <TableCell></TableCell>
                <TableCell><a href="about:blank">Drums</a></TableCell>
                <TableCell>{getPersonLink()}</TableCell>
              </TableRow>
              <TableRow style={{backgroundColor: "#FFF8E7"}}>
                <TableCell></TableCell>
                <TableCell><a href="about:blank">Electric</a></TableCell>
                <TableCell>{getPersonLink()}</TableCell>
              </TableRow>
              <TableRow style={{backgroundColor: "#FFF8E7"}}>
                <TableCell></TableCell>
                <TableCell><a href="about:blank">Keys</a></TableCell>
                <TableCell>{getPersonLink()}</TableCell>
              </TableRow>
              <TableRow style={{backgroundColor: "#FFF8E7"}}>
                <TableCell></TableCell>
                <TableCell><a href="about:blank">Worship Leader</a></TableCell>
                <TableCell>{getPersonLink()}</TableCell>
              </TableRow>
              <TableRow style={{backgroundColor: "#E7F2FA"}}>
                <TableCell style={{paddingLeft:10, fontWeight:"bold", verticalAlign:"top"}}>Choir</TableCell>
                <TableCell style={{verticalAlign:"top"}}><a href="about:blank">Choir Members</a></TableCell>
                <TableCell>
                  <div>{getPersonLink()}</div>
                  <div>{getPersonLink()}</div>
                  <div>&nbsp; <a href="about:blank" style={{color:"#FF0000;"}}>8 more needed</a></div>
                </TableCell>
              </TableRow>
              <TableRow style={{backgroundColor: "#EDE7F6"}}>
                <TableCell style={{paddingLeft:10, fontWeight:"bold"}}>Greeters</TableCell>
                <TableCell><a href="about:blank">West Door</a></TableCell>
                <TableCell>{getPersonLink()}</TableCell>
              </TableRow>
              <TableRow style={{backgroundColor: "#EDE7F6"}}>
                <TableCell></TableCell>
                <TableCell><a href="about:blank">East Door</a></TableCell>
                <TableCell>{getPersonLink()}</TableCell>
              </TableRow>
              <TableRow style={{backgroundColor: "#EDE7F6"}}>
                <TableCell></TableCell>
                <TableCell><a href="about:blank">Parking Lot</a></TableCell>
                <TableCell>
                  <div>{getPersonLink()}</div>
                  <div>{getPersonLink()}</div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        <DisplayBox headerText="Times" headerIcon="schedule" editContent={getAddTimeLink()}>
          <table style={{width:"100%"}}>
            <tr>
              <td style={{verticalAlign:"top"}}><Icon>schedule</Icon></td>
              <td style={{width:"90%"}}>
                <Link to="/plans">First Service</Link>
                <div style={{fontSize:12}}>4/27 - 9:00 am</div>
                <i style={{color:"#999", fontSize:12}}>Band, Choir, Greeters</i>
              </td>
            </tr>
            <tr>
              <td style={{verticalAlign:"top"}}><Icon>schedule</Icon></td>
              <td style={{width:"90%"}}>
                <Link to="/plans">Second Service</Link>
                <div style={{fontSize:12}}>4/27 - 10:30 am</div>
                <i style={{color:"#999", fontSize:12}}>Band, Choir, Greeters</i>
              </td>
            </tr>
            <tr>
              <td style={{verticalAlign:"top"}}><Icon>schedule</Icon></td>
              <td style={{width:"90%"}}>
                <Link to="/plans">Wed Night Practice</Link>
                <div style={{fontSize:12}}>4/27 - 10:30 am</div>
                <i style={{color:"#999", fontSize:12}}>Band</i>
              </td>
            </tr>
          </table>
        </DisplayBox>
      </Grid>
    </Grid>
  </>)
};

