import React from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Grid, Stack, Switch, Typography, Tooltip, IconButton } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import { ApiHelper, UniqueIdHelper } from "@churchapps/apphelper";
import { PaymentGatewaysInterface } from "../../helpers";

interface Props { churchId: string, saveTrigger: Date | null }

export const GivingSettingsEdit: React.FC<Props> = (props) => {
  const [gateway, setGateway] = React.useState<PaymentGatewaysInterface>(null);
  const [provider, setProvider] = React.useState("");
  const [publicKey, setPublicKey] = React.useState("");
  const [privateKey, setPrivateKey] = React.useState("");
  const [payFees, setPayFees] = React.useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    switch (e.target.name) {
      case "provider": setProvider(e.target.value); break;
      case "publicKey": setPublicKey(e.target.value); break;
      case "privateKey": setPrivateKey(e.target.value); break;
    }
  }

  const getKeys = () => {
    if (provider === "") return null;
    else return (<>
      <Grid item md={4} xs={12}>
        <TextField fullWidth name="publicKey" label="Public Key" value={publicKey} onChange={handleChange} />
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField fullWidth name="privateKey" label="Secret Key" value={privateKey} placeholder="********" type="password" onChange={handleChange} />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center">
          <Typography>Transaction Fees</Typography>
          <Tooltip title="Automatically forces users to cover the transaction fees" arrow>
            <IconButton>
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
    </>);
  }

  const save = () => {
    if (provider === "") {
      if (!UniqueIdHelper.isMissing(gateway?.id)) ApiHelper.delete("/gateways/" + gateway.id, "GivingApi");
    } else {
      const gw: PaymentGatewaysInterface = (gateway === null) ? { churchId: props.churchId } : gateway;
      if (privateKey !== "") {
        gw.provider = provider;
        gw.publicKey = publicKey;
        gw.privateKey = privateKey;
        gw.payFees = payFees;
        ApiHelper.post("/gateways", [gw], "GivingApi");
      }
      if (gw.payFees !== payFees) {
        ApiHelper.patch(`/gateways/${gateway.id}`, { payFees : payFees }, "GivingApi");
      }
    }
  }

  const checkSave = () => {
    if (props.saveTrigger !== null) save()
  };

  const loadData = async () => {
    const gateways = await ApiHelper.get("/gateways", "GivingApi");
    if (gateways.length === 0) {
      setGateway(null);
      setProvider("");
      setPublicKey("");
      setPayFees(false);
    }
    else {
      setGateway(gateways[0]);
      setProvider(gateways[0].provider);
      setPublicKey(gateways[0].publicKey);
      setPayFees(gateways[0].payFees)
    }
    setPrivateKey("");
  }

  React.useEffect(() => { if (!UniqueIdHelper.isMissing(props.churchId)) loadData() }, [props.churchId]); //eslint-disable-line
  React.useEffect(checkSave, [props.saveTrigger]); //eslint-disable-line

  return (
    <>
      <div className="subHead">Giving</div>
      <Grid container spacing={3} marginBottom={2}>
        <Grid item md={4} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Provider</InputLabel>
            <Select name="provider" label="Provider" value={provider} onChange={handleChange}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Stripe">Stripe</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {getKeys()}
      </Grid>

    </>
  );

}

