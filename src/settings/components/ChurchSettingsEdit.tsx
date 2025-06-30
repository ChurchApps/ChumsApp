import React from "react";
import { ApiHelper, type ChurchInterface, InputBox, ErrorMessages, UserHelper, Permissions, Locale } from "@churchapps/apphelper";
import { GivingSettingsEdit } from "./GivingSettingsEdit";
import { TextField, Grid, Divider, Chip } from "@mui/material";
import { DomainSettingsEdit } from "./DomainSettingsEdit";
import { DirectoryApproveSettingsEdit } from "./DirectoryApproveSettingsEdit";
import { SupportContactSettingsEdit } from "./SupportContactSettingsEdit";
import { VisbilityPrefSettingsEdit } from "./VisibilityPrefSettingsEdit";

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
    const errors = [];
    if (church.name === "") errors.push(Locale.label("settings.churchSettingsEdit.noNameMsg"));
    if (church.subDomain === "") errors.push(Locale.label("settings.churchSettingsEdit.noSubMsg"));
    setErrors(errors);
    return errors.length === 0;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const c = { ...church };
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
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth name="churchName" label={Locale.label("settings.churchSettingsEdit.churchName")} value={church?.name || ""} onChange={(handleChange)} data-testid="church-name-input" aria-label="Church name" />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth name="subDomain" label={Locale.label("settings.churchSettingsEdit.subdom")} value={church?.subDomain || ""} onChange={handleChange} onKeyDown={handleKeyDown} data-testid="subdomain-input" aria-label="Subdomain" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth name="address1" label={Locale.label("settings.churchSettingsEdit.address1")} value={church?.address1 || ""} onChange={handleChange} onKeyDown={handleKeyDown} data-testid="address1-input" aria-label="Address line 1" />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth name="address2" label={Locale.label("settings.churchSettingsEdit.address2")} value={church?.address2 || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth name="city" label={Locale.label("person.city")} value={church?.city || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
        <Grid size={{ xs: 3 }}>
          <TextField fullWidth name="state" label={Locale.label("person.state")} value={church?.state || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
        <Grid size={{ xs: 3 }}>
          <TextField fullWidth name="zip" label={Locale.label("person.zip")} value={church?.zip || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
      </Grid>
      <TextField fullWidth name="country" label={Locale.label("person.country")} value={church?.country || ""} onChange={handleChange} onKeyDown={handleKeyDown} />

      {/* GENERAL SECTION */}
      <Divider variant="middle" textAlign="center" sx={{ marginTop: 3, marginBottom: 3 }}>
        <Chip label={Locale.label("settings.churchSettingsEdit.general")} size="small" color="primary" sx={{ width: 100 }} />
      </Divider>
      <SupportContactSettingsEdit churchId={church?.id || ""} saveTrigger={saveTrigger} />
      <DirectoryApproveSettingsEdit churchId={church?.id || ""} saveTrigger={saveTrigger}  />
      <VisbilityPrefSettingsEdit churchId={church?.id || ""} saveTrigger={saveTrigger} />

      {/* GIVING SECTION */}
      <Divider variant="middle" textAlign="center" sx={{ marginTop: 3, marginBottom: 3 }}>
        <Chip label={Locale.label("settings.givingSettingsEdit.giving")} size="small" color="primary" sx={{ width: 100 }} />
      </Divider>
      {giveSection()}

      {/* DOMAINS SECTION */}
      <Divider variant="middle" textAlign="center" sx={{ marginTop: 3, marginBottom: 3 }}>
        <Chip label={Locale.label("settings.domainSettingsEdit.domains")} size="small" color="primary" sx={{ width: 100 }} />
      </Divider>
      <DomainSettingsEdit churchId={church?.id || ""} saveTrigger={saveTrigger} />

    </InputBox>
  );

}

