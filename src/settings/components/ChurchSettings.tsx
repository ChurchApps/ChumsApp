import { Grid } from "@mui/material";
import React from "react";
import { ChurchSettingsEdit } from "./";
import { type ChurchInterface, DisplayBox, UserHelper, Permissions, Locale } from "@churchapps/apphelper";

interface Props {
  church: ChurchInterface;
  updatedFunction: () => void;
}

export const ChurchSettings: React.FC<Props> = (props) => {
  const [mode, setMode] = React.useState("display");

  const handleEdit = () => setMode("edit");

  const handleUpdate = () => {
    setMode("display");
    props.updatedFunction();
  };

  const getEditFunction = () => (UserHelper.checkAccess(Permissions.membershipApi.settings.edit) ? handleEdit : null);

  const getDisplayAddress = () => {
    const result: JSX.Element[] = [];
    if (props.church !== null) {
      if (!isEmpty(props.church.address1)) {
        result.push(<span key="address1">
            {props.church.address1}
            <br />
          </span>);
      }
      if (!isEmpty(props.church.address2)) {
        result.push(<span key="address2">
            {props.church.address2}
            <br />
          </span>);
      }
      if (!isEmpty(props.church.city)) {
        result.push(<span key="state">
            {props.church.city}, {props.church.state} {props.church.zip}
            <br />
          </span>);
      }
      if (!isEmpty(props.church.country)) result.push(<span key="country">{props.church.country}</span>);
    }
    return <>{result}</>;
  };

  const isEmpty = (value: any) => value === undefined || value === null || value === "";

  if (mode === "display") {
    return (
      <DisplayBox headerIcon="church" headerText={Locale.label("settings.churchSettings.churchSet")} editFunction={getEditFunction()}>
        <Grid container>
          <Grid xs={6}>
            <label>{Locale.label("common.name")}</label>
            <br />
            {props.church?.name}
            <br />
            <br />
          </Grid>
          <Grid xs={6}>
            <label>{Locale.label("settings.churchSettings.subdom")}</label>
            <br />
            {props.church?.subDomain}
          </Grid>
        </Grid>
        <label>{Locale.label("person.address")}</label>
        <br />
        {getDisplayAddress()}
        <br />
        <br />
      </DisplayBox>
    );
  } else return <ChurchSettingsEdit church={props.church} updatedFunction={handleUpdate} />;
};
