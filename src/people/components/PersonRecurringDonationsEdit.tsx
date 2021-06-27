import React from "react";
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { ApiHelper, StripePaymentMethod, InputBox, SubscriptionInterface } from ".";

interface Props { subscriptionUpdated: () => void, customerId: string, paymentMethods: StripePaymentMethod[], editSubscription: SubscriptionInterface };

export const PersonRecurringDonationsEdit: React.FC<Props> = (props) => {
  const [editSubscription, setEditSubscription] = React.useState<SubscriptionInterface>(props.editSubscription);

  const handleCancel = () => { props.subscriptionUpdated(); }
  const handleSave = () => {
    ApiHelper.post("/subscriptions", [editSubscription], "GivingApi").then(() => props.subscriptionUpdated())
  }

  const handleDelete = () => {
    const conf = window.confirm('Are you sure you want to delete this recurring donation?');
    if (!conf) return;
    let promises = [];
    promises.push(ApiHelper.delete("/subscriptions/" + props.editSubscription.id, "GivingApi"));
    promises.push(ApiHelper.delete("/subscriptionfunds/subscription/" + props.editSubscription.id, "GivingApi"));
    Promise.all(promises).then(() => props.subscriptionUpdated());
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let sub = { ...editSubscription } as SubscriptionInterface;
    let value = e.target.value;
    switch (e.currentTarget.name) {
      case "method":
        let pm = props.paymentMethods.find((pm: StripePaymentMethod) => pm.id === value);
        sub.default_payment_method = pm.type === 'card' ? value : null;
        sub.default_source = pm.type === 'bank' ? value : null;
        break;
    }
    setEditSubscription(sub);
  }

  const getFields = () => {
    return(
      <FormGroup>
        <FormLabel>Method</FormLabel>
        <FormControl as="select" name="method" value={editSubscription.default_payment_method || editSubscription.default_source} className="capitalize" onChange={handleChange}>
          {props.paymentMethods.map((paymentMethod: any, i: number) => <option key={i} value={paymentMethod.id}>{paymentMethod.name} ****{paymentMethod.last4}</option>)}
        </FormControl>
      </FormGroup>
    );
  }

  return (
    <InputBox data-cy="person-details-box" headerIcon="fas fa-user" headerText="Edit Recurring Donation" cancelFunction={handleCancel} deleteFunction={handleDelete} saveFunction={handleSave}>
      {getFields()}
    </InputBox>
  );
}
