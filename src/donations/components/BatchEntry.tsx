import type { PersonInterface, FundInterface, SearchCondition } from "@churchapps/helpers";
import React, { useContext } from "react";
import { memo } from "react";
import { ApiHelper, DateHelper, InputBox, Locale, PersonHelper } from "@churchapps/apphelper";
import { TableRow, TableCell, Avatar, Table, TableBody, Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ChumsPersonHelper } from "../../helpers";
import UserContext from "../../UserContext";

interface Props {

}

export const BatchEntry = memo((props: Props) => {
  const [searchText, setSearchText] = React.useState("");
  const [selectedPerson, setSelectedPerson] = React.useState<PersonInterface>(null);
  const [defaultAmount, setDefaultAmount] = React.useState("$0.00");
  const [funds, setFunds] = React.useState<FundInterface[]>([]);
  const [selectedFundId, setSelectedFundId] = React.useState("");
  const [defaultDate, setDefaultDate] = React.useState(DateHelper.toMysqlDate(DateHelper.getLastSunday()).split(' ')[0]);
  const [hidden, setHidden] = React.useState("none");
  const context = useContext(UserContext);

  React.useEffect(() => {
    ApiHelper.get("/funds/churchId/" + context.userChurch.church.id, "GivingApi").then((data: FundInterface[]) => {
      setFunds(data);
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
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setDefaultAmount(e.currentTarget.value);
  const handleFundChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent) => setSelectedFundId(e.target.value);
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.currentTarget.value);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    setDefaultDate(DateHelper.toMysqlDate(adjustedDate).split(' ')[0]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchResults.data.length > 0) setSelectedPerson(searchResults.data[0]);
      if (selectedPerson) {
        setHidden("block");
      }
      console.log("Person:", selectedPerson.name.display, "Amount:", defaultAmount, "Fund:", "Date:", defaultDate);
    }
  };

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
      <InputBox
        id="batchBox"
        headerIcon="volunteer_activism"
        headerText={Locale.label("common.search")}>
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
        <Typography variant="h1"><b>Donor: {selectedPerson?.name?.display?.toString()}</b></Typography>
        <TextField
          fullWidth
          data-cy="batch-amount"
          name="amount"
          value={defaultAmount}
          onChange={handleAmountChange}
          InputLabelProps={{ shrink: true }}
          label="Amount"
        />

        <FormControl fullWidth>
          <InputLabel id="fund">Fund</InputLabel>
          <Select
            name="fund"
            label="Fund"
            value={selectedFundId}
            onChange={handleFundChange}
            aria-label="Select Fund">
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
        />
        <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button variant="contained">Save</Button>
          <Button color="error">Cancel</Button>
        </Box>
      </InputBox>
    </Box>
  </>

});