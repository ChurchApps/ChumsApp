import React from "react";
import { FundDonationInterface, FundDonation, FundInterface } from ".";

interface Props { fundDonations: FundDonationInterface[], funds: FundInterface[], updatedFunction: (fundDonations: FundDonationInterface[]) => void }

export const FundDonations: React.FC<Props> = (props) => {
    const handleUpdated = (fundDonation: FundDonationInterface, index: number) => {
        var fundDonations = [...props.fundDonations];
        fundDonations[index] = fundDonation;
        props.updatedFunction(fundDonations);
    }

    const addRow = (e: React.MouseEvent) => {
        e.preventDefault();
        var fundDonations = [...props.fundDonations];
        var fd = { fundId: props.funds[0].id } as FundDonationInterface;
        fundDonations.push(fd);
        props.updatedFunction(fundDonations);
    }

    const getRows = () => {
        var result = [];
        for (let i = 0; i < props.fundDonations.length; i++) {
            var fd = props.fundDonations[i];
            result.push(<FundDonation fundDonation={fd} funds={props.funds} updatedFunction={handleUpdated} key={i} index={i} />)
        }

        return result;
    }

    return (
        <>
            {getRows()}
            <a href="about:blank" style={{ display: "block", marginTop: "-15px", marginBottom: "15px" }} onClick={addRow}>Add more</a>
        </>
    );
}

