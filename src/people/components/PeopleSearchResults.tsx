import React from "react";
import { Link } from "react-router-dom";
import { PersonHelper, PersonInterface, Loading, CreatePerson } from ".";
import { Table } from "react-bootstrap";

interface Props {
  people: PersonInterface[],
  columns: { key: string, label: string, shortName: string }[],
  selectedColumns: string[],
}

export function PeopleSearchResults(props: Props) {

  const getColumns = (p: PersonInterface) => {
    const result: JSX.Element[] = [];
    props.columns.forEach(c => {
      if (props.selectedColumns.indexOf(c.key) > -1) {
        result.push(<td>{getColumn(p, c.key)}</td>);
      }
    })
    return result;
  }

  const getColumn = (p: PersonInterface, key: string) => {
    let result = <></>;
    switch (key) {
      case "photo": result = (<img src={PersonHelper.getPhotoUrl(p)} alt="avatar" />); break;
      case "displayName": result = (<Link to={"/people/" + p.id.toString()}>{p.name.display}</Link>); break;
      case "lastName": result = (<>{p.name.last}</>); break;
      case "firstName": result = (<>{p.name.first}</>); break;
      case "middleName": result = (<>{p.name.middle}</>); break;
      case "address": result = (<>{p.contactInfo.address1}</>); break;
      case "city": result = (<>{p.contactInfo.city}</>); break;
      case "state": result = (<>{p.contactInfo.state}</>); break;
      case "zip": result = (<>{p.contactInfo.zip}</>); break;
      case "email": result = (<>{p.contactInfo.email}</>); break;
      case "phone": result = (<>{p.contactInfo.mobilePhone || p.contactInfo.homePhone || p.contactInfo.workPhone}</>); break;
      case "birthDate": result = (<>{(p.birthDate === null) ? "" : new Date(p.birthDate).toLocaleDateString()}</>); break;
      case "birthDay": result = (<>{PersonHelper.getBirthDay(p)}</>); break;
      case "age": result = (<>{(p.birthDate === null) ? "" : PersonHelper.getAge(p.birthDate).split(" ")[0]}</>); break;
      case "gender": result = (<>{p.gender}</>); break;
      case "membershipStatus": result = (<>{p.membershipStatus}</>); break;
      case "maritalStatus": result = (<>{p.maritalStatus}</>); break;
      case "anniversary": result = (<>{(p.anniversary === null) ? "" : new Date(p.anniversary).toLocaleDateString()}</>); break;

    }

    return result;
  }

  const getRows = () => {
    const result: JSX.Element[] = props.people?.map(p => (
      <tr key={p.id}>
        {getColumns(p)}
      </tr>
    ));
    return result;
  }

  const getHeaders = () => {
    const result: JSX.Element[] = [];
    props.columns.forEach(c => {
      if (props.selectedColumns.indexOf(c.key) > -1) result.push(<th>{c.shortName}</th>)
    })

    return <thead><tr>{result}</tr></thead>;
  }

  const getResults = () => {
    if (props.people.length === 0) return <p>No results found.  Please search for a different name or add a new person</p>
    else return (<Table id="peopleTable">
      {getHeaders()}
      <tbody>{getRows()}</tbody>
    </Table>);
  }

  if (!props.people) return <Loading />;
  return (
    <div>
      {getResults()}
      <hr />
      <CreatePerson />
    </div>
  )
}
