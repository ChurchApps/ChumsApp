import React from "react";
import { DisplayBox, ApiHelper, UniqueIdHelper, PersonPaymentMethodsEdit, UserHelper, Permissions, PaymentMethodInterface } from ".";
import { Table } from "react-bootstrap";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PeopleSearchResults } from "./PeopleSearchResults";

const stripePromise = loadStripe('pk_test_IsC6UPM4P5EZ6KAEorHwEMvU00M6ioef1d');

interface Props { personId: string, gateway: any }

export const PersonPaymentMethods: React.FC<Props> = (props) => {
    const [paymentMethod, setPaymentMethod] = React.useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = React.useState<any[]>([]);
    const [cards, setCards] = React.useState<any>({data: []});
    const [banks, setBanks] = React.useState<any>({data: []});
    const [paymentType, setPaymentType] = React.useState("");
    const [customerId, setCustomerId] = React.useState(null);
    const [mode, setMode] = React.useState("display");
    const handleEdit = (paymentType: string, pm?: any) => {
        setPaymentType(paymentType);
        setPaymentMethod(pm);
        setMode("edit");
    }

    const loadData = () => {
        if (!UniqueIdHelper.isMissing(props.personId)) {
            ApiHelper.get("/paymentmethods/personid/" + props.personId, "GivingApi").then(results => {
                setCards(results.cards);
                setBanks(results.banks);
                setCustomerId(results.customer.customerId);
            });
        }
    }

    const getNewContent = () => {
        if (!UserHelper.checkAccess(Permissions.givingApi.settings.edit)) return null;
        return (
            <>
                <a id="addBtnGroup" data-cy="add-button" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="about:blank" ><i className="fas fa-plus"></i></a>
                <div className="dropdown-menu" aria-labelledby="addBtnGroup">
                    <a className="dropdown-item" data-cy="add-card" href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); handleEdit("card")}} ><i className="fas fa-credit-card"></i> Add Card</a>
                    <a className="dropdown-item" data-cy="add-bank" href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); handleEdit("bank")}} ><i className="fas fa-university"></i> Add Bank</a>
                </div>
            </>
        );
    }

    const getEditOptions = (type: string, pm: any) => {
        if (!UserHelper.checkAccess(Permissions.givingApi.settings.edit)) return null;
        return <a data-cy="edit-button" onClick={e => { e.preventDefault(); handleEdit(type, pm); }} href="about:blank" ><i className="fas fa-pencil-alt"></i></a>;
    }

    const getPaymentRows = () => {
        let rows: JSX.Element[] = [];

        cards.data.forEach((card: any) => {
            let item = card[card.type];
            rows.push(
                <tr key={card.id}><td style={{textTransform: "capitalize"}}>{item.brand + ' ****' + item.last4}</td><td>{getEditOptions('card', card)}</td></tr>
            );
        });
        banks.data.forEach((bank: any) => {
            rows.push(
                <tr key={bank.id}><td style={{textTransform: "capitalize"}}>{bank.bank_name + ' ****' + bank.last4}</td><td>{getEditOptions('bank', bank)}</td></tr>
            );
        });
        return rows;
    }

    const PaymentMethodsTable = () => {
        if (cards?.data.length || banks?.data.length) {
            return (
                <Table>
                    <tbody>{getPaymentRows()}</tbody>
                </Table>
            );
        }
        else return <div>No payment methods.</div>
    }

    const updatePaymentList = (newPaymentMethod?: any) => {
        const newPaymentMethodList = paymentMethods.slice();
        newPaymentMethodList.push(newPaymentMethod);
        setPaymentMethods(newPaymentMethodList);
        setMode("display");
    }

    const PaymentMethods = () => {
        if (mode === "display") {
            return (
                <DisplayBox headerIcon="fas fa-credit-card" headerText="Payment Methods" editContent={getNewContent()}>
                    <PaymentMethodsTable></PaymentMethodsTable>
                </DisplayBox>
            );
        }
        else return (
            <Elements stripe={stripePromise}>
                <PersonPaymentMethodsEdit personId={props.personId} setMode={setMode} updatePaymentList={updatePaymentList} customerId={customerId} paymentType={paymentType} paymentMethod={paymentMethod}></PersonPaymentMethodsEdit>
            </Elements>
        );
    }

    React.useEffect(loadData, [props.personId]);

    if(!props.gateway) return null
    else return <PaymentMethods></PaymentMethods>;

}
