import React from "react";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Icon } from "@mui/material"

interface Props {
  href: string;
  icon: string;
  text: string;
  outsideLink?: boolean;
}

export const BigLinkButton: React.FC<Props> = (props) => (
  <Grid item md={3}>
    <LinkType href={props.href} outsideLink={props.outsideLink}>
      <Card>
        <CardContent className="text-center">
          <Icon style={{ fontSize: 40 }}>{props.icon}</Icon>
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
