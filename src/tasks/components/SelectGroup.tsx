import React, { useState } from "react";
import { ApiHelper, GroupInterface } from "../../helpers";
import { TextField, Button, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { SmallButton } from "../../appBase/components";

interface Props {
  addFunction: (group: GroupInterface) => void,
}

export const SelectGroup: React.FC<Props> = (props: Props) => {
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [searchResults, setSearchResults] = useState<GroupInterface[]>([]);
  const [searchText, setSearchText] = useState("");

  const loadData = () => { ApiHelper.get("/groups", "MembershipApi").then((data) => { setGroups(data); }); };
  React.useEffect(loadData, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { e.preventDefault(); setSearchText(e.currentTarget.value); }
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(null); } }

  const handleSearch = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = searchText.trim().toLowerCase();
    let result: GroupInterface[] = [];
    groups.forEach(g => {
      if (g.name.toLowerCase().indexOf(term) > -1) result.push(g);
    })
    setSearchResults(result);
  }
  const handleAdd = (group: GroupInterface) => {
    props.addFunction(group);
  }

  let rows = [];
  for (let i = 0; i < searchResults.length; i++) {
    const sr = searchResults[i];

    rows.push(
      <TableRow key={sr.id}>
        <TableCell>{sr.name}</TableCell>
        <TableCell style={{ textAlign: "right" }}>
          <SmallButton color="success" icon="people" text={"Select"} ariaLabel="addGroup" onClick={() => handleAdd(sr)} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      <TextField fullWidth name="groupSearchText" label="Group" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown}
        InputProps={{ endAdornment: <Button variant="contained" id="searchButton" data-cy="search-button" onClick={handleSearch}>Search</Button> }}
      />
      <Table size="small" id="householdMemberAddTable"><TableBody>{rows}</TableBody></Table>
    </>
  );
}
