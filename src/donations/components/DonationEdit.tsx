import React from "react";
import { ApiHelper, InputBox, DonationInterface, FundDonationInterface, PersonAdd, FundInterface, DateHelper, PersonInterface, UniqueIdHelper, PersonHelper } from ".";
import { FundDonations } from "../../appBase/donationComponents/components/FundDonations";

interface Props { donationId: string, batchId: string, funds: FundInterface[], updatedFunction: () => void }

export const DonationEdit: React.FC<Props> = (props) => {

  const [donation, setDonation] = React.useState<DonationInterface>({});
  const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>([]);
  const [showSelectPerson, setShowSelectPerson] = React.useState(false);

  //const getEditContent = () => { return (<a href="about:blank"><i className="fas fa-plus"></i></a>); }
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let d = { ...donation } as DonationInterface;
    let value = e.target.value;
    switch (e.currentTarget.name) {
      case "notes": d.notes = value; break;
      case "date": d.donationDate = new Date(value); break;
      case "method": d.method = value; break;
      case "methodDetails": d.methodDetails = value; break;
    }
    setDonation(d);
  }

  const handleCancel = () => { props.updatedFunction(); }
  const handleDelete = () => { ApiHelper.delete("/donations/" + donation.id, "GivingApi").then(() => { props.updatedFunction() }); }
  const getDeleteFunction = () => (UniqueIdHelper.isMissing(props.donationId)) ? undefined : handleDelete

  const handleSave = () => {
    ApiHelper.post("/donations", [donation], "GivingApi").then(data => {
      let id = data[0].id;
      let promises = [];
      let fDonations = [...fundDonations];
      for (let i = fDonations.length - 1; i >= 0; i--) {
        let fd = fundDonations[i];
        if (fd.amount === undefined || fd.amount === 0) {
          if (!UniqueIdHelper.isMissing(fd.id)) promises.push(ApiHelper.delete("/funddonations/" + fd.id, "GivingApi"));
          fDonations.splice(i, 1);
        } else (fd.donationId = id)
      }
      if (fDonations.length > 0) promises.push(ApiHelper.post("/funddonations", fDonations, "GivingApi"));
      Promise.all(promises).then(() => props.updatedFunction());
    });
  }

  const loadData = () => {
    if (UniqueIdHelper.isMissing(props.donationId)) {
      setDonation({ donationDate: new Date(), batchId: props.batchId, amount: 0, method: "Cash" });
      let fd: FundDonationInterface = { amount: 0, fundId: props.funds[0].id };
      setFundDonations([fd]);
    }
    else {
      ApiHelper.get("/donations/" + props.donationId, "GivingApi").then(data => populatePerson(data));
      ApiHelper.get("/funddonations?donationId=" + props.donationId, "GivingApi").then(data => setFundDonations(data));
    }
  }

  const populatePerson = async (data: DonationInterface) => {
    if (!UniqueIdHelper.isMissing(data.personId)) data.person = await ApiHelper.get("/people/" + data.personId.toString(), "MembershipApi");
    setDonation(data);
  }

  const getMethodDetails = () => {
    if (donation.method === "Cash") return null;
    let label = (donation.method === "Check") ? "Check #" : "Last 4 digits";
    return (<div className="form-group">
      <label>{label}</label>
      <input type="text" className="form-control" name="methodDetails" value={donation.methodDetails} onChange={handleChange} />
    </div>);
  }

  const handlePersonAdd = (p: PersonInterface) => {
    let d = { ...donation } as DonationInterface;
    if (p === null) {
      d.person = null;
      d.personId = "";
    } else {
      d.person = p;
      d.personId = p.id;
    }
    setDonation(d);
    setShowSelectPerson(false);
  }

  const handleFundDonationsChange = (fd: FundDonationInterface[]) => {
    setFundDonations(fd);
    let totalAmount = 0;
    for (let i = 0; i < fundDonations.length; i++) totalAmount += fd[i].amount;
    if (totalAmount !== donation.amount) {
      let d = { ...donation };
      d.amount = totalAmount;
      setDonation(d);
    }
  }

  const getPersonSection = () => {
    if (showSelectPerson) return (<>
      <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={handlePersonAdd} />
      <hr />
      <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); handlePersonAdd(null); }}>Anonymous</a>
    </>
    );
    else {
      let personText = (donation.person === undefined || donation.person === null) ? ("Anonymous") : donation.person.name.display;
      return (<div>
        <a href="about:blank" data-cy="donating-person" onClick={(e: React.MouseEvent) => { e.preventDefault(); setShowSelectPerson(true); }}>{personText}</a>
      </div>);
    }
  }

  React.useEffect(loadData, [props.donationId]); //eslint-disable-line

  return (
    <InputBox id="donationBox" data-cy="donation-box" headerIcon="fas fa-hand-holding-usd" headerText="Edit Donation" cancelFunction={handleCancel} deleteFunction={getDeleteFunction()} saveFunction={handleSave}>
      <div className="form-group">
        <label>Person</label>
        {getPersonSection()}
      </div>
      <div className="form-group">
        <label>Date</label>
        <input type="date" className="form-control" name="date" value={DateHelper.formatHtml5Date(donation.donationDate)} onChange={handleChange} onKeyDown={handleKeyDown} />
      </div>
      <div className="form-group">
        <label>Method</label>
        <select name="method" className="form-control" value={donation.method} onChange={handleChange} onKeyDown={handleKeyDown}>
          <option value="Check">Check</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>
      </div>
      {getMethodDetails()}
      <FundDonations fundDonations={fundDonations} funds={props.funds} updatedFunction={handleFundDonationsChange} />
      <div className="form-group">
        <label>Notes</label>
        <textarea className="form-control" data-cy="note" name="notes" value={donation.notes || ""} onChange={handleChange} onKeyDown={handleKeyDown}></textarea>
      </div>
    </InputBox>
  );
}

