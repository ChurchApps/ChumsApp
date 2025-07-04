"use client";

import React, { useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { InputBox, ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper, Locale } from "../../helpers";
import { PersonInterface, StripePaymentMethod, PaymentMethodInterface, StripeCardUpdateInterface } from "@churchapps/helpers";

interface Props { card: StripePaymentMethod, customerId: string, person: PersonInterface, setMode: any, deletePayment: any, updateList: (message: string) => void }

export const CardForm: React.FC<Props> = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const formStyling = { style: { base: { fontSize: "18px" } } };
  const [showSave, setShowSave] = React.useState(true);
  const [paymentMethod] = React.useState<PaymentMethodInterface>({ id: props.card.id, customerId: props.customerId, personId: props.person.id, email: props.person.contactInfo.email, name: props.person.name.display });
  const [cardUpdate, setCardUpdate] = React.useState<StripeCardUpdateInterface>({ personId: props.person.id, paymentMethodId: props.card.id, cardData: { card: {} } } as StripeCardUpdateInterface);
  const [errorMessage, setErrorMessage] = React.useState<string>(null);
  const handleCancel = () => { props.setMode("display"); };
  const handleSave = () => { setShowSave(false); props.card.id ? updateCard() : createCard(); };
  const saveDisabled = () => { };
  const handleDelete = () => { props.deletePayment(); };

  const handleKeyPress = (e: React.KeyboardEvent<any>) => {
    const pattern = /^\d+$/;
    if (!pattern.test(e.key)) e.preventDefault();
  };

  useEffect(() => {
    setCardUpdate({ ...cardUpdate, cardData: { card: { exp_year: props.card?.exp_year?.toString().slice(2) || "", exp_month: props.card?.exp_month || "" } } });
  }, []) //eslint-disable-line

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const card = { ...cardUpdate };
    if (e.currentTarget.name === "exp_month") card.cardData.card.exp_month = e.currentTarget.value;
    if (e.currentTarget.name === "exp_year") card.cardData.card.exp_year = e.currentTarget.value;
    setCardUpdate(card);
    setShowSave(true);
  };

  const createCard = async () => {
    const cardData = elements.getElement(CardElement);
    const stripePM = await stripe.createPaymentMethod({
      type: "card",
      card: cardData
    });
    if (stripePM.error) {
      setErrorMessage(stripePM.error.message);
      setShowSave(true);
    } else {
      const pm = { ...paymentMethod };
      pm.id = stripePM.paymentMethod.id;
      await ApiHelper.post("/paymentmethods/addcard", pm, "GivingApi").then(result => {
        if (result?.raw?.message) {
          setErrorMessage(result.raw.message);
          setShowSave(true);
        } else {
          props.updateList(Locale.label("donation.cardForm.added"));
          props.setMode("display");
        }
      });
    }
  };

  const updateCard = async () => {
    if (!cardUpdate.cardData.card.exp_month || !cardUpdate.cardData.card.exp_year) setErrorMessage("Expiration month and year cannot be blank.");
    else {
      await ApiHelper.post("/paymentmethods/updatecard", cardUpdate, "GivingApi").then(result => {
        if (result?.raw?.message) {
          setErrorMessage(result.raw.message);
          setShowSave(true);
        } else {
          props.updateList(Locale.label("donation.cardForm.updated"));
          props.setMode("display");
        }
      });
    }
  };

  const getHeaderText = () => props.card.id
    ? `${props.card.name.toUpperCase()} ****${props.card.last4}`
    : Locale.label("donation.cardForm.addNew");

  return (
    <InputBox headerIcon="volunteer_activism" headerText={getHeaderText()} ariaLabelSave="save-button" ariaLabelDelete="delete-button" cancelFunction={handleCancel} saveFunction={showSave ? handleSave : saveDisabled} deleteFunction={props.card.id ? handleDelete : undefined}>
      {errorMessage && <ErrorMessages errors={[errorMessage]}></ErrorMessages>}
      <div>
        {!props.card.id
          ? <CardElement options={formStyling} />
          : <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth aria-label="card-exp-month" label={Locale.label("donation.cardForm.expirationMonth")} name="exp_month" value={cardUpdate.cardData.card.exp_month} placeholder="MM" inputProps={{ maxLength: 2 }} onChange={handleChange} onKeyPress={handleKeyPress} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth aria-label="card-exp-year" label={Locale.label("donation.cardForm.expirationYear")} name="exp_year" value={cardUpdate.cardData.card.exp_year} placeholder="YY" inputProps={{ maxLength: 2 }} onChange={handleChange} onKeyPress={handleKeyPress} />
            </Grid>
          </Grid>
        }
      </div>
    </InputBox>
  );

};
