import React from "react";
import { Row, Col, FormControl } from "react-bootstrap";
import { useStripe } from "@stripe/react-stripe-js";
import { InputBox, ApiHelper, StripePaymentMethod, PaymentMethodInterface, PersonInterface, StripeBankAccountInterface, StripeBankAccountUpdateInterface, StripeBankAccountVerifyInterface, ErrorMessages } from ".";

interface Props { bank: StripePaymentMethod, showVerifyForm: boolean, customerId: string, person: PersonInterface, setMode: any, deletePayment: any, updateList: () => void }

export const BankForm: React.FC<Props> = (props) => {
  const stripe = useStripe();
  const [bankAccount, setBankAccount] = React.useState<StripeBankAccountInterface>({ account_holder_name: props.bank.account_holder_name, account_holder_type: props.bank.account_holder_type, country: "US", currency: "usd" } as StripeBankAccountInterface);
  const [paymentMethod] = React.useState<PaymentMethodInterface>({ customerId: props.customerId, personId: props.person.id, email: props.person.contactInfo.email, name: props.person.name.display });
  const [updateBankData] = React.useState<StripeBankAccountUpdateInterface>({ paymentMethodId: props.bank.id, customerId: props.customerId, bankData: { account_holder_name: props.bank.account_holder_name, account_holder_type: props.bank.account_holder_type} } as StripeBankAccountUpdateInterface);
  const [verifyBankData, setVerifyBankData] = React.useState<StripeBankAccountVerifyInterface>({ paymentMethodId: props.bank.id, customerId: props.customerId, amountData: { amounts: [] } });
  const [showSave, setShowSave] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string>(null);
  const saveDisabled = () => {}
  const handleCancel = () => { props.setMode("display"); }
  const handleDelete = () => { props.deletePayment(); }
  const handleSave = () => {
    setShowSave(false);
    if (props.showVerifyForm) verifyBank();
    else {
      props.bank.id ? updateBank() : createBank();
    }
  }

  const createBank = async () => {
    await stripe.createToken("bank_account", bankAccount).then(response => {
      if (response?.error?.message) {
        setErrorMessage(response.error.message);
        setShowSave(true);
      }
      else {
        const pm = { ...paymentMethod };
        pm.id = response.token.id;
        ApiHelper.post("/paymentmethods/addbankaccount", pm, "GivingApi").then(result => {
          if (result?.raw?.message) {
            setErrorMessage(result.raw.message);
            setShowSave(true);
          }
          else {
            props.updateList();
            props.setMode("display");
          }
        });
      }
    });
  }

  const updateBank = () => {
    let bank = { ...updateBankData };
    bank.bankData.account_holder_name = bankAccount.account_holder_name;
    bank.bankData.account_holder_type = bankAccount.account_holder_type;
    ApiHelper.post("/paymentmethods/updatebank", bank, "GivingApi");
    props.updateList();
    props.setMode("display");
  }

  const verifyBank = () => {
    if (verifyBankData?.amountData?.amounts?.length === 2) {
      ApiHelper.post("/paymentmethods/verifyBank", verifyBankData, "GivingApi").then(response => {
        if (response?.raw?.message) {
          setErrorMessage(response.raw.message);
          setShowSave(true);
        }
        else {
          props.updateList();
          props.setMode("display");
        }
      });
    }
  }

  const getHeaderText = () => props.bank.id
    ? `${props.bank.name.toUpperCase()} ****${props.bank.last4}`
    : "Add New Bank Account"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const bankData = { ...bankAccount };
    const inputData = { [e.currentTarget.name]: e.currentTarget.value };
    setBankAccount({ ...bankData, ...inputData });
  }

  const handleKeyPress = (e: React.KeyboardEvent<any>) => {
    const pattern = /^\d+$/;
    if (!pattern.test(e.key)) e.preventDefault();
  }

  const handleVerify = (e: React.ChangeEvent<HTMLInputElement>) => {
    const verifyData = { ...verifyBankData };
    if (e.currentTarget.name === "amount1") verifyData.amountData.amounts[0] = e.currentTarget.value;
    if (e.currentTarget.name === "amount2") verifyData.amountData.amounts[1] = e.currentTarget.value;
    setVerifyBankData(verifyData);
  }

  return (
    <InputBox headerIcon="fas fa-hand-holding-usd" headerText={getHeaderText()} cancelFunction={handleCancel} saveFunction={showSave ? handleSave : saveDisabled} deleteFunction={props.bank.id && !props.showVerifyForm ? handleDelete : undefined}>
      { errorMessage && <ErrorMessages errors={[errorMessage]}></ErrorMessages> }
      <form data-cy="bank-form" style={{margin: "10px"}}>
        { props.showVerifyForm
          ?   <Row>
            <Col>
              <label>First Deposit</label>
              <input type="text" name="amount1" placeholder="00" className="form-control" maxLength={2} onChange={handleVerify} onKeyPress={handleKeyPress} />
            </Col>
            <Col>
              <label>Second Deposit</label>
              <input type="text" name="amount2" placeholder="00" className="form-control" maxLength={2} onChange={handleVerify} onKeyPress={handleKeyPress} />
            </Col>
          </Row>
          : <>
            <Row>
              <Col>
                <label>Account Holder Name</label>
                <input type="text" name="account_holder_name" data-cy="account-holder-name" placeholder="Account Holder Name" value={bankAccount.account_holder_name} className="form-control" onChange={handleChange} />
              </Col>
              <Col>
                <label>Account Holder Type</label>
                <FormControl as="select" name="account_holder_type" data-cy="account-holder-type" value={bankAccount.account_holder_type} onChange={handleChange}>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </FormControl>
              </Col>
            </Row>
            { !props.bank.id
                            && <Row>
                              <Col>
                                <label>Routing Number</label>
                                <input type="number" name="routing_number" placeholder="Routing Number" className="form-control" onChange={handleChange} />
                              </Col>
                              <Col>
                                <label>Account Number</label>
                                <input type="number" name="account_number" placeholder="Account Number" className="form-control" onChange={handleChange} />
                              </Col>
                            </Row>
            }
          </>
        }
      </form>
    </InputBox>
  );

}
