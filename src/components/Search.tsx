import React from "react";
import { PersonInterface, PersonHelper } from "./";
import { InputGroup, FormControl, Button, Table } from "react-bootstrap";
import { Icon } from "@mui/material";

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
      <tr key={person.id}>
        <td>
          <img src={PersonHelper.getPhotoUrl(person)} alt="avatar" />
        </td>
        <td>{person.name.display}</td>
        <td>
          <button className="text-success no-default-style" onClick={() => {
            props.handleClickAction(person.id);
          }}>
            <Icon>person</Icon> {props.buttonText}
          </button>
        </td>
      </tr>
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
      <Table size="sm" id="searchResults">
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};
