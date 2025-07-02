import React from "react";
import { ArrayHelper, ApiHelper, UserHelper, type DonationInterface, DateHelper, CurrencyHelper, type DonationBatchInterface, ExportLink, Permissions, UniqueIdHelper, type FundInterface, Loading, Locale } from "@churchapps/apphelper";
import { Table, TableBody, TableCell, TableRow, TableHead, Typography, Stack, Icon, Button, Box } from "@mui/material";
import { Edit as EditIcon, Person as PersonIcon, CalendarMonth as DateIcon, AttachMoney as MoneyIcon, FileDownload as ExportIcon, VolunteerActivism as DonationIcon } from "@mui/icons-material";

interface Props { batch: DonationBatchInterface, funds: FundInterface[], editFunction: (id: string) => void }

export const Donations: React.FC<Props> = (props) => {
  const { batch, funds, editFunction } = props;
  const [donations, setDonations] = React.useState<DonationInterface[]>(null);

  // Memoize permission check to avoid repeated calls
  const canEdit = React.useMemo(() => UserHelper.checkAccess(Permissions.givingApi.donations.edit), []);

  const populatePeople = React.useCallback(async (data: DonationInterface[]) => {
    const peopleIds = ArrayHelper.getIds(data, "personId");
    if (peopleIds.length > 0) {
      const people = await ApiHelper.get("/people/ids?ids=" + escape(peopleIds.join(",")), "MembershipApi");
      data.forEach(d => { if (!UniqueIdHelper.isMissing(d.personId)) d.person = ArrayHelper.getOne(people, "id", d.personId); });
    }
    setDonations(data);
  }, []);
  
  const loadData = React.useCallback(() => { ApiHelper.get("/donations?batchId=" + batch?.id, "GivingApi").then(data => populatePeople(data)); }, [batch, populatePeople]);
  
  const getHeaderActions = React.useCallback(() => {
    if (funds.length === 0 || !donations) return null;
    return (
      <Button
        size="small"
        variant="outlined"
        startIcon={<ExportIcon />}
        component={ExportLink}
        data={donations}
        filename="donations.csv"
      >
        Export
      </Button>
    );
  }, [funds.length, donations]);

  const showEditDonation = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const button = e.currentTarget as HTMLButtonElement;
    const id = button.getAttribute("data-id");
    editFunction(id);
  }, [editFunction]);

  // Memoize the total calculation to avoid recalculating on every render
  const donationsTotal = React.useMemo(() => {
    if (!donations || donations.length === 0) return 0;
    return donations.reduce((sum, donation) => sum + donation.amount, 0);
  }, [donations]);

  const getTableHeader = React.useCallback(() => {
    if (props.funds.length === 0 || !donations || donations.length === 0) {
      return null;
    }

    return (
      <TableHead 
        sx={{ 
          backgroundColor: 'grey.50',
          '& .MuiTableCell-root': {
            borderBottom: '2px solid',
            borderBottomColor: 'divider'
          }
        }}
      >
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {Locale.label("donations.donations.tableIdent")}
            </Typography>
          </TableCell>
          <TableCell sx={{ fontWeight: 600 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {Locale.label("common.name")}
            </Typography>
          </TableCell>
          <TableCell sx={{ fontWeight: 600 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {Locale.label("donations.donations.date")}
            </Typography>
          </TableCell>
          <TableCell sx={{ fontWeight: 600 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {Locale.label("donations.donations.amt")}
            </Typography>
          </TableCell>
          {canEdit && (
            <TableCell sx={{ fontWeight: 600 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {Locale.label("common.edit")}
              </Typography>
            </TableCell>
          )}
        </TableRow>
      </TableHead>
    );
  }, [donations, props.funds.length, canEdit]);

  const getRows = React.useCallback(() => {
    const rows: React.ReactNode[] = [];
    
    if (props.funds.length === 0) {
      rows.push(
        <TableRow key="0">
          <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
            <Stack spacing={2} alignItems="center">
              <DonationIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary" data-cy="error-message">
                {Locale.label("donations.donations.errMsg")}
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
      return rows;
    }
    
    if (!donations || donations.length === 0) {
      rows.push(
        <TableRow key="0">
          <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
            <Stack spacing={2} alignItems="center">
              <DonationIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                {Locale.label("donations.donations.noDonMsg")}
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
      return rows;
    }
    
    // Add donation rows
    for (let i = 0; i < donations.length; i++) {
      const d = donations[i];
      const editButton = canEdit ? (
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon />}
          data-cy={`edit-link-${i}`}
          data-id={d.id}
          onClick={showEditDonation}
          sx={{ minWidth: 'auto' }}
        >
          Edit
        </Button>
      ) : null;
      
      rows.push(
        <TableRow 
          key={i}
          sx={{ 
            '&:hover': { backgroundColor: 'action.hover' },
            transition: 'background-color 0.2s ease'
          }}
        >
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <Icon sx={{ color: 'var(--c1l2)', fontSize: 20 }}>receipt</Icon>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                {d.id}
              </Typography>
            </Stack>
          </TableCell>
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2">
                {d.person?.name.display || Locale.label("donations.donations.anon")}
              </Typography>
            </Stack>
          </TableCell>
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <DateIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2">
                {DateHelper.prettyDate(new Date(d.donationDate))}
              </Typography>
            </Stack>
          </TableCell>
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <MoneyIcon sx={{ color: 'success.main', fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                {CurrencyHelper.formatCurrency(d.amount)}
              </Typography>
            </Stack>
          </TableCell>
          {canEdit && <TableCell>{editButton}</TableCell>}
        </TableRow>
      );
    }
    
    // Add total row
    rows.push(
      <TableRow key="total" sx={{ borderTop: 2, backgroundColor: 'grey.50' }}>
        <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Icon sx={{ color: 'var(--c1l2)', fontSize: 20 }}>calculate</Icon>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {Locale.label("donations.donations.total")}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <MoneyIcon sx={{ color: 'success.main', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'success.main' }}>
              {CurrencyHelper.formatCurrency(donationsTotal)}
            </Typography>
          </Stack>
        </TableCell>
        {canEdit && <TableCell></TableCell>}
      </TableRow>
    );
    
    return rows;
  }, [donations, props.funds.length, canEdit, showEditDonation, donationsTotal]);

  React.useEffect(() => { if (!UniqueIdHelper.isMissing(props.batch?.id)) loadData() }, [props.batch, loadData]);

  // Memoize the table content to avoid recreating when dependencies haven't changed
  const tableContent = React.useMemo(() => {
    if (!donations) return <Loading />;
    
    return (
      <>
        {/* Header with actions */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <DonationIcon />
              <Typography variant="h6">
                {Locale.label("donations.donations.don")}
              </Typography>
            </Stack>
            {getHeaderActions()}
          </Stack>
        </Box>
        
        {/* Table */}
        <Table sx={{ minWidth: 650 }}>
          {getTableHeader()}
          <TableBody>
            {getRows()}
          </TableBody>
        </Table>
      </>
    );
  }, [donations, getRows, getTableHeader, getHeaderActions]);

  return tableContent;
}

