import React from "react";
import { Button, FormControl, Grid, Icon, InputLabel, OutlinedInput } from "@mui/material";
import { TaskList } from "../tasks/components/TaskList";
import { ApiHelper, ChumsPersonHelper, DisplayBox, PersonInterface, SearchCondition } from "../components";
import { PeopleSearchResults } from "../people/components";

export const DashboardPage = () => {
  const [searchResults, setSearchResults] = React.useState(null);
  const [searchText, setSearchText] = React.useState("");
  const selectedColumns = ["photo", "displayName"];
  const columns = [
    { key: "photo", label: "Photo", shortName: "" },
    { key: "displayName", label: "Display Name", shortName: "Name" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = searchText.trim();
    const condition: SearchCondition = { field: "displayName", operator: "contains", value: term }
    ApiHelper.post("/people/advancedSearch", [condition], "MembershipApi").then(data => {
      setSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)))
    });
  }

  return (<>
    <h1><Icon>home</Icon> Chums Dashboard</h1>
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        <DisplayBox id="peopleBox" headerIcon="person" headerText="People">
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="searchText">Name</InputLabel>
            <OutlinedInput id="searchText" aria-label="searchBox" name="searchText" type="text" label="Name" value={searchText} onChange={handleChange}
              endAdornment={<Button variant="contained" onClick={handleSubmit}>Search</Button>}
            />
          </FormControl>
          {searchResults && <PeopleSearchResults people={searchResults} columns={columns} selectedColumns={selectedColumns} />}
        </DisplayBox>
      </Grid>
      <Grid item md={4} xs={12}>
        <TaskList compact={true} />
      </Grid>
    </Grid>
  </>);
}
