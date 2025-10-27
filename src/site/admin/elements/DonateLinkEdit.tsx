import { useEffect, useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import { Button, Chip, FormControl, Icon, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ApiHelper } from "@churchapps/apphelper";

type Props = {
  parsedData: any;
  onRealtimeChange: (parsedData: any) => void;
};

export function DonateLinkEdit({ parsedData, onRealtimeChange }: Props) {
  const [funds, setFunds] = useState(null);
  const [amounts, setAmounts] = useState<number[]>([]);
  const [amountValue, setAmountValue] = useState<number>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const data = { ...parsedData };
    const val = e.target.value;
    switch (e.target.name) {
      // case "alignment": data.alignment = val; break;
      case "url": data.url = val; break;
      case "text": data.text = val; break;
      case "fundId": data.fundId = val; break;
      case "amount": setAmountValue(+e.target.value); break;
    }
    onRealtimeChange(data);
  };

  const handleAmountAdd = (e: any) => {
    e.preventDefault();
    const data = { ...parsedData };
    let a: number[] = [];
    if (data?.amounts) {
      a = JSON.parse(data?.amounts);
    }
    if (a.length < 5) {
      a.push(amountValue);
      setAmounts(a);
      data.amounts = JSON.stringify(a);
      onRealtimeChange(data);
      setAmountValue(0);
    } else {
      alert("You are only allowed to add five donation amounts.");
      return;
    }
  };

  const handleAmountDelete = (amount: number) => {
    const data = { ...parsedData };
    const a = JSON.parse(data.amounts);
    const idx = a.indexOf(amount);
    a.splice(idx, 1);
    setAmounts(a);
    data.amounts = JSON.stringify(a);
    onRealtimeChange(data);
  };

  useEffect(() => {
    ApiHelper.get("/funds", "GivingApi").then((data: any) => setFunds(data));
    if (parsedData?.amounts) {
      setAmounts(JSON.parse(parsedData.amounts));
    }
  }, []);

  return (
    <>
      {/* Link Alignment */}
      {/* <FormControl fullWidth>
        <InputLabel>Link Alignment</InputLabel>
        <Select
          fullWidth
          label="Link Alignment"
          name="alignment"
          value={parsedData.alignment}
          onChange={handleChange}
        >
          <MenuItem value="center">Center</MenuItem>
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="right">Right</MenuItem>
        </Select>
      </FormControl> */}
      {/* Link Url */}
      <TextField fullWidth size="small" placeholder="/donate" helperText="Tip: you must link the page from the website builder that has the donation element." label="Url" name="url" value={parsedData.url || ""} onChange={handleChange} data-testid="donate-link-url-input" aria-label="Donation page URL" />
      {/* Link Text */}
      <TextField fullWidth size="small" helperText="Ex: (Donate now), (Yes, I will help!), (Donate $10 to Youth Camp), etc.." label="Text" name="text" value={parsedData.text || ""} onChange={handleChange} data-testid="donate-link-text-input" aria-label="Donation link text" />

      {/* Funds */}
      {!funds || funds.length === 0
        ? (
          <>No Funds</>
        )
        : (
          <FormControl fullWidth>
            <InputLabel>Funds</InputLabel>
            <Select fullWidth label="Funds" name="fundId" value={parsedData.fundId} onChange={handleChange} data-testid="donate-link-fund-select" aria-label="Select donation fund">
              {funds.map((f: any) => (
                <MenuItem key={f.id} value={f.id} data-testid={`fund-option-${f.id}`} aria-label={f.name}>{f.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

      {/* Donation Amounts */}
      <Typography marginTop={1.5}>Donation Amounts</Typography>
      <Typography fontSize={12.5} marginTop={1}>
        You can suggest some donation amounts like $5, $10, $20, etc..
      </Typography>
      <div>
        {amounts?.map((a) => (<Chip color="primary" size="small" label={`$ ${a}`} onDelete={() => { handleAmountDelete(a); }} sx={{ mr: 1, mt: 1, minWidth: 70 }} deleteIcon={<Icon sx={{ float: "right", marginLeft: "auto !important" }}>cancel</Icon>} data-testid={`amount-chip-${a}`} aria-label={`Remove $${a} donation amount`} />))}
      </div>
      <TextField fullWidth size="small" type="number" placeholder="10" label="Amount" name="amount" value={amountValue} onChange={handleChange} data-testid="donate-amount-input" aria-label="Donation amount" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, endAdornment: <Button size="small" variant="contained" onClick={handleAmountAdd} disabled={!amountValue || amountValue === 0} data-testid="add-amount-button" aria-label="Add donation amount">Add</Button>, inputProps: { min: 0 } }} />
    </>
  );
}
