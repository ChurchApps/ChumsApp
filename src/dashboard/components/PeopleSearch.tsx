import React from "react";
import { Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { ApiHelper, ChumsPersonHelper, DisplayBox, PersonInterface, SearchCondition } from "../components";
import { PeopleSearchResults } from "../../people/components";

export const PeopleSearch = () => {
  const [searchResults, setSearchResults] = React.useState(null);
  const [searchText, setSearchText] = React.useState("");
  const selectedColumns = ["photo", "displayName"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = searchText.trim();
    const condition: SearchCondition = { field: "displayName", operator: "contains", value: term }
    ApiHelper.post("/people/advancedSearch", [condition], "MembershipApi").then(data => {
      setSearchResults(data.map((d: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(d)))
    });
  }

  const columns = [
    { key: "photo", label: "Photo", shortName: "" },
    { key: "displayName", label: "Display Name", shortName: "Name" }
  ];

  return (<>
    <DisplayBox id="peopleBox" headerIcon="person" headerText="People">
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="searchText">Name</InputLabel>
        <OutlinedInput id="searchText" aria-label="searchBox" name="searchText" type="text" label="Name" value={searchText} onChange={handleChange}
          endAdornment={<Button variant="contained" onClick={handleSubmit}>Search</Button>}
        />
      </FormControl>
      {searchResults && <PeopleSearchResults people={searchResults} columns={columns} selectedColumns={selectedColumns} />}
    </DisplayBox>
  </>);
}
