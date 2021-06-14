import React from "react";
import { PersonHelper, AssociatedForms, PersonInterface, Loading } from "."
import { Row, Col } from "react-bootstrap";

interface Props {
  id?: string,
  person: PersonInterface
  editFunction: (e: React.MouseEvent) => void,
  photoUrl: string
  updatedFunction: () => void
}

export const PersonView: React.FC<Props> = (props) => {

  const getPhoto = () => {
    if (props.person) {
      let url = (props.photoUrl === null) ? PersonHelper.getPhotoUrl(props.person) : props.photoUrl;
      return <img src={url} className="img-fluid profilePic" id="imgPreview" alt="avatar" />
    } else return;
  }

  const getFields = () => {
    if (!props.person) return <Loading />
    else {

      let leftAttributes = [];
      let contactMethods = [];
      if (props.person) {
        const p = { ...props.person };
        if (p.gender && p.gender !== "Unspecified") leftAttributes.push(<div key="gender"><label>Gender:</label> {p.gender}</div>);
        if (p.birthDate) leftAttributes.push(<div key="age"><label>Age:</label> {PersonHelper.getAge(p.birthDate)}</div>);
        if (p.maritalStatus && p.maritalStatus !== "Single") {
          if (p.anniversary) leftAttributes.push(<div key="maritalStatus"><label>Marital Status:</label> {p.maritalStatus} ({new Date(p.anniversary).toLocaleDateString()})</div>);
          else leftAttributes.push(<div key="maritalStatus"><label>Marital Status:</label> {p.maritalStatus}</div>);
        }
        if (p.membershipStatus) leftAttributes.push(<div key="membership"><label>Membership:</label> {p.membershipStatus}</div>);

        let homeLabel = "Home";
        if (p.contactInfo.email) {
          contactMethods.push(<tr key="email"><td><label>{homeLabel}</label></td><td><i className="far fa-envelope"></i></td><td><a href={"mailto:" + p.contactInfo.email}>{p.contactInfo.email}</a></td></tr>);
          homeLabel = "";
        }
        if (p.contactInfo.homePhone) {
          contactMethods.push(<tr key="homePhone"><td><label>{homeLabel}</label></td><td><i className="fas fa-phone"></i></td><td>{p.contactInfo.homePhone}</td></tr>);
          homeLabel = "";
        }

        if (p.contactInfo.address1) {
          let lines = [];
          lines.push(<div key="address1">{p.contactInfo.address1}</div>);
          if (p.contactInfo.address2) lines.push(<div key="address2">{p.contactInfo.address2}</div>);
          lines.push(<div key="contactInfo">{p.contactInfo.city}, {p.contactInfo.state} {p.contactInfo.zip}</div>);

          contactMethods.push(<tr key="address"><td><label>{homeLabel}</label></td><td><i className="fas fa-map-marker-alt"></i></td><td>{lines}</td></tr>);
        }
        if (p.contactInfo.mobilePhone) contactMethods.push(<tr key="mobilePHone"><td><label>Mobile</label></td><td><i className="fas fa-phone"></i></td><td>{p.contactInfo.mobilePhone}</td></tr>);
        if (p.contactInfo.workPhone) contactMethods.push(<tr key="workPhone"><td><label>Work</label></td><td><i className="fas fa-phone"></i></td><td>{p.contactInfo.workPhone}</td></tr>);
      }

      return (<Row>
        <Col xs={3}>{getPhoto()}</Col>
        <Col xs={9}>
          <h2>{props.person?.name.display}</h2>
          <Row>
            <Col lg={6}>{leftAttributes}</Col>
            <Col lg={6}><table className="contactTable"><tbody>{contactMethods}</tbody></table></Col>
          </Row>
        </Col>
      </Row>);
    }
  }

  return (
    <div id={props.id} className="inputBox" data-cy="person-details-box">
      <div className="header">
        <Row>
          <Col xs={8}><i className="fas fa-user"></i> Personal Details</Col>
          <Col xs={4} style={{ textAlign: "right" }}><a className="fa-pull-right" data-cy="edit-person-button" onClick={props.editFunction} href="about:blank"><i className="fas fa-pencil-alt"></i></a></Col>
        </Row>
      </div>
      <div className="content">
        {getFields()}
      </div>
      <AssociatedForms contentType="person" contentId={props.person?.id} formSubmissions={props.person?.formSubmissions} updatedFunction={props.updatedFunction} />
    </div>
  )
}
