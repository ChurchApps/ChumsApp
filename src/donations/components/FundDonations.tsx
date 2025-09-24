import React, { memo, useCallback, useRef } from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField, Grid, type SelectChangeEvent } from "@mui/material";
import { type FundDonationInterface, type FundInterface } from "@churchapps/helpers";
import { Locale } from "@churchapps/apphelper";

interface Props {
  fundDonations: FundDonationInterface[];
  funds: FundInterface[];
  updatedFunction: (fundDonations: FundDonationInterface[]) => void;
  onLastFieldEnter?: () => void;
}

export const FundDonations = memo((props: Props) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (index: number, field: "fundId" | "amount", value: string | number) => {
      const fd = [...props.fundDonations];
      if (field === "fundId") fd[index].fundId = value as string;
      else fd[index].amount = value as number;
      props.updatedFunction(fd);
    },
    [props]
  );

  const handleAmountKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        
        // Amount field is first, so focus on fund select field (second in pair)
        const currentFieldIndex = index * 2; // Amount field is first
        const nextFieldIndex = currentFieldIndex + 1;
        const totalFields = props.fundDonations.length * 2;
        
        if (nextFieldIndex < totalFields) {
          // Focus on fund select field in same row
          const nextRef = inputRefs.current[nextFieldIndex];
          if (nextRef) {
            nextRef.focus();
          }
        }
      }
    },
    [props]
  );

  const handleFundKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        
        // Fund field is second, so focus on next amount field
        const currentFieldIndex = index * 2 + 1; // Fund field is second in pair
        const nextFieldIndex = currentFieldIndex + 1;
        const totalFields = props.fundDonations.length * 2;
        
        if (nextFieldIndex < totalFields) {
          // Focus on next row's amount field
          const nextRef = inputRefs.current[nextFieldIndex];
          if (nextRef) {
            nextRef.focus();
            // For number fields, select all text
            if (nextRef.type === "number") {
              nextRef.select();
            }
          }
        } else if (props.onLastFieldEnter) {
          // Last field - call callback to focus on notes field
          props.onLastFieldEnter();
        }
      }
    },
    [props]
  );

  const handleAdd = useCallback(() => {
    const fd = [...props.fundDonations];
    const newFd: FundDonationInterface = { amount: 0, fundId: props.funds[0]?.id };
    fd.push(newFd);
    props.updatedFunction(fd);
  }, [props]);

  return (
    <>
      {props.fundDonations.map((fd, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label={Locale.label("donation.fundDonations.amount")}
              value={fd.amount || ""}
              onChange={(e) => handleChange(index, "amount", parseFloat(e.target.value) || 0)}
              onKeyDown={(e) => handleAmountKeyDown(index, e)}
              inputRef={(ref) => { inputRefs.current[index * 2] = ref; }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{Locale.label("donation.fundDonations.fund")}</InputLabel>
              <Select
                value={fd.fundId || ""}
                label={Locale.label("donation.fundDonations.fund")}
                onChange={(e: SelectChangeEvent) => handleChange(index, "fundId", e.target.value)}
                onKeyDown={(e) => handleFundKeyDown(index, e)}
                inputRef={(ref) => { inputRefs.current[index * 2 + 1] = ref; }}
              >
                {props.funds.map((fund) => (
                  <MenuItem key={fund.id} value={fund.id}>
                    {fund.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ))}
      <button 
        type="button"
        aria-label="add-fund-donation" 
        className="text-decoration" 
        style={{ 
          display: "block", 
          marginBottom: "15px", 
          background: "none", 
          border: "none", 
          color: "#3b82f6", 
          cursor: "pointer", 
          textDecoration: "underline" 
        }} 
        onClick={handleAdd}
      >
        {Locale.label("donation.fundDonations.addMore")}
      </button>
    </>
  );
});

FundDonations.displayName = "FundDonations";