import React, { useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { InputBox, ApiHelper, StripePaymentMethod, PersonInterface, PaymentMethodInterface, StripeCardUpdateInterface } from ".";

interface Props { card: StripePaymentMethod, customerId: string, person: PersonInterface, setMode: any, deletePayment: any, updateList: any }

export const CardForm: React.FC<Props> = (props) => {
    const form = useRef(null);
    const stripe = useStripe();
    const elements = useElements();
    const formStyling = { style: { base: { fontSize: '18px' } } };
    const [showSave, setShowSave] = React.useState(true);
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodInterface>({ customerId: props.customerId, personId: props.person.id, email: props.person.contactInfo.email });
    const [cardUpdate, setCardUpdate] = React.useState<StripeCardUpdateInterface>({ paymentMethodId: props.card.id } as StripeCardUpdateInterface);
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
        const stripePM = await stripe.createPaymentMethod({
            type: 'card',
            card: cardData
        });
        let pm = { ...paymentMethod };
        pm.id = stripePM.paymentMethod.id;
        setPaymentMethod(pm);
        await ApiHelper.post("/paymentmethods/addcard", paymentMethod, "GivingApi").then(result => {
            props.updateList(new StripePaymentMethod(result));
            props.setMode('display');
        });
    }

    const updateCard = async () => {
        let cu = { ...cardUpdate };
        cu.cardData.card.exp_month = form.current['exp-month'].value;
        cu.cardData.card.exp_year = form.current['exp-year'].value;
        setCardUpdate(cu);
        ApiHelper.post("/paymentmethods/updatecard", cu, "GivingApi");
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