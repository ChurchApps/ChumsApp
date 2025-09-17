import type { PersonInterface, FundInterface, SearchCondition, DonationInterface, FundDonationInterface } from "@churchapps/helpers";
import React, { useContext } from "react";
import { memo } from "react";
import { ApiHelper, DateHelper, InputBox, Locale, PersonHelper } from "@churchapps/apphelper";
import { TableRow, TableCell, Avatar, Table, TableBody, Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ChumsPersonHelper } from "../../helpers";
import UserContext from "../../UserContext";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

interface Props {
  batchId: string,
  onAdded: () => void
}

export const BatchEntry = memo((props: Props) => {
  const [searchText, setSearchText] = React.useState("");
  const [selectedPerson, setSelectedPerson] = React.useState<PersonInterface>(null);
  const [defaultAmount, setDefaultAmount] = React.useState("$0.00");
  const [storedAmount, setStoredAmount] = React.useState("$0.00");
  const [funds, setFunds] = React.useState<FundInterface[]>([]);
  const [selectedFundId, setSelectedFundId] = React.useState("");
  const [defaultDate, setDefaultDate] = React.useState(DateHelper.toMysqlDate(DateHelper.getLastSunday()).split(' ')[0]);
  const [storedDate, setStoredDate] = React.useState(DateHelper.toMysqlDate(DateHelper.getLastSunday()).split(' ')[0]);
  const [hidden, setHidden] = React.useState("none");
  const [hiddenTwo, setHiddenTwo] = React.useState("none");
  const [hiddenThree, setHiddenThree] = React.useState("none");
  const [hiddenAlert, setHiddenAlert] = React.useState("none");
  const [defaultSet, setDefaultSet] = React.useState(false);
  const context = useContext(UserContext);

  React.useEffect(() => {
    ApiHelper.get("/funds/churchId/" + context.userChurch.church.id, "GivingApi").then((data: FundInterface[]) => {
      setFunds(data);
      if (data.length > 0) {
        setSelectedFundId(data[0].id)
      }
    });
  }, []);


  const searchResults = useQuery<PersonInterface[]>({
    queryKey: ["/people/advancedSearch", "MembershipApi", searchText],
    enabled: !!searchText,
    placeholderData: [],
    queryFn: async () => {
      if (!searchText) return [];
      const condition: SearchCondition = { field: "displayName", operator: "contains", value: searchText.trim() };
      const data: PersonInterface[] = await ApiHelper.post("/people/advancedSearch", [condition], "MembershipApi");
      return data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d));
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hiddenTwo == "block") {
      setDefaultAmount(e.currentTarget.value);
    } else if (hiddenThree == "block") {
      setStoredAmount(e.currentTarget.value);
    }
  }
  const handleFundChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent) => setSelectedFundId(e.target.value);
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.currentTarget.value);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    if (hiddenTwo == "block") {
      setDefaultDate(DateHelper.toMysqlDate(adjustedDate).split(' ')[0]);
    } else if (hiddenThree == "block") {
      setStoredDate(DateHelper.toMysqlDate(adjustedDate).split(' ')[0]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchResults.data.length > 0) setSelectedPerson(searchResults.data[0]);
      setHidden("block");
      setHiddenTwo("block");
      console.log("Person:", selectedPerson.name.display, "Amount:", defaultAmount, "Fund:", selectedFundId, "Date:", defaultDate);
    }
  };

  const handleSaveClick = async () => {
    console.log("Clicked Save!");
    setHidden("none");
    setHiddenTwo("none");
    setHiddenAlert("block");
    if (!defaultSet) {
      setToDefaults();
    }
    const donation: DonationInterface = {
      batchId: props.batchId, amount: 100,
      personId: selectedPerson.id,
      donationDate: new Date(defaultDate),
      method: "check",
      methodDetails: "123",
      notes: ""
    }
    const results = await ApiHelper.post("/donations", [donation], "GivingApi");
    const fundDonation: FundDonationInterface = {
      donationId: results[0].id,
      fundId: selectedFundId,
      amount: 100
    }
    await ApiHelper.post("/fundDonations", [fundDonation], "GivingApi");
    props.onAdded();
  }

  const handleEditClick = () => {
    setHiddenThree("block");
    setHiddenTwo("none");
  }

  const handleCancelClick = () => {
    console.log("Clicked Cancel!");
    if (!defaultSet) {
      setToDefaults();
      setHidden("none");
      setHiddenTwo("none");
      setSelectedPerson(null);
      setSearchText("");
    } else {
      setHidden("none");
      setHiddenTwo("none");
      setSelectedPerson(null);
      setSearchText("");
      setDefaultAmount(storedAmount);
      setDefaultDate(storedDate);
    }
  }

  const handleEditSave = () => {
    console.log("Saved Edits!");
    setHiddenTwo("block");
    setHiddenThree("none");
    setDefaultSet(true);
    setDefaultAmount(storedAmount);
    setDefaultDate(storedDate);
  }

  const setToDefaults = () => {
    console.log("Restoring Defaults!");
    setDefaultSet(false);
    setDefaultAmount("$0.00");
    setStoredAmount("$0.00");
    setDefaultDate(DateHelper.toMysqlDate(DateHelper.getLastSunday()).split(' ')[0]);
    setStoredDate(DateHelper.toMysqlDate(DateHelper.getLastSunday()).split(' ')[0]);
  }

  const handleEditCancel = () => {
    console.log("Canceled Edits!");
    setHiddenTwo("block");
    setHiddenThree("none");
    if (!defaultSet) {
      setToDefaults();
    } else {
      setDefaultAmount(storedAmount);
      setDefaultDate(storedDate);
    }
  }

  const getPeopleTable = () => {
    const rows = [];
    for (let i = 0; i < searchResults.data.length; i++) {
      const sr = searchResults.data[i];

      rows.push(
        <TableRow key={sr.id}>
          <TableCell>
            <Avatar src={PersonHelper.getPhotoUrl(sr)} sx={{ width: 48, height: 48 }} />
          </TableCell>
          <TableCell>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); setSelectedPerson(sr) }}>{sr.name.display}</a>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <Table size="small" id="householdMemberAddTable">
        <TableBody>{rows}</TableBody>
      </Table>
    );
  }

  const getFundOptions = () => {
    const options = [];
    for (let i = 0; i < funds.length; i++) {
      options.push(<MenuItem key={i} value={funds[i].id}>{funds[i].name}</MenuItem>);
    }
    return options;
  };

  return <>
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: hiddenAlert }}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" onClose={() => { setHiddenAlert("none"); }}>
          Batch Saved!
        </Alert>
      </Box>
      <Box sx={{ mb: 3 }} />
      <InputBox
        id="batchBox"
        headerIcon="volunteer_activism"
        headerText="Search Donor Name">
        <TextField
          fullWidth
          data-cy="batch-search"
          name="searchText"
          label="Name"
          autoFocus
          value={searchText}
          onChange={handleChange}
          onKeyDown={handleKeyPress}>
        </TextField>
        {getPeopleTable()}
      </InputBox>
    </Box>

    <Box sx={{ px: 3, display: hidden }}>
      <InputBox
        id="batchBox"
        headerIcon="volunteer_activism"
        headerText={Locale.label("common.edit")}
        help="chums/manual-input">
        <Typography variant="h1" display={hiddenTwo}><b>Donor: {selectedPerson?.name?.display?.toString()}</b></Typography>
        <TextField
          fullWidth
          data-cy="batch-amount"
          name="amount"
          value={defaultAmount}
          onChange={handleAmountChange}
          InputLabelProps={{ shrink: true }}
          label="Amount"
          style={{ display: hiddenTwo }}
        />

        <FormControl fullWidth>
          <InputLabel id="fund" style={{ display: hiddenTwo }}>Fund</InputLabel>
          <Select
            name="fund"
            label="Fund"
            value={selectedFundId}
            onChange={handleFundChange}
            aria-label="Select Fund"
            style={{ display: hiddenTwo }}>
            {getFundOptions()}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="date"
          data-cy="batch-date"
          name="date"
          value={defaultDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          label={Locale.label("donations.batchEdit.date")}
          style={{ display: hiddenTwo }}
        />



        <Typography variant="h1" display={hiddenThree}><b>Editing Batch Defaults</b></Typography>
        <TextField
          fullWidth
          data-cy="batch-amount"
          name="amount"
          value={storedAmount}
          onChange={handleAmountChange}
          InputLabelProps={{ shrink: true }}
          label="Amount"
          style={{ display: hiddenThree }}
        />

        <FormControl fullWidth>
          <InputLabel id="fund" style={{ display: hiddenThree }}>Fund</InputLabel>
          <Select
            name="fund"
            label="Fund"
            value={selectedFundId}
            onChange={handleFundChange}
            aria-label="Select Fund"
            style={{ display: hiddenThree }}>
            {getFundOptions()}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="date"
          data-cy="batch-date"
          name="date"
          value={storedDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          label={Locale.label("donations.batchEdit.date")}
          style={{ display: hiddenThree }}
        />
        <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button variant="contained" onClick={handleSaveClick} style={{ display: hiddenTwo }}>Save Batch</Button>
          <Button color="primary" onClick={handleEditClick} style={{ display: hiddenTwo }}>Edit Batch Defaults</Button>
          <Button color="error" onClick={handleCancelClick} style={{ display: hiddenTwo }}>Cancel Batch</Button>


          <Button variant="contained" onClick={handleEditSave} style={{ display: hiddenThree }}>Save Default Edits</Button>
          <Button color="warning" onClick={setToDefaults} style={{ display: hiddenThree }}>Set To Original Values</Button>
          <Button color="error" onClick={handleEditCancel} style={{ display: hiddenThree }}>Cancel Default Editing</Button>
        </Box>
      </InputBox>
    </Box>
  </>

});