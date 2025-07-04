"use client";

import React from "react";
import { DateHelper, CurrencyHelper, Locale } from "../../helpers";
import { StripeDonationInterface } from "@churchapps/helpers";
import {
 Table, TableBody, TableRow, TableCell, Dialog, DialogTitle, DialogContent, DialogActions, Button 
} from "@mui/material";

interface Props {
  show: boolean;
  onHide: () => void;
  handleDonate: (message: string) => void;
  donation: StripeDonationInterface;
  donationType: string;
  paymentMethodName: string;
  funds: any;
  payFee: number;
}

export const DonationPreviewModal: React.FC<Props> = (props) => {
  const donationType: any = { once: "One-time Donation", recurring: "Recurring Donation" };
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const handleClick = () => {
    setLoading(true);
    let message = "Thank you for your donation.";
    if (props.donationType === "recurring") message = "Recurring donation created. " + message;
    props.handleDonate(message);
  };

  const formatInterval = () => {
    const count = props.donation.interval.interval_count;
    const interval = props.donation.interval.interval;
    const result = `${count} ${interval}`;
    return count > 1 ? result + "s" : result;
  };

  return (
    <Dialog open={props.show} {...props}>
      <DialogTitle>Donation Preview</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow><TableCell>{Locale.label("person.name")}:</TableCell><TableCell>{props.donation.person.name}</TableCell></TableRow>
            <TableRow><TableCell>{Locale.label("donation.preview.method")}:</TableCell><TableCell className="capitalize">{props.paymentMethodName}</TableCell></TableRow>
            <TableRow><TableCell>{Locale.label("donation.preview.type")}:</TableCell><TableCell>{donationType[props.donationType]}</TableCell></TableRow>
            {props.donationType === "once"
              && <TableRow><TableCell>{Locale.label("donation.preview.date")}:</TableCell><TableCell>{DateHelper.formatHtml5Date(new Date(props.donation.billing_cycle_anchor))}</TableCell></TableRow>
            }
            <TableRow><TableCell>{Locale.label("donation.preview.weekly")}:</TableCell><TableCell>{props.donation.notes}</TableCell></TableRow>
            {props.donationType === "recurring"
              && <>
                <TableRow><TableCell>{Locale.label("donation.preview.startingOn")}:</TableCell><TableCell>{DateHelper.formatHtml5Date(new Date(props.donation.billing_cycle_anchor))}</TableCell></TableRow>
                <TableRow><TableCell>{Locale.label("donation.preview.every")}:</TableCell><TableCell className="capitalize">{formatInterval()}</TableCell></TableRow>
              </>
            }
            <TableRow><TableCell>{Locale.label("donation.preview.funds")}:</TableCell><TableCell>{props.donation.funds.map((fund: any, i: number) => <p key={i}>{CurrencyHelper.formatCurrency(fund.amount)} - {fund.name}</p>)}</TableCell></TableRow>
            {props.payFee > 0 && <TableRow><TableCell>{Locale.label("donation.preview.fee")}:</TableCell><TableCell>{CurrencyHelper.formatCurrency(props.payFee)}</TableCell></TableRow>}
            <TableRow><TableCell>{Locale.label("donation.preview.total")}:</TableCell><TableCell><h4>{CurrencyHelper.formatCurrency(props.donation.amount)}</h4></TableCell></TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onHide} variant="outlined" aria-label="cancel-button">{Locale.label("donation.common.cancel")}</Button>
        <Button onClick={handleClick} variant="contained" aria-label="donate-button" disabled={isLoading}>{Locale.label("donation.preview.donate")}</Button>
      </DialogActions>
    </Dialog>
  );
};
