import React from "react";
import { ApiHelper, type DonationBatchInterface, DateHelper, UserHelper, type FundDonationInterface, ExportLink, Permissions, UniqueIdHelper, type PersonInterface, ArrayHelper, Loading, CurrencyHelper, Locale } from "@churchapps/apphelper";
import { useParams, Link } from "react-router-dom";
import { Table, TableBody, TableRow, TableCell, TableHead, TextField, Box, Typography, Card, Stack, Button } from "@mui/material"
import { VolunteerActivism as FundIcon, FileDownload as ExportIcon, FilterAlt as FilterIcon, CalendarMonth as DateIcon, Person as PersonIcon, Receipt as ReceiptIcon, AttachMoney as MoneyIcon } from "@mui/icons-material";

export const FundPage = () => {
  const params = useParams();
  const initialDate = new Date();
  initialDate.setDate(initialDate.getDate() - 7);

  const [fund, setFund] = React.useState<DonationBatchInterface>({});
  const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>(null);
  const [startDate, setStartDate] = React.useState<Date>(initialDate);
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [people, setPeople] = React.useState<{ [key: string]: string }>({});
  const [stats, setStats] = React.useState({
    totalDonations: 0,
    totalAmount: 0,
    uniqueDonors: 0
  });


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
        setFundDonations(d);
        
        // Calculate statistics
        const totalDonations = d.length;
        const totalAmount = d.reduce((sum, fd) => sum + (fd.amount || 0), 0);
        const uniqueDonors = new Set(d.map(fd => fd.donation?.personId).filter(id => id)).size;
        
        setStats({
          totalDonations,
          totalAmount,
          uniqueDonors
        });
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
    const result: JSX.Element[] = [];

    if (fundDonations.length === 0) {
      result.push(
        <TableRow key="0">
          <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
            <Stack spacing={2} alignItems="center">
              <FundIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                {Locale.label("donations.fundsPage.noDon")}
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
      return result;
    }

    for (let i = 0; i < fundDonations.length; i++) {
      const fd = fundDonations[i];
      const isAnonymous = UniqueIdHelper.isMissing(fd.donation?.personId);
      
      const personCol = isAnonymous ? (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              {Locale.label("donations.fundsPage.anon")}
            </Typography>
          </Stack>
        </TableCell>
      ) : (
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonIcon sx={{ color: 'var(--c1l2)', fontSize: 18 }} />
            <Link 
              to={"/people/" + fd.donation?.personId}
              style={{ 
                textDecoration: 'none', 
                color: 'var(--c1l2)', 
                fontWeight: 500 
              }}
            >
              {people[fd.donation.personId] || Locale.label("donations.fundsPage.anon")}
            </Link>
          </Stack>
        </TableCell>
      );
      
      result.push(
        <TableRow 
          key={i}
          sx={{ 
            '&:hover': { backgroundColor: 'action.hover' },
            transition: 'background-color 0.2s ease'
          }}
        >
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <DateIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2">
                {DateHelper.formatHtml5Date(fd.donation.donationDate)}
              </Typography>
            </Stack>
          </TableCell>
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <ReceiptIcon sx={{ color: 'var(--c1l2)', fontSize: 18 }} />
              <Link 
                data-cy={`batchId-${fd.donation.batchId}-${i}`} 
                to={"/donations/" + fd.donation.batchId}
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--c1l2)', 
                  fontWeight: 500 
                }}
              >
                {fd.donation.batchId}
              </Link>
            </Stack>
          </TableCell>
          {personCol}
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <MoneyIcon sx={{ color: 'success.main', fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                {CurrencyHelper.formatCurrency(fd.amount)}
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
    }
    return result;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];

    if (fundDonations.length === 0) {
      return rows;
    }

    rows.push(
      <TableRow key="header">
        <TableCell sx={{ fontWeight: 600 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {Locale.label("donations.fundsPage.date")}
          </Typography>
        </TableCell>
        <TableCell sx={{ fontWeight: 600 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {Locale.label("donations.fundsPage.batch")}
          </Typography>
        </TableCell>
        <TableCell sx={{ fontWeight: 600 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {Locale.label("donations.fundsPage.donor")}
          </Typography>
        </TableCell>
        <TableCell sx={{ fontWeight: 600 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {Locale.label("donations.fundsPage.amt")}
          </Typography>
        </TableCell>
      </TableRow>
    );
    return rows;
  }

  React.useEffect(loadData, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const getTable = () => {
    if (!fundDonations) return <Loading />;
    return (
      <Table sx={{ minWidth: 650 }}>
        <TableHead 
          sx={{ 
            backgroundColor: 'grey.50',
            '& .MuiTableCell-root': {
              borderBottom: '2px solid',
              borderBottomColor: 'divider'
            }
          }}
        >
          {getTableHeader()}
        </TableHead>
        <TableBody>
          {getRows()}
        </TableBody>
      </Table>
    );
  }

  if (!UserHelper.checkAccess(Permissions.givingApi.donations.view)) return (<></>);
  
  return (
    <>
      {/* Modern Blue Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={{ xs: 2, md: 4 }} 
          alignItems={{ xs: "flex-start", md: "center" }} 
          sx={{ width: "100%" }}
        >
          {/* Left side: Title and Icon */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '12px', 
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FundIcon sx={{ fontSize: 32, color: '#FFF' }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  fontSize: { xs: '1.75rem', md: '2.125rem' }
                }}
              >
                {fund.name} {Locale.label("donations.fundsPage.don")}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Track donations and contributions to this fund
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Statistics Row */}
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={3} 
          flexWrap="wrap" 
          useFlexGap
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <ReceiptIcon sx={{ color: "#FFF", fontSize: 20 }} />
            <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
              {stats.totalDonations}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}
            >
              Total Donations
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonIcon sx={{ color: "#FFF", fontSize: 20 }} />
            <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
              {stats.uniqueDonors}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}
            >
              Unique Donors
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <MoneyIcon sx={{ color: "#FFF", fontSize: 20 }} />
            <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 600, mr: 1 }}>
              {CurrencyHelper.formatCurrency(stats.totalAmount)}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}
            >
              Total Amount
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Date Filter Card */}
        <Card sx={{ mb: 3 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterIcon />
              <Typography variant="h6">
                {Locale.label("donations.fundsPage.donFilt")}
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField 
                label={Locale.label("donations.fundsPage.dateStart")} 
                name="startDate" 
                type="date" 
                data-cy="start-date" 
                value={DateHelper.formatHtml5Date(startDate)} 
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <TextField 
                label={Locale.label("donations.fundsPage.dateEnd")} 
                name="endDate" 
                type="date" 
                data-cy="end-date" 
                value={DateHelper.formatHtml5Date(endDate)} 
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <Button
                variant="contained"
                onClick={loadDonations}
                startIcon={<FilterIcon />}
                sx={{ minWidth: 120 }}
              >
                Filter
              </Button>
            </Stack>
          </Box>
        </Card>
        
        {/* Main donations table */}
        <Card>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <FundIcon />
                <Typography variant="h6">
                  {Locale.label("donations.fundsPage.don")}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                {fundDonations && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ExportIcon />}
                    component={ExportLink}
                    data={fundDonations}
                    filename="funddonations.csv"
                    sx={{ mr: 1 }}
                  >
                    Export
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
          <Box>
            {getTable()}
          </Box>
        </Card>
      </Box>
    </>
  );
}
