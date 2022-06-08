import React from "react";
import { PersonHelper, AssociatedForms, PersonInterface, Loading, DisplayBox } from "."
import { Grid, Icon } from "@mui/material";

interface Props {
  id?: string,
  person: PersonInterface
  editFunction: () => void,
  updatedFunction: () => void
}

export const PersonView = ({ id, person, editFunction, updatedFunction }: Props) => {
  const getFields = () => {
    if (!person) return <Loading />
    else {

      let leftAttributes = [];
      let contactMethods = [];
      if (person) {
        const p = { ...person };
        if (p.gender && p.gender !== "Unspecified") leftAttributes.push(<div key="gender"><label>Gender:</label> {p.gender}</div>);
        if (p.birthDate) leftAttributes.push(<div key="age"><label>Age:</label> {PersonHelper.getAge(p.birthDate)}</div>);
        if (p.maritalStatus && p.maritalStatus !== "Single") {
          if (p.anniversary) leftAttributes.push(<div key="maritalStatus"><label>Marital Status:</label> {p.maritalStatus} ({new Date(p.anniversary).toLocaleDateString()})</div>);
          else leftAttributes.push(<div key="maritalStatus"><label>Marital Status:</label> {p.maritalStatus}</div>);
        }
        if (p.membershipStatus) leftAttributes.push(<div key="membership"><label>Membership:</label> {p.membershipStatus}</div>);

        let homeLabel = "Home";
        if (p.contactInfo.email) {
          contactMethods.push(<tr key="email"><td><label>{homeLabel}</label></td><td><Icon>mail</Icon></td><td><a href={"mailto:" + p.contactInfo.email}>{p.contactInfo.email}</a></td></tr>);
          homeLabel = "";
        }
        if (p.contactInfo.homePhone) {
          contactMethods.push(<tr key="homePhone"><td><label>{homeLabel}</label></td><td><Icon>call</Icon></td><td>{p.contactInfo.homePhone}</td></tr>);
          homeLabel = "";
        }

        if (p.contactInfo.address1) {
          let lines = [];
          lines.push(<div key="address1">{p.contactInfo.address1}</div>);
          if (p.contactInfo.address2) lines.push(<div key="address2">{p.contactInfo.address2}</div>);
          lines.push(<div key="contactInfo">{p.contactInfo.city}, {p.contactInfo.state} {p.contactInfo.zip}</div>);

          contactMethods.push(<tr key="address"><td><label>{homeLabel}</label></td><td><Icon>home_pin</Icon></td><td>{lines}</td></tr>);
        }
        if (p.contactInfo.mobilePhone) contactMethods.push(<tr key="mobilePHone"><td><label>Mobile</label></td><td><Icon>phone_iphone</Icon></td><td>{p.contactInfo.mobilePhone}</td></tr>);
        if (p.contactInfo.workPhone) contactMethods.push(<tr key="workPhone"><td><label>Work</label></td><td><Icon>call</Icon></td><td>{p.contactInfo.workPhone}</td></tr>);
      }

      return (<Grid container spacing={3}>
        <Grid item xs={3}>
          <img src={PersonHelper.getPhotoUrl(person)} className="img-fluid profilePic" aria-label="personImage" id="imgPreview" alt="avatar" />
        </Grid>
        <Grid item xs={9}>
          <h2>{person?.name.display}</h2>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>{leftAttributes}</Grid>
            <Grid item md={6} xs={12}><table className="contactTable"><tbody>{contactMethods}</tbody></table></Grid>
          </Grid>
        </Grid>
      </Grid>);
    }
  }

  return (
    <>
      <DisplayBox headerText="Person Details" editFunction={editFunction} footerContent={<AssociatedForms contentType="person" contentId={person?.id} formSubmissions={person?.formSubmissions} updatedFunction={updatedFunction} />}  >
        {getFields()}
      </DisplayBox>
    </>
  )
}
