import React from "react";
import { ApiHelper, DisplayBox, InputBox, DonationBatchInterface, DateHelper, UserHelper, FundDonationInterface, ExportLink, Permissions, UniqueIdHelper, PersonInterface, ArrayHelper, Loading, CurrencyHelper, Locale } from "@churchapps/apphelper";
import { useParams, Link } from "react-router-dom";
import { Table, TableBody, TableRow, TableCell, TableHead, Grid, TextField, Icon } from "@mui/material"

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
      result.push(<TableRow key="0"><TableCell>{Locale.label("donations.fundsPage.noDon")}</TableCell></TableRow>);
      return result;
    }

    for (let i = 0; i < fundDonations.length; i++) {
      let fd = fundDonations[i];
      let personCol = (UniqueIdHelper.isMissing(fd.donation?.personId))
        ? (<TableCell>{Locale.label("donations.fundsPage.anon")}</TableCell>)
        : (<TableCell><Link to={"/people/" + fd.donation?.personId}>{people[fd.donation.personId] || Locale.label("donations.fundsPage.anon")}</Link></TableCell>);
      result.push(<TableRow key={i}>
        <TableCell>{DateHelper.formatHtml5Date(fd.donation.donationDate)}</TableCell>
        <TableCell><Link data-cy={`batchId-${fd.donation.batchId}-${i}`} to={"/donations/" + fd.donation.batchId}>{fd.donation.batchId}</Link></TableCell>
        {personCol}
        <TableCell>{CurrencyHelper.formatCurrency(fd.amount)}</TableCell>
      </TableRow>);

    }
    return result;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];

    if (fundDonations.length === 0) {
      return rows;
    }

    rows.push(<TableRow key="header"><th>{Locale.label("donations.fundsPage.date")}</th><th>{Locale.label("donations.fundsPage.batch")}</th><th>{Locale.label("donations.fundsPage.donor")}</th><th>{Locale.label("donations.fundsPage.amt")}</th></TableRow>);
    return rows;
  }

  React.useEffect(loadData, [params.id]); //eslint-disable-line

  if (!UserHelper.checkAccess(Permissions.givingApi.donations.view)) return (<></>);
  else {
    let contents = <Loading />
    if (fundDonations) {
      contents = (<Table>
        <TableHead>{getTableHeader()}</TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>);
    }

    return (
      <>
        <h1><Icon>volunteer_activism</Icon> {fund.name} {Locale.label("donations.fundsPage.don")}</h1>
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <DisplayBox headerIcon="volunteer_activism" headerText={Locale.label("donations.fundsPage.don")} editContent={getEditContent()} help="chums/giving">
              {contents}
            </DisplayBox>
          </Grid>
          <Grid item md={4} xs={12}>
            <InputBox headerIcon="filter_alt" headerText={Locale.label("donations.fundsPage.donFilt")} saveFunction={loadDonations} saveText="Filter">
              <TextField fullWidth label={Locale.label("donations.fundsPage.dateStart")} name="startDate" type="date" data-cy="start-date" value={DateHelper.formatHtml5Date(startDate)} onChange={handleChange} />
              <TextField fullWidth label={Locale.label("donations.fundsPage.dateEnd")} name="endDate" type="date" data-cy="end-date" value={DateHelper.formatHtml5Date(endDate)} onChange={handleChange} />
            </InputBox>
          </Grid>
        </Grid>
      </>
    );
  }
}
