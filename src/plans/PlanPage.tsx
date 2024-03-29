import React from "react";
import { Grid, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { ApiHelper, ArrayHelper, DisplayBox, PersonAdd, PersonHelper, PersonInterface, SmallButton } from "@churchapps/apphelper";
import { PositionEdit } from "./components/PositionEdit";
import { PositionInterface } from "../helpers";
import { PositionList } from "./components/PositionList";

export const PlanPage = () => {
  const params = useParams();
  const [positions, setPositions] = React.useState<PositionInterface[]>([]);
  const [position, setPosition] = React.useState<PositionInterface>(null);

  const getAddPositionLink = () => (
    <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button" onClick={() => { setPosition({categoryName:(positions?.length>0) ? positions[0].categoryName : "Band", name:"", planId:params.id, count:1}) }}>
      <Icon color="primary">add</Icon>
    </IconButton>
  );

  const getAddTimeLink = () => (
    <IconButton aria-label="addButton" id="addBtnGroup" data-cy="add-button">
      <Icon color="primary">add</Icon>
    </IconButton>
  );

  const addPerson = (p: PersonInterface) => {}

  const loadData = () => {
    setPosition(null);
    ApiHelper.get("/positions/plan/" + params.id, "DoingApi").then(data => { setPositions(data); });
  }

  React.useEffect(() => { loadData(); }, []);

  return (<>
    <h1><Icon>assignment</Icon> Service Plan for 4/27/2024</h1>
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox headerText="Assignments" headerIcon="assignment" editContent={getAddPositionLink()}>
          <PositionList positions={positions} onSelect={p => setPosition(p)} />
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        {position && <PositionEdit position={position} categoryNames={(positions?.length>0) ? ArrayHelper.getUniqueValues(positions, "categoryName") : ["Band"] } updatedFunction={loadData} /> }
        <DisplayBox key="displayBox" id="personAddBox" headerIcon="person" headerText="Add Person">
          <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={addPerson} />
        </DisplayBox>
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

