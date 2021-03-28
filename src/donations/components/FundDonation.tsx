import React from "react";
import { FundDonationInterface, FundInterface } from ".";
import { Row, Col, FormGroup, FormControl, FormLabel } from "react-bootstrap";

interface Props {
    fundDonation: FundDonationInterface,
    funds: FundInterface[],
    index: number,
    updatedFunction: (fundDonation: FundDonationInterface, index: number) => void
}

export const FundDonation: React.FC<Props> = (props) => {

    const getOptions = () => {
        var result = [];
        for (let i = 0; i < props.funds.length; i++) result.push(<option key={i} value={props.funds[i].id}>{props.funds[i].name}</option>);
        return result;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        var fd = { ...props.fundDonation }
        switch (e.target.name) {
            case "amount":
                fd.amount = parseFloat(e.target.value.replace("$", "").replace(",", ""));
                break;
            case "fund":
                fd.fundId = e.target.value;
                break;
        }
        props.updatedFunction(fd, props.index);
    }

    return (
        <Row>
            <Col>
                <FormGroup>
                    <FormLabel>Amount</FormLabel>
                    <FormControl name="amount" type="number" data-cy="amount" lang="en-150" min="0.00" step="0.01" value={props.fundDonation.amount} onChange={handleChange} />
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                    <FormLabel>Fund</FormLabel>
                    <FormControl as="select" name="fund" value={props.fundDonation.fundId} onChange={handleChange}>{getOptions()}</FormControl>
                </FormGroup>
            </Col>
        </Row>
    );
}

