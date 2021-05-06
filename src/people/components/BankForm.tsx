import React, { useRef } from "react";
import { Row, Col, FormControl } from "react-bootstrap";
import { useStripe } from '@stripe/react-stripe-js';
import { InputBox, ApiHelper, StripePaymentMethod, PaymentMethodInterface, PersonInterface, StripeBankAccountInterface, StripeBankAccountUpdateInterface } from ".";

interface Props { bank: StripePaymentMethod, customerId: string, person: PersonInterface, setMode: any, deletePayment: any, updateList: any }

export const BankForm: React.FC<Props> = (props) => {
    const form = useRef(null);
    const stripe = useStripe();
    const [newBankData, setNewBankData] = React.useState<StripeBankAccountInterface>({country: 'US', currency: 'usd'} as StripeBankAccountInterface);
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodInterface>({ customerId: props.customerId, personId: props.person.id, email: props.person.contactInfo.email });
    const [updateBankData, setUpdateBankData] = React.useState<StripeBankAccountUpdateInterface>({paymentMethodId: props.bank.id, customerId: props.customerId } as StripeBankAccountUpdateInterface);
    const [showSave, setShowSave] = React.useState(true);
    const handleSave = () => { setShowSave(false); props.bank.id ? updateBank() : createBank(); }
    const saveDisabled = () => {}
    const handleCancel = () => { props.setMode('display'); }
    const handleDelete = () => { props.deletePayment(); }

    const createBank = async () => {
        const bankData = {
            account_holder_name: form.current['account-holder-name'].value,
            account_holder_type: form.current['account-holder-type'].value,
            country: 'US',
            currency: 'usd',
            account_number: form.current['account-number'].value,
            routing_number: form.current['routing-number'].value
        }

        const { token } = await stripe.createToken('bank_account', bankData)

        const pm = { ...paymentMethod };
        pm.id = token.id;
        setPaymentMethod(pm);
        ApiHelper.post("/paymentmethods/addbankaccount", paymentMethod, "GivingApi").then(result => {
            props.updateList(new StripePaymentMethod(result));
            props.setMode('display');
        });
    }

    const updateBank = () => {
        const ub = { ...updateBankData };
        ub.bankData.account_holder_name = form.current['account-holder-name'].value;
        ub.bankData.account_holder_type = form.current['account-holder-type'].value;
        setUpdateBankData(ub);
        ApiHelper.post("/paymentmethods/updatebank", updateBankData, "GivingApi");
        props.setMode('display');
    }

    const getHeaderText = () => {
        return props.bank.id ?
            `${props.bank.name.toUpperCase()} ****${props.bank.last4}` :
            'Add New Bank Account';
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
                        <FormControl as="select" name="account-holder-type" data-cy="account-holder-type">
                            <option value="individual">Individual</option>
                            <option value="company">Company</option>
                        </FormControl>
                    </Col>
                </Row>
                { !props.bank.id &&
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

    return (
        <InputBox headerIcon="fas fa-hand-holding-usd" headerText={getHeaderText()} cancelFunction={handleCancel} saveFunction={showSave ? handleSave : saveDisabled} deleteFunction={props.bank.id ? handleDelete : undefined}>
            <form ref={form} style={{margin: "10px"}}>
                <BankForm></BankForm>
            </form>
        </InputBox>
    );

}