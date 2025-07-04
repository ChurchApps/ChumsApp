"use client";

import React from "react";
import type { Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CardForm, BankForm } from ".";
import { DisplayBox, Loading } from "@churchapps/apphelper";
import { ApiHelper, Locale, UserHelper } from "../../helpers";
import { PersonInterface, StripePaymentMethod, Permissions } from "@churchapps/helpers";
import { Icon, Table, TableBody, TableCell, TableRow, IconButton, Menu, MenuItem } from "@mui/material";

interface Props { person: PersonInterface, customerId: string, paymentMethods: StripePaymentMethod[], stripePromise: Promise<Stripe>, appName: string, dataUpdate: (message?: string) => void }

export const PaymentMethods: React.FC<Props> = (props) => {
  const [editPaymentMethod, setEditPaymentMethod] = React.useState<StripePaymentMethod>(new StripePaymentMethod());
  const [mode, setMode] = React.useState("display");
  const [verify, setVerify] = React.useState<boolean>(false);

  const handleEdit = (pm?: StripePaymentMethod, verifyAccount?: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    setEditPaymentMethod(pm);
    setVerify(verifyAccount)
    setMode("edit");
  }

  const handleDelete = async () => {
    let confirmed = window.confirm(Locale.label("donation.paymentMethods.confirmDelete"));
    if (confirmed) {
      ApiHelper.delete("/paymentmethods/" + editPaymentMethod.id + "/" + props.customerId, "GivingApi").then(() => {
        setMode("display");
        props.dataUpdate(Locale.label("donation.paymentMethods.deleted"));
      })
    }
  }

  const MenuIcon = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e: React.MouseEvent) => {
      setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <IconButton
          aria-label="add-button"
          id="addBtnGroup"
          aria-controls={open ? "add-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Icon color="primary">add</Icon>
        </IconButton>
        <Menu
          id="add-menu"
          MenuListProps={{
            "aria-labelledby": "addBtnGroup"
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem aria-label="add-card" onClick={handleEdit(new StripePaymentMethod({ type: "card" }))}>
            <Icon sx={{mr: "3px"}}>credit_card</Icon> {Locale.label("donation.paymentMethods.addCard")}
          </MenuItem>
          <MenuItem aria-label="add-bank" onClick={handleEdit(new StripePaymentMethod({ type: "bank" }))}>
            <Icon sx={{mr: "3px"}}>account_balance</Icon> {Locale.label("donation.paymentMethods.addBank")}
          </MenuItem>
        </Menu>
      </>
    );
  }

  const getNewContent = () => {
    if (!UserHelper.checkAccess(Permissions.givingApi.settings.edit) && props.appName !== "B1App") return null;
    return <MenuIcon />;
  }

  const getEditOptions = (pm: StripePaymentMethod) => {
    if (!UserHelper.checkAccess(Permissions.givingApi.settings.edit) && props.appName !== "B1App") return null;
    return <a aria-label="edit-button" onClick={handleEdit(pm)} href="about:blank"><Icon>edit</Icon></a>;
  }

  const getPMIcon = (type: string) => (type === "card" ? <Icon>credit_card</Icon> : <Icon>account_balance</Icon>)

  const getPaymentRows = () => {
    let rows: React.ReactElement[] = [];

    props.paymentMethods.forEach((method: StripePaymentMethod) => {
      rows.push(
        <TableRow key={method.id}>
          <TableCell className="capitalize">{getPMIcon(method.type)} {method.name + " ****" + method.last4}</TableCell>
          <TableCell>{method?.status === "new" && <a href="about:blank" aria-label="verify-account" onClick={handleEdit(method, true)}>{Locale.label("donation.paymentMethods.verify")}</a>}</TableCell>
          <TableCell align="right">{getEditOptions(method)}</TableCell>
        </TableRow>
      );
    });
    return rows;
  }

  const PaymentMethodsTable = () => {
    if (!props.paymentMethods) return <Loading></Loading>
    if (props.paymentMethods.length) {
      return (
        <Table>
          <TableBody>
            {getPaymentRows()}
          </TableBody>
        </Table>
      );
    }
    else return <div>{Locale.label("donation.paymentMethods.noMethod")}</div>
  }

  const EditForm = () => (
    <Elements stripe={props.stripePromise}>
      {editPaymentMethod.type === "card" && <CardForm card={editPaymentMethod} customerId={props.customerId} person={props.person} setMode={setMode} deletePayment={handleDelete} updateList={(message) => { props.dataUpdate(message) }} />}
      {editPaymentMethod.type === "bank" && <BankForm bank={editPaymentMethod} showVerifyForm={verify} customerId={props.customerId} person={props.person} setMode={setMode} deletePayment={handleDelete} updateList={(message) => { props.dataUpdate(message) }} />}
    </Elements>
  )

  const PaymentMethods = () => {
    if (mode === "display") {
      return (
        <DisplayBox aria-label="payment-methods-box" headerIcon="credit_card" headerText="Payment Methods" editContent={getNewContent()}>
          <PaymentMethodsTable></PaymentMethodsTable>
        </DisplayBox>
      );
    }
    else return <EditForm></EditForm>;
  }

  return props.stripePromise ? <PaymentMethods></PaymentMethods> : null;
}
