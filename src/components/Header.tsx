import React from "react";
import { UserHelper, PersonHelper, NavItems } from "./";
import UserContext from "../UserContext";
import { Link } from "react-router-dom";
import { Col, Container } from "react-bootstrap";

export const Header: React.FC = () => {
  const { firstName, lastName } = UserHelper.user;
  const [userName] = React.useState(UserHelper.person?.name?.display || `${firstName} ${lastName}`);

  const context = React.useContext(UserContext);

  const switchChurch = (e: React.MouseEvent) => {
    e.preventDefault();
    const id = e.currentTarget.getAttribute("data-id");
    UserHelper.selectChurch(context, id);
    UserHelper.churchChanged = true;
  }

  const getChurchLinks = () => {
    if (UserHelper.churches.length < 2) return null;
    else {
      let result: JSX.Element[] = [];
      UserHelper.churches.forEach(c => {
        const churchName = (c.id === UserHelper.currentChurch.id) ? (<b>{c.name}</b>) : (c.name);
        result.push(<li className="nav-tem" key={c.id}><a href="about:blank" data-id={c.id} onClick={switchChurch} className="nav-link"><i className="fas fa-external-link-alt"></i> {churchName}</a></li>);
      });
      return result;
    }
  }

  const toggleMenuItems = () => {
    let menuNav = document.getElementById("nav-menu");
    let listItems = Array.from(menuNav.children);
    listItems.forEach((_, i) => {
      if (i < (userName?.length <= 5 ? 3 : userName?.length < 24 ? 2 : 1)) {
        listItems[i].classList.add("d-md-none");
      } else if (
        i < (userName?.length <= 5 ? 5 : userName?.length < 24 ? 4 : 3)
      ) {
        listItems[i].classList.add("d-lg-none");
      } else if (i < (userName?.length < 24 ? 6 : 5)) {
        listItems[i].classList.add("d-xl-none");
      }
    });
  };

  React.useEffect(() => { toggleMenuItems(); });

  return (
    <>
      <div id="navbar" className=" fixed-top">
        <Container>
          <div className="d-flex justify-content-between">
            <div>
              <a className="navbar-brand" href="/">
                <img src="/images/logo.png" alt="logo" />
              </a>
            </div>

            <Col className="d-none d-md-block" style={{ borderLeft: "2px solid #EEE", borderRight: "2px solid #EEE", maxWidth: "703px", margin: "0 15px" }}>
              <ul id="nav-main" className="nav nav-fill d-flex overflow-hidden" style={{ height: "55px" }}>
                <NavItems prefix="main" />
              </ul>
            </Col>

            <div className="d-flex align-items-center" id="navRight">
              <a href="about:blank" data-cy="settings-dropdown" id="userMenuLink" data-toggle="collapse" data-target="#userMenu" aria-controls="navbarToggleMenu" aria-expanded="false" aria-label="Toggle navigation">
                <img src={PersonHelper.getPhotoUrl(UserHelper.person)} alt="user" />
                {userName} <i className="fas fa-caret-down"></i>
              </a>
            </div>
          </div>
        </Container>
        <div className="container collapse" id="userMenu">
          <div>
            <ul id="nav-menu" className="nav d-flex flex-column">
              <NavItems />
              {getChurchLinks()}
              <Link to="/logout" data-cy="logout-button"><i className="fas fa-lock"></i> Logout</Link>
            </ul>
          </div>
        </div>
      </div>

      <div id="navSpacer"></div>
    </>
  );
};
