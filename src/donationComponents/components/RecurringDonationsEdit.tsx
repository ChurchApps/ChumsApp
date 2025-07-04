"use client";

import React from "react";
import { ApiHelper, Locale } from "../../helpers";
import { InputBox } from "@churchapps/apphelper";
import { StripePaymentMethod, SubscriptionInterface } from "@churchapps/helpers";
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { DonationHelper } from "../../helpers";

interface Props { subscriptionUpdated: (message?: string) => void, customerId: string, paymentMethods: StripePaymentMethod[], editSubscription: SubscriptionInterface };

export const RecurringDonationsEdit: React.FC<Props> = (props) => {
  const [editSubscription, setEditSubscription] = React.useState<SubscriptionInterface>(props.editSubscription);
  const [interval, setInterval] = React.useState("one_month");

  const handleCancel = () => { props.subscriptionUpdated(); };
  const handleSave = () => {
    const sub = { ...editSubscription } as SubscriptionInterface;
    const pmFound = props.paymentMethods.find((pm: StripePaymentMethod) => pm.id === sub.id);
    if (!pmFound) {
      const pm = props.paymentMethods[0];
      sub.default_payment_method = pm.type === "card" ? pm.id : null;
      sub.default_source = pm.type === "bank" ? pm.id : null;
    }
    ApiHelper.post("/subscriptions", [sub], "GivingApi").then(() => props.subscriptionUpdated(Locale.label("donation.donationForm.recurringUpdated")));
  };

  const handleDelete = () => {
    const conf = window.confirm(Locale.label("donation.donationForm.confirmDelete"));
    if (!conf) return;
    const promises = [];
    promises.push(ApiHelper.delete("/subscriptions/" + props.editSubscription.id, "GivingApi"));
    promises.push(ApiHelper.delete("/subscriptionfunds/subscription/" + props.editSubscription.id, "GivingApi"));
    Promise.all(promises).then(() => props.subscriptionUpdated(Locale.label("donation.donationForm.cancelled")));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const sub = { ...editSubscription } as SubscriptionInterface;
    const value = e.target.value;
    switch (e.target.name) {
      case "method":
        const pm = props.paymentMethods.find((pm: StripePaymentMethod) => pm.id === value);
        sub.default_payment_method = pm.type === "card" ? value : null;
        sub.default_source = pm.type === "bank" ? value : null;
        break;
      case "interval":
        setInterval(value);
        const inter = DonationHelper.getInterval(value);
        sub.plan.interval_count = inter.interval_count;
        sub.plan.interval = inter.interval;
        break;
    }
    setEditSubscription(sub);
  };

  const getFields = () => (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>{Locale.label("donation.donationForm.method")}</InputLabel>
            <Select label={Locale.label("donation.donationForm.method")} name="method" aria-label="method" value={editSubscription.default_payment_method || editSubscription.default_source} className="capitalize" onChange={handleChange}>
              {props.paymentMethods.map((paymentMethod: any, i: number) => <MenuItem key={i} value={paymentMethod.id}>{paymentMethod.name} ****{paymentMethod.last4}</MenuItem>)}
            </Select>
          </FormControl>
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
    </>
  );

  React.useEffect(() => {
    if (props.editSubscription) {
      const keyName = DonationHelper.getIntervalKeyName(props.editSubscription.plan.interval_count, props.editSubscription.plan.interval);
      setInterval(keyName);
    }
  }, [props.editSubscription]);

  return (
    <InputBox aria-label="person-details-box" headerIcon="person" headerText={Locale.label("donation.donationForm.editRecurring")} ariaLabelSave="save-button" ariaLabelDelete="delete-button" cancelFunction={handleCancel} deleteFunction={handleDelete} saveFunction={handleSave}>
      {getFields()}
    </InputBox>
  );
};
