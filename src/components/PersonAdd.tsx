import React from "react";
import { ApiHelper, PersonInterface, PersonHelper } from "./";
import { Table, Button, FormControl, InputGroup } from "react-bootstrap";

interface Props { addFunction: (person: PersonInterface) => void, person?: PersonInterface }

export const PersonAdd: React.FC<Props> = (props) => {
    const [searchResults, setSearchResults] = React.useState<PersonInterface[]>(null);
    const [searchText, setSearchText] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { e.preventDefault(); setSearchText(e.currentTarget.value); }
    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(null); } }
    const handleSearch = (e: React.MouseEvent) => {
        if (e !== null) e.preventDefault();
        let term = escape(searchText.trim());
        ApiHelper.get("/people/search?term=" + term, "MembershipApi").then(data => setSearchResults(data));
    }
    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        var anchor = e.currentTarget as HTMLAnchorElement;
        var idx = anchor.getAttribute("data-index");
        var sr: PersonInterface[] = [...searchResults];
        var person: PersonInterface = sr.splice(parseInt(idx), 1)[0];
        setSearchResults(sr);
        props.addFunction(person);
    }

    var rows = [];
    if (searchResults !== null) {
        for (var i = 0; i < searchResults.length; i++) {
            var sr = searchResults[i];
            rows.push(
                <tr key={sr.id}>
                    <td><img src={PersonHelper.getPhotoUrl(sr)} alt="avatar" /></td>
                    <td>{sr.name.display}</td>
                    <td><a className="text-success" data-cy="add-to-list" data-index={i} href="about:blank" onClick={handleAdd}><i className="fas fa-user"></i> Add</a></td>
                </tr>
            );
        }
    }

    return (
        <>
            <InputGroup>
                <FormControl id="personAddText" data-cy="person-search-bar" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown} />
                <div className="input-group-append"><Button data-cy="person-search-button" id="personAddButton" variant="primary" onClick={handleSearch} ><i className="fas fa-search"></i> Search</Button></div>
            </InputGroup>
            <Table size="sm" id="householdMemberAddTable"><tbody>{rows}</tbody></Table>
        </>
    );
}
