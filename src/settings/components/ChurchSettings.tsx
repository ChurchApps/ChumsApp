import { Grid } from "@mui/material";
import React from "react";
import { ChurchSettingsEdit } from "./";
import { ChurchInterface, DisplayBox, UserHelper, Permissions } from "@churchapps/apphelper";

interface Props { church: ChurchInterface, updatedFunction: () => void }

export const ChurchSettings: React.FC<Props> = (props) => {

  const [mode, setMode] = React.useState("display");

  const handleEdit = () => setMode("edit");

  const handleUpdate = () => {
    setMode("display");
    props.updatedFunction();
  }

  const getEditFunction = () => (UserHelper.checkAccess(Permissions.membershipApi.settings.edit)) ? handleEdit : null

  const getDisplayAddress = () => {
    let result: JSX.Element[] = [];
    if (props.church !== null) {

      if (!isEmpty(props.church.address1)) result.push(<span key="address1">{props.church.address1}<br /></span>);
      if (!isEmpty(props.church.address2)) result.push(<span key="address2">{props.church.address2}<br /></span>);
      if (!isEmpty(props.church.city)) result.push(<span key="state">{props.church.city}, {props.church.state} {props.church.zip}<br /></span>);
      if (!isEmpty(props.church.country)) result.push(<span key="country">{props.church.country}</span>);
    }
    return (<>{result}</>);
  }

  const isEmpty = (value: any) => value === undefined || value === null || value === ""

  if (mode === "display") {
    return (
      <DisplayBox headerIcon="church" headerText="Church Settings" editFunction={getEditFunction()}>
        <Grid container>
          <Grid item xs={6}>
            <label>Name</label><br />
            {props.church?.name}<br /><br />
          </Grid>
          <Grid item xs={6}>
            <label>Subdomain</label><br />
            {props.church?.subDomain}
          </Grid>
        </Grid>
        <label>Address</label><br />
        {getDisplayAddress()}<br /><br />
      </DisplayBox>
    );
  } else return <ChurchSettingsEdit church={props.church} updatedFunction={handleUpdate} />
}

