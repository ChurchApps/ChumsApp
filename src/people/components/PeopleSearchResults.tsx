import React from "react";
import { Link } from "react-router-dom";
import { PersonHelper, PersonInterface, Loading, CreatePerson } from ".";
import { Table } from "react-bootstrap";

interface Props {
  people: PersonInterface[]
}

export function PeopleSearchResults({ people }: Props) {
  console.log(people);
  const rows = people?.map(p => (
    <tr key={p.id}>
      <td><img src={PersonHelper.getPhotoUrl(p)} alt="avatar" /></td>
      <td><Link to={"/people/" + p.id.toString()}>{p.name.display}</Link></td>
    </tr>
  ))

  const getResults = () => {
    if (people.length === 0) return <p>No results found.  Please search for a different name or add a new person</p>
    else return (<Table id="peopleTable">
      <thead><tr><th></th><th>Name</th></tr></thead>
      <tbody>{rows}</tbody>
    </Table>);
  }

  if (!people) return <Loading />;
  return (
    <div>
      {getResults()}
      <hr />
      <CreatePerson />
    </div>
  )
}
