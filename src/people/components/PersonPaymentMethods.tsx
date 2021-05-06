import React from "react";
import { Table } from "react-bootstrap";
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { DisplayBox, ApiHelper, UniqueIdHelper, UserHelper, Permissions, StripePaymentMethod, PersonInterface, CardForm, BankForm } from ".";

interface Props { personId: string }

export const PersonPaymentMethods: React.FC<Props> = (props) => {
    const [editPaymentMethod, setEditPaymentMethod] = React.useState<StripePaymentMethod>(new StripePaymentMethod());
    const [paymentMethods, setPaymentMethods] = React.useState<StripePaymentMethod[]>(null);
    const [customerId, setCustomerId] = React.useState(null);
    const [mode, setMode] = React.useState("display");
    const [person, setPerson] = React.useState<PersonInterface>(null);
    const [stripePromise, setStripe] = React.useState<Promise<Stripe>>(null);

    const handleEdit = (pm?: StripePaymentMethod) => (e: React.MouseEvent) =>{
        e.preventDefault();
        setEditPaymentMethod(pm);
        setMode("edit");
    }

    const handleDelete = async () => {
        let confirmed = window.confirm("Are you sure you want to delete this payment method?");
        if (confirmed) {
            ApiHelper.delete("/paymentmethods/" + editPaymentMethod.id + "/" + customerId, "GivingApi");
            setPaymentMethods(
                paymentMethods.filter(method => method.id !== editPaymentMethod.id)
            );
            setMode('display');
        }
    }

    const loadData = () => {
        if (!UniqueIdHelper.isMissing(props.personId)) {
            ApiHelper.get("/gateways", "GivingApi").then(data => {
                if (data.length && data[0]?.publicKey) {
                    setStripe(loadStripe(data[0].publicKey));
                    ApiHelper.get("/paymentmethods/personid/" + props.personId, "GivingApi").then(results => {
                        if (results.lenth) {
                            let cards = results.cards.data.map((card: any) => new StripePaymentMethod(card));
                            let banks = results.banks.data.map((bank: any) => new StripePaymentMethod(bank));
                            let methods = cards.concat(banks);
                            setPaymentMethods(methods);
                            setCustomerId(results.customer.customerId);
                        } else {
                            setPaymentMethods([]);
                        }
                    });
                    ApiHelper.get("/people/" + props.personId, "MembershipApi").then(data => { setPerson(data) });
                }
            });

        }
    }

    const getNewContent = () => {
        if (!UserHelper.checkAccess(Permissions.givingApi.settings.edit)) return null;
        return (
            <>
                <a id="addBtnGroup" data-cy="add-button" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="about:blank" ><i className="fas fa-plus"></i></a>
                <div className="dropdown-menu" aria-labelledby="addBtnGroup">
                    <a className="dropdown-item" data-cy="add-card" href="about:blank" onClick={handleEdit(new StripePaymentMethod({type: 'card'}))} ><i className="fas fa-credit-card"></i> Add Card</a>
                    <a className="dropdown-item" data-cy="add-bank" href="about:blank" onClick={handleEdit(new StripePaymentMethod({type: 'bank'}))} ><i className="fas fa-university"></i> Add Bank</a>
                </div>
            </>
        );
    }

    const getEditOptions = (pm: StripePaymentMethod) => {
        if (!UserHelper.checkAccess(Permissions.givingApi.settings.edit)) return null;
        return <a data-cy="edit-button" onClick={handleEdit(pm)} href="about:blank" ><i className="fas fa-pencil-alt"></i></a>;
    }

    const getPaymentRows = () => {
        let rows: JSX.Element[] = [];

        paymentMethods.forEach((method: StripePaymentMethod) => {
            rows.push(
                <tr key={method.id}>
                    <td className="capitalize">{method.name + ' ****' + method.last4}</td>
                    <td>{getEditOptions(method)}</td>
                </tr>
            );
        });
        return rows;
    }

    const PaymentMethodsTable = () => {
        if (!paymentMethods) return <div>Loading payment methods...</div>
        if (paymentMethods.length) {
            return (
                <Table>
                    <tbody>
                        {getPaymentRows()}
                    </tbody>
                </Table>
            );
        }
        else return <div>No payment methods.</div>
    }

    const updatePaymentList = (newPaymentMethod?: StripePaymentMethod) => {
        const newPaymentMethodList = paymentMethods.slice();
        newPaymentMethodList.push(newPaymentMethod);
        setPaymentMethods(newPaymentMethodList);
        setMode("display");
    }

    const EditForm = () => {
        return (
            <Elements stripe={stripePromise}>
                { editPaymentMethod.type === 'card' && <CardForm card={editPaymentMethod} customerId={customerId} person={person} setMode={setMode} deletePayment={handleDelete} updateList={updatePaymentList} /> }
                { editPaymentMethod.type === 'bank' && <BankForm bank={editPaymentMethod} customerId={customerId} person={person} setMode={setMode} deletePayment={handleDelete} updateList={updatePaymentList} /> }
            </Elements>
        );
    }

    const PaymentMethods = () => {
        if (mode === "display")  {
            return (
                <DisplayBox headerIcon="fas fa-credit-card" headerText="Payment Methods" editContent={getNewContent()}>
                    <PaymentMethodsTable></PaymentMethodsTable>
                </DisplayBox>
            );
        }
        else return <EditForm></EditForm>;
    }

    React.useEffect(loadData, [props.personId]);

    return stripePromise ? <PaymentMethods></PaymentMethods> : null;

}
