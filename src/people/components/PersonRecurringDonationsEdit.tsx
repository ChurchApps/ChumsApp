import React from "react";
import { Col, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import { ApiHelper, StripePaymentMethod, InputBox, SubscriptionInterface } from ".";

interface Props { subscriptionUpdated: () => void, customerId: string, paymentMethods: StripePaymentMethod[], editSubscription: SubscriptionInterface };

export const PersonRecurringDonationsEdit: React.FC<Props> = (props) => {
  const [editSubscription, setEditSubscription] = React.useState<SubscriptionInterface>(props.editSubscription);

  const handleCancel = () => { props.subscriptionUpdated(); }
  const handleSave = () => {
    ApiHelper.post("/subscriptions", [editSubscription], "GivingApi").then(() => props.subscriptionUpdated())
  }

  const handleDelete = () => {
    const conf = window.confirm("Are you sure you want to delete this recurring donation?");
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
        sub.default_payment_method = pm.type === "card" ? value : null;
        sub.default_source = pm.type === "bank" ? value : null;
        break;
      case "interval-number": sub.plan.interval_count = Number(value); break;
      case "interval-type": sub.plan.interval = value; break;
    }
    setEditSubscription(sub);
  }

  const getFields = () => (
    <>
      <Row>
        <Col>
          <FormGroup>
            <FormLabel>Method</FormLabel>
            <FormControl as="select" name="method" aria-label="method" value={editSubscription.default_payment_method || editSubscription.default_source} className="capitalize" onChange={handleChange}>
              {props.paymentMethods.map((paymentMethod: any, i: number) => <option key={i} value={paymentMethod.id}>{paymentMethod.name} ****{paymentMethod.last4}</option>)}
            </FormControl>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup>
            <FormLabel>Interval Number</FormLabel>
            <FormControl name="interval-number" aria-label="interval-number" type="number" value={editSubscription.plan.interval_count} min="1" step="1" onChange={handleChange} />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <FormLabel>Interval Type</FormLabel>
            <FormControl as="select" name="interval-type" aria-label="interval-type" value={editSubscription.plan.interval} onChange={handleChange}>
              <option value="day">Day(s)</option>
              <option value="week">Week(s)</option>
              <option value="month">Month(s)</option>
              <option value="year">Year(s)</option>
            </FormControl>
          </FormGroup>
        </Col>
      </Row>
    </>
  )

  return (
    <InputBox aria-label="person-details-box" headerIcon="fas fa-user" headerText="Edit Recurring Donation" ariaLabelSave="save-button" ariaLabelDelete="delete-button" cancelFunction={handleCancel} deleteFunction={handleDelete} saveFunction={handleSave}>
      {getFields()}
    </InputBox>
  );
}
