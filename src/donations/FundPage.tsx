import React from "react";
import { ApiHelper, DisplayBox, InputBox, DonationBatchInterface, DateHelper, UserHelper, FundDonationInterface, ExportLink, Permissions, UniqueIdHelper, PersonInterface, ArrayHelper, Loading, CurrencyHelper } from "./components";
import { useParams, Link } from "react-router-dom";
import { FormGroup, FormControl, FormLabel, Table } from "react-bootstrap";
import { Wrapper } from "../components/Wrapper";
import { Grid } from "@mui/material"

export const FundPage = () => {
  const params = useParams();
  let initialDate = new Date();
  initialDate.setDate(initialDate.getDate() - 7);

  const [fund, setFund] = React.useState<DonationBatchInterface>({});
  const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>(null);
  const [startDate, setStartDate] = React.useState<Date>(initialDate);
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [people, setPeople] = React.useState<{ [key: string]: string }>({});

  const getEditContent = () => (<ExportLink data={fundDonations} spaceAfter={true} filename="funddonations.csv" />)

  const loadData = () => {
    ApiHelper.get("/funds/" + params.id, "GivingApi").then(data => { setFund(data) });
    loadDonations();
  }

  const loadDonations = () => {
    ApiHelper.get("/funddonations?fundId=" + params.id + "&startDate=" + DateHelper.formatHtml5Date(startDate) + "&endDate=" + DateHelper.formatHtml5Date(endDate), "GivingApi")
      .then((d: FundDonationInterface[]) => {
        // fetch people who have made donations if any
        const peopleIds = ArrayHelper.getUniqueValues(d, "donation.personId").filter(f => f !== null);
        if (peopleIds.length > 0) {
          ApiHelper.get("/people/ids?ids=" + peopleIds.join(","), "MembershipApi")
            .then((people: PersonInterface[]) => {
              const data: any = {};
              people.forEach((p) => {
                data[p.id] = p.name?.display;
              })

              setPeople(data);
            });
        }
        setFundDonations(d)
      });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "startDate":
        setStartDate(new Date(e.target.value));
        break;
      case "endDate":
        setEndDate(new Date(e.target.value));
        break;
    }
  }

  const getRows = () => {
    let result: JSX.Element[] = [];

    if (fundDonations.length === 0) {
      result.push(<tr key="0">No donations yet</tr>);
      return result;
    }

    for (let i = 0; i < fundDonations.length; i++) {
      let fd = fundDonations[i];
      let personCol = (UniqueIdHelper.isMissing(fd.donation?.personId))
        ? (<td>Anonymous</td>)
        : (<td><Link to={"/people/" + fd.donation?.personId}>{people[fd.donation.personId] || "Anonymous"}</Link></td>);
      result.push(<tr key={i}>
        <td>{DateHelper.formatHtml5Date(fd.donation.donationDate)}</td>
        <td><Link data-cy={`batchId-${fd.donation.batchId}-${i}`} to={"/donations/" + fd.donation.batchId}>{fd.donation.batchId}</Link></td>
        {personCol}
        <td>{CurrencyHelper.formatCurrency(fd.amount)}</td>
      </tr>);

    }
    return result;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];

    if (fundDonations.length === 0) {
      return rows;
    }

    rows.push(<tr key="header"><th>Date</th><th>Batch</th><th>Donor</th><th>Amount</th></tr>);
    return rows;
  }

  React.useEffect(loadData, [params.id]); //eslint-disable-line

  if (!UserHelper.checkAccess(Permissions.givingApi.donations.view)) return (<></>);
  else {
    let contents = <Loading />
    if (fundDonations) {
      contents = (<Table>
        <thead>{getTableHeader()}</thead>
        <tbody>{getRows()}</tbody>
      </Table>);
    }

    return (
      <Wrapper pageTitle={fund.name + " Donations"}>
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <DisplayBox headerIcon="volunteer_activism" headerText="Donations" editContent={getEditContent()}>
              {contents}
            </DisplayBox>
          </Grid>
          <Grid item md={4} xs={12}>
            <InputBox headerIcon="filter_alt" headerText="Donation Filter" saveFunction={loadDonations} saveText="Filter">
              <FormGroup>
                <FormLabel>Start Date</FormLabel>
                <FormControl name="startDate" type="date" data-cy="start-date" value={DateHelper.formatHtml5Date(startDate)} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <FormLabel>End Date</FormLabel>
                <FormControl name="endDate" type="date" data-cy="end-date" value={DateHelper.formatHtml5Date(endDate)} onChange={handleChange} />
              </FormGroup>
            </InputBox>
          </Grid>
        </Grid>
      </Wrapper>
    );
  }

}

