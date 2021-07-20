import React from "react";
import { FundDonationInterface, FundDonation, FundInterface } from ".";

interface Props { fundDonations: FundDonationInterface[], funds: FundInterface[], updatedFunction: (fundDonations: FundDonationInterface[]) => void }

export const FundDonations: React.FC<Props> = (props) => {
  const handleUpdated = (fundDonation: FundDonationInterface, index: number) => {
    let fundDonations = [...props.fundDonations];
    fundDonations[index] = fundDonation;
    props.updatedFunction(fundDonations);
  }

  const addRow = (e: React.MouseEvent) => {
    e.preventDefault();
    let fundDonations = [...props.fundDonations];
    let fd = { fundId: props.funds[0].id } as FundDonationInterface;
    fundDonations.push(fd);
    props.updatedFunction(fundDonations);
  }

  const getRows = () => {
    let result = [];
    for (let i = 0; i < props.fundDonations.length; i++) {
      let fd = props.fundDonations[i];
      result.push(<FundDonation fundDonation={fd} funds={props.funds} updatedFunction={handleUpdated} key={i} index={i} />)
    }

    return result;
  }

  return (
    <>
      {getRows()}
      <a href="about:blank" data-cy="add-fund-donation" style={{ display: "block", marginBottom: "15px" }} onClick={addRow}>Add more</a>
    </>
  );
}

