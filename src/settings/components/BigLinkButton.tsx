import React from "react";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent } from "@mui/material"

interface Props {
  href: string;
  icon: string;
  text: string;
  outsideLink?: boolean;
}

export const BigLinkButton: React.FC<Props> = (props) => (
  <Grid md={3}>
    <LinkType href={props.href} outsideLink={props.outsideLink}>
      <Card>
        <CardContent className="text-center">
          <i className={props.icon} style={{ fontSize: 40 }}></i>
          <br />
          {props.text}
        </CardContent>
      </Card>
    </LinkType>
  </Grid>
);

interface LinkTypeProps {
  outsideLink?: boolean;
  href: string;
}

const LinkType: React.FC<LinkTypeProps> = (props) => {
  if (props.outsideLink) return <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
  else return <Link to={props.href}>{props.children}</Link>
}
