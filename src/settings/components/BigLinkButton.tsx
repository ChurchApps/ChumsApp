import React from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {
    href: string,
    icon: string,
    text: string
}

export const BigLinkButton: React.FC<Props> = (props) => {
    return (
        <Col md={{ span: 3 }} >
            <Link to={props.href}>
                <Card>
                    <Card.Body className="text-center">
                        <i className={props.icon} style={{ fontSize: 40 }} ></i>
                        <br />
                        {props.text}
                    </Card.Body>
                </Card>
            </Link>
        </Col>
    );
}

