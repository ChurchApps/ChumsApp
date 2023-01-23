import React from "react";
import { ApiHelper, ChurchInterface, InputBox, ErrorMessages } from "./";
import { GivingSettingsEdit } from "./GivingSettingsEdit";
import { UserHelper, Permissions } from "../../helpers";
import { TextField, Grid } from "@mui/material";
import { DomainSettingsEdit } from "./DomainSettingsEdit";

interface Props { church: ChurchInterface, updatedFunction: () => void }

export const ChurchSettingsEdit: React.FC<Props> = (props) => {
  const [church, setChurch] = React.useState({} as ChurchInterface);
  const [errors, setErrors] = React.useState([]);
  const [saveTrigger, setSaveTrigger] = React.useState<Date | null>(null);

  const handleSave = async () => {
    if (validate()) {
      setSaveTrigger(new Date());
      const resp = await ApiHelper.post("/churches", [church], "MembershipApi");
      if (resp.errors !== undefined) setErrors(resp.errors);
      else props.updatedFunction();
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const validate = () => {
    let errors = [];
    if (church.name === "") errors.push("Church name cannot be blank.");
    if (church.subDomain === "") errors.push("Subdomain cannot be blank.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let c = { ...church };
    switch (e.target.name) {
      case "churchName": c.name = e.target.value; break;
      case "address1": c.address1 = e.target.value; break;
      case "address2": c.address2 = e.target.value; break;
      case "city": c.city = e.target.value; break;
      case "state": c.state = e.target.value; break;
      case "zip": c.zip = e.target.value; break;
      case "country": c.country = e.target.value; break;
      case "subDomain": c.subDomain = e.target.value; break;
    }

    setChurch(c);
  }

  const giveSection = () => {

    if (!UserHelper.checkAccess(Permissions.givingApi.settings.edit)) return null;
    else return (<GivingSettingsEdit churchId={church?.id || ""} saveTrigger={saveTrigger} />)
  }

  React.useEffect(() => setChurch(props.church), [props.church]);

  if (church === null || church.id === undefined) return null;
  else return (
    <InputBox id="campusBox" cancelFunction={props.updatedFunction} saveFunction={handleSave} headerText={church.name} headerIcon="church">
      <ErrorMessages errors={errors} />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField fullWidth name="churchName" label="Church Name" value={church?.name || ""} onChange={(handleChange)} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="subDomain" label="Subdomain" value={church?.subDomain || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField fullWidth name="address1" label="Adress Line 1" value={church?.address1 || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="address2" label="Adress Line 2" value={church?.address2 || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField fullWidth name="city" label="City" value={church?.city || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
        <Grid item xs={3}>
          <TextField fullWidth name="state" label="State/Province" value={church?.state || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
        <Grid item xs={3}>
          <TextField fullWidth name="zip" label="Zip/Postal" value={church?.zip || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
      </Grid>
      <TextField fullWidth name="country" label="Country" value={church?.country || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
      {giveSection()}
      <DomainSettingsEdit churchId={church?.id || ""} saveTrigger={saveTrigger} />

    </InputBox>
  );

}

