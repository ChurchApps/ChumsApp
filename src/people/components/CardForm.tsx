import React from "react";
import { Row, Col } from "react-bootstrap";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { InputBox, ApiHelper, StripePaymentMethod, PersonInterface, PaymentMethodInterface, StripeCardUpdateInterface, ErrorMessages } from ".";

interface Props { card: StripePaymentMethod, customerId: string, person: PersonInterface, setMode: any, deletePayment: any, updateList: () => void }

export const CardForm: React.FC<Props> = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const formStyling = { style: { base: { fontSize: "18px" } } };
  const [showSave, setShowSave] = React.useState(true);
  const [paymentMethod] = React.useState<PaymentMethodInterface>({ id: props.card.id, customerId: props.customerId, personId: props.person.id, email: props.person.contactInfo.email, name: props.person.name.display });
  const [cardUpdate, setCardUpdate] = React.useState<StripeCardUpdateInterface>({ paymentMethodId: props.card.id, cardData: { card: {}} } as StripeCardUpdateInterface);
  const [errorMessage, setErrorMessage] = React.useState<string>(null);
  const handleCancel = () => { props.setMode("display"); }
  const handleSave = () => { setShowSave(false); props.card.id ? updateCard() : createCard(); }
  const saveDisabled = () => {}
  const handleDelete = () => { props.deletePayment(); }

  const handleKeyPress = (e: React.KeyboardEvent<any>) => {
    const pattern = /^\d+$/;
    if (!pattern.test(e.key)) e.preventDefault();
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const card = { ...cardUpdate };
    if (e.currentTarget.name === "exp_month") card.cardData.card.exp_month = e.currentTarget.value;
    if (e.currentTarget.name === "exp_year") card.cardData.card.exp_year = e.currentTarget.value;
    setCardUpdate(card);
  }

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
      let pm = { ...paymentMethod };
      pm.id = stripePM.paymentMethod.id;
      await ApiHelper.post("/paymentmethods/addcard", pm, "GivingApi").then(result => {
        if (result?.raw?.message) {
          setErrorMessage(result.raw.message);
          setShowSave(true);
        }
        else {
          props.updateList();
          props.setMode("display");
        }
      });
    }
  }

  const updateCard = async () => {
    ApiHelper.post("/paymentmethods/updatecard", cardUpdate, "GivingApi");
    props.setMode("display");
  }

  const getHeaderText = () => props.card.id
    ? `${props.card.name.toUpperCase()} ****${props.card.last4}`
    : "Add New Card"

  return (
    <InputBox headerIcon="fas fa-hand-holding-usd" headerText={getHeaderText()} cancelFunction={handleCancel} saveFunction={showSave ? handleSave : saveDisabled} deleteFunction={props.card.id ? handleDelete : undefined}>
      { errorMessage && <ErrorMessages errors={[errorMessage]}></ErrorMessages> }
      <form style={{margin: "10px"}}>
        { !props.card.id
          ? <CardElement options={formStyling} />
          : <Row>
            <Col>
              <label>Card Expiration Month:</label>
              <input type="text" name="exp_month" aria-label="card-exp-month" onKeyPress={handleKeyPress} onChange={handleChange} placeholder="MM" className="form-control" maxLength={2} />
            </Col>
            <Col>
              <label>Card Expiration Year:</label>
              <input type="text" name="exp_year" aria-label="card-exp-year" onKeyPress={handleKeyPress} onChange={handleChange} placeholder="YY" className="form-control" maxLength={2} />
            </Col>
          </Row>
        }
      </form>
    </InputBox>
  );

}
