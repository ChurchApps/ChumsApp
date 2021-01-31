import React from "react";
import { PersonInterface, PersonHelper } from "./";
import { InputGroup, FormControl, Button, Table } from "react-bootstrap";

interface Props {
  handleSearch: (text: string) => void,
  searchResults: PersonInterface[],
  buttonText: string,
  handleClickAction: (id: number) => void,
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
          <a className="text-success" href="about:blank" data-index={index} onClick={(e) => {
            e.preventDefault();
            props.handleClickAction(person.id);
          }}>
            <i className="fas fa-user"></i> {props.buttonText}
          </a>
        </td>
      </tr>
    ));

    setRows(tableRows);
  };

  React.useEffect(createRows, [props.searchResults]);

  return (
    <>
      <InputGroup>
        <FormControl
          id="searchInput"
          data-cy="search-input"
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
            <i className="fas fa-search"></i> Search
          </Button>
        </div>
      </InputGroup>
      <Table size="sm" id="searchResults">
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};
