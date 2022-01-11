import React from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {
  href: string;
  icon: string;
  text: string;
  outsideLink?: boolean;
}

export const BigLinkButton: React.FC<Props> = (props) => (
  <Col md={{ span: 3 }}>
    <LinkType href={props.href} outsideLink={props.outsideLink}>
      <Card>
        <Card.Body className="text-center">
          <i className={props.icon} style={{ fontSize: 40 }}></i>
          <br />
          {props.text}
        </Card.Body>
      </Card>
    </LinkType>
  </Col>
);

interface LinkTypeProps {
  outsideLink?: boolean;
  href: string;
}

const LinkType: React.FC<LinkTypeProps> = (props) => {
  if (props.outsideLink) return <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
  else return <Link to={props.href}>{props.children}</Link>
}
