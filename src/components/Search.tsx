import React from "react";
import { PersonInterface, PersonHelper } from "./";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { Table, TableBody, TableRow, TableCell, Icon } from "@mui/material"

interface Props {
  handleSearch: (text: string) => void,
  searchResults: PersonInterface[],
  buttonText: string,
  handleClickAction: (id: string) => void,
}

export const Search: React.FC<Props> = (props) => {
  const [searchText, setSearchText] = React.useState<string>("");
  const [rows, setRows] = React.useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.handleSearch(searchText);
    }
  };

  const createRows = () => {
    const tableRows = props.searchResults?.map((person, index) => (
      <TableRow key={person.id}>
        <TableCell>
          <img src={PersonHelper.getPhotoUrl(person)} alt="avatar" />
        </TableCell>
        <TableCell>{person.name.display}</TableCell>
        <TableCell>
          <button className="text-success no-default-style" onClick={() => {
            props.handleClickAction(person.id);
          }}>
            <Icon>person</Icon> {props.buttonText}
          </button>
        </TableCell>
      </TableRow>
    ));

    setRows(tableRows);
  };

  React.useEffect(createRows, [props.searchResults]); //eslint-disable-line

  return (
    <>
      <InputGroup>
        <FormControl
          id="searchInput"
          aria-label="searchPerson"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div className="input-group-append">
          <Button
            id="searchButton"
            data-cy="search-button"
            variant="primary"
            onClick={() => props.handleSearch(searchText)}
          >
            <Icon>search</Icon> Search
          </Button>
        </div>
      </InputGroup>
      <Table size="small" id="searchResults">
        <TableBody>{rows}</TableBody>
      </Table>
    </>
  );
};
