"use client";

 
import React from "react";
import type { Stripe } from "@stripe/stripe-js";
import { InputBox, ErrorMessages } from "@churchapps/apphelper";
import { FundDonations } from ".";
import { DonationPreviewModal } from "../modals/DonationPreviewModal";
import { ApiHelper, CurrencyHelper, DateHelper, Locale } from "../../helpers";
import { PersonInterface, StripePaymentMethod, StripeDonationInterface, FundDonationInterface, FundInterface, ChurchInterface } from "@churchapps/helpers";
import {
 Grid, InputLabel, MenuItem, Select, TextField, FormControl, Button, FormControlLabel, Checkbox, FormGroup, Typography 
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { DonationHelper } from "../../helpers";

interface Props { person: PersonInterface, customerId: string, paymentMethods: StripePaymentMethod[], stripePromise: Promise<Stripe>, donationSuccess: (message: string) => void, church?: ChurchInterface, churchLogo?: string }

export const DonationForm: React.FC<Props> = (props) => {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>();
  const [funds, setFunds] = React.useState<FundInterface[]>([]);
  const [fundsTotal, setFundsTotal] = React.useState<number>(0);
  const [transactionFee, setTransactionFee] = React.useState<number>(0);
  const [payFee, setPayFee] = React.useState<number>(0);
  const [total, setTotal] = React.useState<number>(0);
  const [paymentMethodName, setPaymentMethodName] = React.useState<string>(`${props?.paymentMethods[0]?.name} ****${props?.paymentMethods[0]?.last4}`);
  const [donationType, setDonationType] = React.useState<string>();
  const [showDonationPreviewModal, setShowDonationPreviewModal] = React.useState<boolean>(false);
  const [interval, setInterval] = React.useState("one_month");
  const [gateway, setGateway] = React.useState(null);
  const [donation, setDonation] = React.useState<StripeDonationInterface>({
    id: props?.paymentMethods[0]?.id,
    type: props?.paymentMethods[0]?.type,
    customerId: props.customerId,
    person: {
      id: props.person?.id,
      email: props.person?.contactInfo.email,
      name: props.person?.name.display
    },
    amount: 0,
    billing_cycle_anchor: + new Date(),
    interval: {
      interval_count: 1,
      interval: "month"
    },
    funds: []
  });

  const loadData = () => {
    ApiHelper.get("/funds", "GivingApi").then(data => {
      setFunds(data);
      if (data.length) setFundDonations([{ fundId: data[0].id }]);
    });
    ApiHelper.get("/gateways", "GivingApi").then((data) => {
      if (data.length !== 0) setGateway(data[0]);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } };

  const handleCheckChange = (e: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    const d = { ...donation } as StripeDonationInterface;
    d.amount = checked ? fundsTotal + transactionFee : fundsTotal;
    const showFee = checked ? transactionFee : 0;
    setTotal(d.amount);
    setPayFee(showFee);
    setDonation(d);
  };

  const handleAutoPayFee = () => {
    const d = { ...donation } as StripeDonationInterface;
    d.amount = fundsTotal + transactionFee;
    const showFee = transactionFee;
    setTotal(d.amount);
    setPayFee(showFee);
    setDonation(d);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setErrorMessage(null);
    const d = { ...donation } as StripeDonationInterface;
    const value = e.target.value;
    switch (e.target.name) {
      case "method":
        d.id = value;
        const pm = props.paymentMethods.find(pm => pm.id === value);
        d.type = pm.type;
        setPaymentMethodName(`${pm.name} ****${pm.last4}`);
        break;
      case "type": setDonationType(value); break;
      case "date": d.billing_cycle_anchor = + new Date(value); break;
      case "interval":
        setInterval(value);
        d.interval = DonationHelper.getInterval(value);
        break;
      case "notes": d.notes = value; break;
      case "transaction-fee":
        const element = e.target as HTMLInputElement;
        d.amount = element.checked ? fundsTotal + transactionFee : fundsTotal;
        const showFee = element.checked ? transactionFee : 0;
        setTotal(d.amount);
        setPayFee(showFee);
    }
    setDonation(d);
  };

  const handleCancel = () => { setDonationType(null); };
  const handleSave = () => {
    if (donation.amount < .5) setErrorMessage(Locale.label("donation.donationForm.tooLow"));
    else setShowDonationPreviewModal(true);
  };
  const handleDonationSelect = (type: string) => {
    const dt = donationType === type ? null : type;
    setDonationType(dt);
  };

  const makeDonation = async (message: string) => {
    let results;

    const churchObj = {
      name: props?.church?.name,
      subDomain: props?.church?.subDomain,
      churchURL: typeof window !== "undefined" && window.location.origin,
      logo: props?.churchLogo
    };

    if (donationType === "once") results = await ApiHelper.post("/donate/charge/", { ...donation, church: churchObj }, "GivingApi");
    if (donationType === "recurring") results = await ApiHelper.post("/donate/subscribe/", { ...donation, church: churchObj }, "GivingApi");

    if (results?.status === "succeeded" || results?.status === "pending" || results?.status === "active") {
      setShowDonationPreviewModal(false);
      setDonationType(null);
      props.donationSuccess(message);
    }
    if (results?.raw?.message) {
      setShowDonationPreviewModal(false);
      setErrorMessage(Locale.label("donation.common.error") + ": " + results?.raw?.message);
    }
  };

  const handleFundDonationsChange = async (fd: FundDonationInterface[]) => {
    setErrorMessage(null);
    setFundDonations(fd);
    let totalAmount = 0;
    const selectedFunds: any = [];
    for (const fundDonation of fd) {
      totalAmount += fundDonation.amount || 0;
      const fund = funds.find((fund: FundInterface) => fund.id === fundDonation.fundId);
      selectedFunds.push({ id: fundDonation.fundId, amount: fundDonation.amount || 0, name: fund.name });
    }
    const d = { ...donation };
    d.amount = totalAmount;
    d.funds = selectedFunds;
    setFundsTotal(totalAmount);
    
    const fee = await getTransactionFee(totalAmount);
    setTransactionFee(fee);
    
    if (gateway && gateway.payFees === true) {
      d.amount = totalAmount + fee;
      setPayFee(fee);
    }
    setTotal(d.amount);
    setDonation(d);
  };

  const getTransactionFee = async (amount: number) => {
    if (amount > 0) {
      let dt: string = "";
      if (donation.type === "card") dt = "creditCard";
      if (donation.type === "bank") dt = "ach";
      try {
        const response = await ApiHelper.post("/donate/fee?churchId=" + props?.church?.id, { type: dt, amount }, "GivingApi");
        return response.calculatedFee;
      } catch (error) {
        console.log("Error calculating transaction fee: ", error);
        return 0;
      }
    } else {
      return 0;
    }
  };

  React.useEffect(loadData, [props.person?.id]);
   
  // React.useEffect(() => { gateway && gateway.payFees === true && handleAutoPayFee() }, [fundDonations]);

  if (!funds.length || !props?.paymentMethods[0]?.id) return null;
  else {
return (
    <>
      <DonationPreviewModal show={showDonationPreviewModal} onHide={() => setShowDonationPreviewModal(false)} handleDonate={makeDonation} donation={donation} donationType={donationType} payFee={payFee} paymentMethodName={paymentMethodName} funds={funds} />
      <InputBox id="donationBox" aria-label="donation-box" headerIcon="volunteer_activism" headerText={Locale.label("donation.donationForm.donate")} ariaLabelSave="save-button" cancelFunction={donationType ? handleCancel : undefined} saveFunction={donationType ? handleSave : undefined} saveText={Locale.label("donation.donationForm.preview")}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button aria-label="single-donation" size="small" fullWidth style={{ minHeight: "50px" }} variant={donationType === "once" ? "contained" : "outlined"} onClick={() => handleDonationSelect("once")}>{Locale.label("donation.donationForm.make")}</Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button aria-label="recurring-donation" size="small" fullWidth style={{ minHeight: "50px" }} variant={donationType === "recurring" ? "contained" : "outlined"} onClick={() => handleDonationSelect("recurring")}>{Locale.label("donation.donationForm.makeRecurring")}</Button>
          </Grid>
        </Grid>
        {donationType
          && <div style={{ marginTop: "20px" }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>{Locale.label("donation.donationForm.method")}</InputLabel>
                  <Select label={Locale.label("donation.donationForm.method")} name="method" aria-label="method" value={donation.id} className="capitalize" onChange={handleChange}>
                    {props.paymentMethods.map((paymentMethod: any, i: number) => <MenuItem key={i} value={paymentMethod.id}>{paymentMethod.name} ****{paymentMethod.last4}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {donationType === "recurring"
              && <Grid container spacing={3} style={{ marginTop:10 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth name="date" type="date" aria-label="date" label={Locale.label("donation.donationForm.startDate")} value={DateHelper.formatHtml5Date(new Date(donation.billing_cycle_anchor))} onChange={handleChange} onKeyDown={handleKeyDown} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>{Locale.label("donation.donationForm.frequency")}</InputLabel>
                    <Select label={Locale.label("donation.donationForm.frequency")} name="interval" aria-label="interval" value={interval} onChange={handleChange}>
                      <MenuItem value="one_week">{Locale.label("donation.donationForm.weekly")}</MenuItem>
                      <MenuItem value="two_week">{Locale.label("donation.donationForm.biWeekly")}</MenuItem>
                      <MenuItem value="one_month">{Locale.label("donation.donationForm.monthly")}</MenuItem>
                      <MenuItem value="three_month">{Locale.label("donation.donationForm.quarterly")}</MenuItem>
                      <MenuItem value="one_year">{Locale.label("donation.donationForm.annually")}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            }
            <div className="form-group">
              {funds && fundDonations
                && <>
                  <h4>{Locale.label("donation.donationForm.fund")}</h4>
                  <FundDonations fundDonations={fundDonations} funds={funds} updatedFunction={handleFundDonationsChange} />
                </>
              }
              {fundsTotal > 0
                && <>
                  {(gateway && gateway.payFees === true) ? <Typography fontSize={14} fontStyle="italic">*{Locale.label("donation.donationForm.fees").replace("{}", CurrencyHelper.formatCurrency(transactionFee))}</Typography> : (
                    <FormGroup>
                      <FormControlLabel control={<Checkbox />} name="transaction-fee" label={Locale.label("donation.donationForm.cover").replace("{}", CurrencyHelper.formatCurrency(transactionFee))} onChange={handleCheckChange} />
                    </FormGroup>
                  )}
                  <p>{Locale.label("donation.donationForm.total")}: ${total}</p>
                </>
              }
              <TextField fullWidth label={Locale.label("donation.donationForm.notes")} multiline aria-label="note" name="notes" value={donation.notes || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>
            {errorMessage && <ErrorMessages errors={[errorMessage]}></ErrorMessages>}
          </div>
        }
      </InputBox>
    </>
  );
}
};
