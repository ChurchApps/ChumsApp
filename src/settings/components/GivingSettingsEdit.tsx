import React from "react";
import {
  FormControl, InputLabel, MenuItem, Select, TextField, Grid, Stack, Switch, Typography, Tooltip, IconButton, type SelectChangeEvent 
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { ApiHelper, Locale, UniqueIdHelper } from "@churchapps/apphelper";
import { type PaymentGatewaysInterface } from "../../helpers";
import { FeeOptionsSettingsEdit } from "./FeeOptionsSettingsEdit";

interface Props {
  churchId: string;
  saveTrigger: Date | null;
}

export const GivingSettingsEdit: React.FC<Props> = (props) => {
  const [gateway, setGateway] = React.useState<PaymentGatewaysInterface>(null);
  const [provider, setProvider] = React.useState("");
  const [publicKey, setPublicKey] = React.useState("");
  const [privateKey, setPrivateKey] = React.useState("");
  const [payFees, setPayFees] = React.useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    e.preventDefault();
    switch (e.target.name) {
      case "provider":
        setProvider(e.target.value);
        break;
      case "publicKey":
        setPublicKey(e.target.value);
        break;
      case "privateKey":
        setPrivateKey(e.target.value);
        break;
    }
  };

  const getKeys = () => {
    if (provider === "") return null;
    else {
      const publicLabel = provider === "paypal" 
        ? Locale.label("settings.givingSettingsEdit.clientId") || "Client ID"
        : Locale.label("settings.givingSettingsEdit.pubKey");
      const privateLabel = provider === "paypal"
        ? Locale.label("settings.givingSettingsEdit.clientSecret") || "Client Secret"
        : Locale.label("settings.givingSettingsEdit.secKey");
      
      return (
        <>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth name="publicKey" label={publicLabel} value={publicKey} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth name="privateKey" label={privateLabel} value={privateKey} placeholder="********" type="password" onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" alignItems="center">
              <Typography>{Locale.label("settings.givingSettingsEdit.transFee")}</Typography>
              <Tooltip title={Locale.label("settings.givingSettingsEdit.forceMsg")} arrow>
                <IconButton data-testid="force-ssl-help-button" aria-label="Force SSL help">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
              <Switch
                checked={payFees === true}
                onChange={(e) => {
                  setPayFees(e.target.checked);
                }}
              />
            </Stack>
          </Grid>
        </>
      );
    }
  };

  const save = () => {
    if (provider === "") {
      if (!UniqueIdHelper.isMissing(gateway?.id)) ApiHelper.delete("/gateways/" + gateway.id, "GivingApi");
    } else {
      const gw: PaymentGatewaysInterface = gateway === null ? { churchId: props.churchId } : gateway;
      if (privateKey !== "") {
        gw.provider = provider;
        gw.publicKey = publicKey;
        gw.privateKey = privateKey;
        gw.payFees = payFees;
        ApiHelper.post("/gateways", [gw], "GivingApi");
      }
      if (gw.payFees !== payFees) {
        ApiHelper.patch(`/gateways/${gateway.id}`, { payFees: payFees }, "GivingApi");
      }
    }
  };

  const checkSave = () => {
    if (props.saveTrigger !== null) save();
  };

  const loadData = async () => {
    const gateways = await ApiHelper.get("/gateways", "GivingApi");
    if (gateways.length === 0) {
      setGateway(null);
      setProvider("");
      setPublicKey("");
      setPayFees(false);
    } else {
      setGateway(gateways[0]);
      setProvider(gateways[0].provider);
      setPublicKey(gateways[0].publicKey);
      setPayFees(gateways[0].payFees);
    }
    setPrivateKey("");
  };

  React.useEffect(() => {
    if (!UniqueIdHelper.isMissing(props.churchId)) loadData();
  }, [props.churchId]);
  React.useEffect(checkSave, [props.saveTrigger]); //eslint-disable-line

  return (
    <>
      {/* <div className="subHead">{Locale.label("settings.givingSettingsEdit.giving")}</div> */}
      <Grid container spacing={3} marginBottom={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>{Locale.label("settings.givingSettingsEdit.prov")}</InputLabel>
            <Select name="provider" label={Locale.label("settings.givingSettingsEdit.prov")} value={provider} onChange={handleChange}>
              <MenuItem value="">{Locale.label("settings.givingSettingsEdit.none")}</MenuItem>
              <MenuItem value="stripe">{Locale.label("settings.givingSettingsEdit.stripe")}</MenuItem>
              <MenuItem value="paypal">{Locale.label("settings.givingSettingsEdit.paypal")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {getKeys()}
      </Grid>
      <FeeOptionsSettingsEdit churchId={props.churchId} saveTrigger={props.saveTrigger} provider={provider} />
    </>
  );
};
