import React from "react";
import { Table } from "react-bootstrap";
import { Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { DisplayBox, ApiHelper, UserHelper, Permissions, StripePaymentMethod, PersonInterface, CardForm, BankForm, Loading } from ".";

interface Props { person: PersonInterface, customerId: string, paymentMethods: StripePaymentMethod[], stripePromise: Promise<Stripe> }

export const PersonPaymentMethods: React.FC<Props> = (props) => {
  const [editPaymentMethod, setEditPaymentMethod] = React.useState<StripePaymentMethod>(new StripePaymentMethod());
  const [paymentMethods, setPaymentMethods] = React.useState<StripePaymentMethod[]>(props.paymentMethods);
  const [mode, setMode] = React.useState("display");
  const [verify, setVerify] = React.useState<boolean>(false);

  const handleEdit = (pm?: StripePaymentMethod, verifyAccount?: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    setEditPaymentMethod(pm);
    setVerify(verifyAccount)
    setMode("edit");
  }

  const handleDelete = async () => {
    let confirmed = window.confirm("Are you sure you want to delete this payment method?");
    if (confirmed) {
      ApiHelper.delete("/paymentmethods/" + editPaymentMethod.id + "/" + props.customerId, "GivingApi");
      setPaymentMethods(
        paymentMethods.filter(method => method.id !== editPaymentMethod.id)
      );
      setMode("display");
    }
  }

  const getNewContent = () => {
    if (!UserHelper.checkAccess(Permissions.givingApi.settings.edit)) return null;
    return (
      <>
        <a id="addBtnGroup" data-cy="add-button" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="about:blank"><i className="fas fa-plus"></i></a>
        <div className="dropdown-menu" aria-labelledby="addBtnGroup">
          <a className="dropdown-item" data-cy="add-card" href="about:blank" onClick={handleEdit(new StripePaymentMethod({type: "card"}))}><i className="fas fa-credit-card"></i> Add Card</a>
          <a className="dropdown-item" data-cy="add-bank" href="about:blank" onClick={handleEdit(new StripePaymentMethod({type: "bank"}))}><i className="fas fa-university"></i> Add Bank</a>
        </div>
      </>
    );
  }

  const getEditOptions = (pm: StripePaymentMethod) => {
    if (!UserHelper.checkAccess(Permissions.givingApi.settings.edit)) return null;
    return <a data-cy="edit-button" onClick={handleEdit(pm)} href="about:blank"><i className="fas fa-pencil-alt"></i></a>;
  }

  const getPaymentRows = () => {
    let rows: JSX.Element[] = [];

    paymentMethods.forEach((method: StripePaymentMethod) => {
      rows.push(
        <tr key={method.id}>
          <td className="capitalize">{method.name + " ****" + method.last4}</td>
          <td>{method?.status === "new" && <a href="about:blank"  onClick={handleEdit(method, true)}>Verify Account</a> }</td>
          <td className="text-right">{getEditOptions(method)}</td>
        </tr>
      );
    });
    return rows;
  }

  const PaymentMethodsTable = () => {
    if (!paymentMethods) return <Loading></Loading>
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

  const EditForm = () => (
    <Elements stripe={props.stripePromise}>
      { editPaymentMethod.type === "card" && <CardForm card={editPaymentMethod} customerId={props.customerId} person={props.person} setMode={setMode} deletePayment={handleDelete} updateList={() => {}} /> }
      { editPaymentMethod.type === "bank" && <BankForm bank={editPaymentMethod} showVerifyForm={verify} customerId={props.customerId} person={props.person} setMode={setMode} deletePayment={handleDelete} updateList={() => {}} /> }
    </Elements>
  )

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

  return props.stripePromise ? <PaymentMethods></PaymentMethods> : null;

}
