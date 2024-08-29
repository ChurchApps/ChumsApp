import React from "react";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ApiHelper, ArrayHelper, FundInterface, Locale, QuestionInterface } from "@churchapps/apphelper";

interface Props { question: QuestionInterface, updatedFunction: (question: QuestionInterface) => void }

export const PaymentEdit: React.FC<Props> = (props) => {
  const [funds, setFunds] = React.useState([]);
  const [fundId, setFundId] = React.useState(props.question.choices?.find((c: any) => c.text === "FundId")?.value || "");
  const [amount, setAmount] = React.useState(props.question.choices?.find((c: any) => c.text === "Amount")?.value || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    switch(e.target.name) {
      case "fundId": setFundId(e.target.value); break;
      case "amount": setAmount(Number(e.target.value)); break;
    }
    let q = { ...props.question };
    if(!q.choices) {
      q.choices = [{ value: e.target.value, text: "FundId" }];
      q.choices.push({ value: amount.toString(), text: "Amount" });
    }
    else {
      if (e.target.name === "fundId") {
        let fundIndex = q.choices.findIndex((c: any) => c.text === "FundId");
        q.choices[fundIndex].value = e.target.value;
      }
      else if (e.target.name === "amount") {
        let amountIndex = q.choices.findIndex((c: any) => c.text === "Amount");
        q.choices[amountIndex].value = e.target.value.toString();
      }
    }
    props.updatedFunction(q);
  }

  React.useEffect(() => {
    ApiHelper.get("/funds", "GivingApi").then((data: any) => {
      const result = ArrayHelper.getAll(data, "taxDeductible", false);
      setFunds(result);
      if (fundId === "" && result.length > 0) {
        setFundId(result[0].id);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>
    <FormControl fullWidth>
      <InputLabel id="fund">{Locale.label("forms.formQuestionEdit.fund")}</InputLabel>
      <Select name="fundId" labelId="fund" label={Locale.label("forms.formQuestionEdit.fund")} value={fundId} onChange={handleChange}>
        {funds.map((fund: FundInterface, index: number) => <MenuItem key={index} value={fund.id}>{fund.name}</MenuItem>)}
      </Select>
    </FormControl>
    <TextField fullWidth name="amount" label={Locale.label("forms.formQuestionEdit.amt")} type="number" value={amount} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
  </>;
}
