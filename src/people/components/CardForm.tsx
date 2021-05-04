import React, { useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { InputBox, ApiHelper, PaymentMethod, PersonInterface } from ".";

interface Props { card: PaymentMethod, customerId: string, person: PersonInterface, setMode: any, deletePayment: any, updateList: any }

export const CardForm: React.FC<Props> = (props) => {
    const form = useRef(null);
    const stripe = useStripe();
    const elements = useElements();
    const formStyling = { style: { base: { fontSize: '18px' } } };
    const [showSave, setShowSave] = React.useState(true);
    const handleCancel = () => { props.setMode('display'); }
    const handleSave = () => { setShowSave(false); props.card.id ? updateCard() : createCard(); }
    const saveDisabled = () => {}
    const handleDelete = () => { props.deletePayment(); }

    const handleKeyPress = (e: React.KeyboardEvent<any>) => {
        const pattern = /^\d+$/;
        if (!pattern.test(e.key)) e.preventDefault();
    }

    const createCard = async () => {
        const cardData = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardData
        });
        const newCard = { paymentMethod, customerId: props.customerId, personId: props.person.id, email: props.person.contactInfo.email };
        const result = await ApiHelper.post("/paymentmethods/addcard", newCard, "GivingApi");
        props.updateList(new PaymentMethod(result));
        props.setMode('display');
    }

    const updateCard = async () => {
        const expMonth = form.current['exp-month'].value;
        const expYear = form.current['exp-year'].value;
        const card = {paymentMethodId: props.card.id, cardData: {card: {exp_month: expMonth, exp_year: expYear}}};
        ApiHelper.post("/paymentmethods/updatecard", card, "GivingApi");
        props.setMode('display');
    }

    const getHeaderText = () => {
        return props.card.id ?
            `${props.card.name.toUpperCase()} ****${props.card.last4}` :
            'Add New Card';
    }

    const EditCardForm = () => {
        return (
            <Row>
                <Col>
                    <label>Card Expiration Month:</label>
                    <input type="text" id="expMonth" name="exp-month" onKeyPress={handleKeyPress} placeholder="MM" className="form-control" maxLength={2} />
                </Col>
                <Col>
                    <label>Card Expiration Year:</label>
                    <input type="text" id="expYear" name="exp-year" onKeyPress={handleKeyPress} placeholder="YY" className="form-control" maxLength={2} />
                </Col>
            </Row>
        );
    }

    return (
        <InputBox headerIcon="fas fa-hand-holding-usd" headerText={getHeaderText()} cancelFunction={handleCancel} saveFunction={showSave ? handleSave : saveDisabled} deleteFunction={props.card.id ? handleDelete : undefined}>
            <form ref={form} style={{margin: "10px"}}>
                { props.card.id ? <EditCardForm></EditCardForm> : <CardElement options={formStyling}/> }
            </form>
        </InputBox>
    );

}