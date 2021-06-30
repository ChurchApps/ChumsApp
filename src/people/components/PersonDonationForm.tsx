import React from "react";
import { Stripe } from "@stripe/stripe-js";
import { ApiHelper, Helper, InputBox, PersonInterface, StripePaymentMethod, StripeDonationInterface, DonationPreviewModal } from ".";
import { Alert, Button, Col, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import { ErrorMessages, FundDonationInterface, FundDonations, FundInterface } from "../../donations/components";

interface Props { person: PersonInterface, customerId: string, paymentMethods: StripePaymentMethod[], stripePromise: Promise<Stripe>, donationSuccess: () => void }

export const PersonDonationForm: React.FC<Props> = (props) => {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [successMessage, setSuccessMessage] = React.useState<string>();
  const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>();
  const [funds, setFunds] = React.useState<FundInterface[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [paymentMethodName, setPaymentMethodName] = React.useState<string>(`${props.paymentMethods[0].name} ****${props.paymentMethods[0].last4}`);
  const [donationType, setDonationType] = React.useState<string>();
  const [showDonationPreviewModal, setShowDonationPreviewModal] = React.useState<boolean>(false);
  const [donation, setDonation] = React.useState<StripeDonationInterface>({
    id: props.paymentMethods[0].id,
    type: props.paymentMethods[0].type,
    customerId: props.customerId,
    person: {
      id: props.person.id,
      email: props.person.contactInfo.email,
      name: props.person.name.display
    },
    amount: 0,
    billing_cycle_anchor: + new Date(),
    interval: {
      interval_count: 1,
      interval: 'month'
    },
    funds: []
  });

  const loadData = () => {
    ApiHelper.get("/funds", "GivingApi").then(data => {
      setFunds(data);
      setFundDonations([{fundId: data[0].id}]);
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrorMessage(null);
    let d = { ...donation } as StripeDonationInterface;
    let value = e.target.value;
    switch (e.currentTarget.name) {
      case "method":
        d.id = value;
        let pm = props.paymentMethods.find(pm => pm.id === value);
        d.type = pm.type;
        setPaymentMethodName(`${pm.name} ****${pm.last4}`);
        break;
      case "type": setDonationType(value); break;
      case "date": d.billing_cycle_anchor = + new Date(value); break;
      case "interval-number": d.interval.interval_count = Number(value); break;
      case "interval-type": d.interval.interval = value; break;
      case "notes": d.notes = value; break;
    }
    setDonation(d);
  }

  const handleCancel = () => { setDonationType(null); }
  const handleSave = () => {
    if (donation.amount < .5) setErrorMessage('Donation amount must be greater than $0.50');
    else setShowDonationPreviewModal(true);
  }

  const makeDonation = async () => {
    let results;
    if (donationType === 'once') results = await ApiHelper.post("/donate/charge/", donation, "GivingApi");
    if (donationType === 'recurring') results = await ApiHelper.post("/donate/subscribe/", donation, "GivingApi");

    if (results?.status === 'succeeded' || results?.status === 'pending' || results?.status === 'active') {
      setSuccessMessage('Donation successful!');
      setShowDonationPreviewModal(false);
      setDonationType(null);
      props.donationSuccess();
    }
    if (results?.raw?.message) {
      setShowDonationPreviewModal(false);
      setErrorMessage('Error: ' + results?.raw?.message);
    }
  }

  const handleFundDonationsChange = (fd: FundDonationInterface[]) => {
    setErrorMessage(null);
    setFundDonations(fd);
    let totalAmount = 0;
    let selectedFunds: any = [];
    for (const fundDonation of fd) {
      totalAmount += fundDonation.amount || 0;
      let fund = funds.find((fund: FundInterface) => fund.id === fundDonation.fundId);
      selectedFunds.push({id: fundDonation.fundId, amount: fundDonation.amount || 0, name: fund.name});
    }
    let d = { ...donation };
    d.amount = totalAmount;
    d.funds = selectedFunds;
    setDonation(d);
    setTotal(totalAmount);
  }

  React.useEffect(loadData, [props.person?.id]);

  return (
    <>
      <DonationPreviewModal show={showDonationPreviewModal} onHide={() => setShowDonationPreviewModal(false)} handleDonate={makeDonation} donation={donation} donationType={donationType} paymentMethodName={paymentMethodName} funds={funds}/>
      <InputBox id="donationBox" data-cy="donation-box" headerIcon="fas fa-hand-holding-usd" headerText="Donate" cancelFunction={donationType ? handleCancel : undefined} saveFunction={donationType ? handleSave : undefined} saveText="Preview Donation">
        <FormGroup>
          <Row>
            <Col>
              <Button name="type" value="once" size="lg" variant={donationType === 'once' ? 'primary' : 'light'}  onClick={(e: React.MouseEvent) => { e.preventDefault(); setDonationType('once'); }} block>Make a Donation</Button>
            </Col>
            <Col>
              <Button name="type" value="recurring" size="lg" variant={donationType === 'recurring' ? 'primary' : 'light'} onClick={(e: React.MouseEvent) => { e.preventDefault(); setDonationType('recurring'); }} block>Make a Recurring Donation</Button>
            </Col>
          </Row>
        </FormGroup>
        { successMessage && <Alert variant="success">{successMessage}</Alert> }
        { donationType &&
          <>
          <FormGroup>
            <FormLabel>Method</FormLabel>
            <FormControl as="select" name="method" value={donation.id} className="capitalize" onChange={handleChange}>
              {props.paymentMethods.map((paymentMethod: any, i: number) => <option key={i} value={paymentMethod.id}>{paymentMethod.name} ****{paymentMethod.last4}</option>)}
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormLabel>{donationType === 'once' ? 'Donation Date' : 'Recurring Donation Start Date'}</FormLabel>
            <FormControl name="date" type="date" data-cy="amount" min={Helper.formatHtml5Date(new Date())} value={Helper.formatHtml5Date(new Date(donation.billing_cycle_anchor))} onChange={handleChange} onKeyDown={handleKeyDown} />
          </FormGroup>
          {donationType === 'recurring' &&
            <Row>
              <Col>
                <FormGroup>
                  <FormLabel>Interval Number</FormLabel>
                  <FormControl name="interval-number" type="number" value={donation.interval.interval_count} data-cy="interval-number" min="1" step="1" onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <FormLabel>Interval Type</FormLabel>
                  <FormControl as="select" name="interval-type" value={donation.interval.interval} onChange={handleChange}>
                    <option value="day">Day(s)</option>
                    <option value="week">Week(s)</option>
                    <option value="month">Month(s)</option>
                    <option value="year">Year(s)</option>
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>
          }
          { funds && fundDonations &&
            <FormGroup>
              <FormLabel>Fund</FormLabel>
              <FundDonations fundDonations={fundDonations} funds={funds} updatedFunction={handleFundDonationsChange} />
              { fundDonations.length > 1 && <p>Total Donation Amount: ${total}</p> }
            </FormGroup>
          }
          <div className="form-group">
            <label>Notes</label>
            <textarea className="form-control" data-cy="note" name="notes" value={donation.notes || ""} onChange={handleChange} onKeyDown={handleKeyDown}></textarea>
          </div>
          {errorMessage && <ErrorMessages errors={[errorMessage]}></ErrorMessages>}
          </>
        }
      </InputBox>
    </>
  );
}
