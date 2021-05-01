import React, { useRef } from 'react';
import { ApiHelper, PersonInterface, InputBox } from ".";
import { Row, Col, FormControl } from "react-bootstrap";
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface Props { personId: string, setMode: any, updatePaymentList: any, customerId: string, paymentType: string, paymentMethod: any }

export const PersonPaymentMethodsEdit: React.FC<Props> = (props) => {
    const [person, setPerson] = React.useState<PersonInterface>(null);
    const loadData = () => { ApiHelper.get("/people/" + props.personId, "MembershipApi").then(data => { setPerson(data) }); }
    const handleSave = () => { if (props.paymentMethod) updatePaymentMethod(); else createNewPaymentMethod(); }
    const handleCancel = () => { props.setMode('display'); }
    const getDeleteFunction = () => { return (props.paymentMethod) ? handleDelete : undefined; }
    const form = useRef(null);
    const stripe = useStripe();
    const elements = useElements();
    const paymentTypes: any = {
        card: 'Card',
        bank: 'Bank Account'
    }

    const getHeaderText = () => {
        const headerText = props.paymentMethod ?
            'Edit ' +  getPaymentName() :
            'Add New ' + paymentTypes[props.paymentType];
        return headerText;
    }

    const getPaymentName = () => {
        if (props.paymentType === 'card') return props.paymentMethod.card.brand + ' ****' + props.paymentMethod.card.last4;
        else return props.paymentMethod.bank_name + ' ****' + props.paymentMethod.last4;
    }

    const createNewCard = async () => {
        const paymentData = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: paymentData
        });
        const newPaymentMethod = { paymentMethod, customerId: props.customerId, personId: props.personId, personEmail: person.contactInfo.email };
        ApiHelper.post("/paymentmethods/addcard", newPaymentMethod, "GivingApi");
    }

    const createNewBankAccount = async () => {
        const bankData = {
            account_holder_name: form.current['account-holder-name'].value,
            account_holder_type: form.current['account-holder-type'].value,
            country: 'US',
            currency: 'usd',
            account_number: form.current['account-number'].value,
            routing_number: form.current['routing-number'].value
        }

        const { token } = await stripe.createToken('bank_account', bankData);
        const newPaymentMethod = { token, customerId: props.customerId, personId: props.personId, personEmail: person.contactInfo.email };
        ApiHelper.post("/paymentmethods/addbankaccount", newPaymentMethod, "GivingApi");
    }

    const createNewPaymentMethod = async () => {
        if (props.paymentType === 'card') createNewCard();
        if (props.paymentType === 'bank') createNewBankAccount();
    }

    const updateCard = async () => {
        const expMonth = form.current['exp-month'].value;
        const expYear = form.current['exp-year'].value;
        const card = {paymentMethodId: props.paymentMethod.id, cardData: {card: {exp_month: expMonth, exp_year: expYear}}};
        ApiHelper.post("/paymentmethods/updatecard", card, "GivingApi");
        props.setMode('display');
    }

    const updateBank = async () => {
        const accountHolderName = form.current['account-holder-name'].value;
        const accountHolderType = form.current['account-holder-type'].value;
        const bank = {
            paymentMethodId: props.paymentMethod.id,
            bankData: {account_holder_name: accountHolderName, account_holder_type: accountHolderType},
            customerId: props.customerId
        };
        ApiHelper.post("/paymentmethods/updatebank", bank, "GivingApi");
        props.setMode('display');
    }

    const updatePaymentMethod = async () => {
        if (props.paymentType === 'card') updateCard();
        if (props.paymentType === 'bank') updateBank();
    }

    const handleDelete = async () => {
        let conf = window.confirm("Are you sure you want to delete this payment method?");
        if (conf) ApiHelper.delete("/paymentmethods/" + props.paymentMethod.id + "/" + props.customerId, "GivingApi");
    }

    const handleCardExpChange = (e: any) => {
        const pattern = /^\d+$/;
        if (!pattern.test(e.key)) e.preventDefault();
    }

    const handleChange = (e: any) => {

    }

    const handleKeyDown = (e: any) => {

    }

    const CardForm = () => {
        if (props.paymentMethod) {
            return (
                <Row>
                    <Col>
                        <label>Card Expiration Month:</label>
                        <input type="text" id="expMonth" name="exp-month" onKeyPress={handleCardExpChange} placeholder="MM" className="form-control" maxLength={2} />
                    </Col>
                    <Col>
                        <label>Card Expiration Year:</label>
                        <input type="text" id="expYear" name="exp-year" onKeyPress={handleCardExpChange} placeholder="YY" className="form-control" maxLength={2} />
                    </Col>
                </Row>
            );
        } else return <CardElement options={{ style: { base: { fontSize: '18px' } } } }/>
    }

    const NewBankForm = () => {
        return (
            <Row>
                <Col>
                    <label>Account Holder Name</label>
                    <input type="text" name="account-holder-name" placeholder="Account Holder Name" className="form-control" />
                </Col>
                <Col>
                    <label>Account Holder Type</label>
                    <FormControl as="select" name="account-holder-type" data-cy="account-holder-type" onChange={handleChange} onKeyDown={handleKeyDown}>
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                    </FormControl>
                </Col>
            </Row>
        );
    }

    const BankForm = () => {
        return (
            <>
                <Row>
                    <Col>
                        <label>Account Holder Name</label>
                        <input type="text" name="account-holder-name" placeholder="Account Holder Name" className="form-control" />
                    </Col>
                    <Col>
                        <label>Account Holder Type</label>
                        <FormControl as="select" name="account-holder-type" data-cy="account-holder-type" onChange={handleChange} onKeyDown={handleKeyDown}>
                            <option value="individual">Individual</option>
                            <option value="company">Company</option>
                        </FormControl>
                    </Col>
                </Row>
                { !props.paymentMethod &&
                    <Row>
                        <Col>
                            <label>Routing Number</label>
                            <input type="number" name="routing-number" placeholder="Routing Number" className="form-control" />
                        </Col>
                        <Col>
                            <label>Account Number</label>
                            <input type="number" name="account-number" placeholder="Account Number" className="form-control" />
                        </Col>
                    </Row>
                }
            </>
        );
    }

    React.useEffect(loadData, []);

    return (
        <InputBox headerIcon="fas fa-hand-holding-usd" headerText={getHeaderText()} cancelFunction={handleCancel} saveFunction={handleSave} deleteFunction={getDeleteFunction()} >
            <form ref={form} style={{margin: "10px"}}>
                {props.paymentType === 'card' ? <CardForm></CardForm> : <BankForm></BankForm>}
            </form>
        </InputBox>
    );
}