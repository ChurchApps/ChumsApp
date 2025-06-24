import React from "react";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Icon } from "@mui/material"

interface Props {
  href: string;
  icon: string;
  text: string;
  outsideLink?: boolean;
}

export const BigLinkButton: React.FC<Props> = React.memo((props) => (
  <Grid size={{ xs: 6, md: 3 }}>
    <LinkType href={props.href} outsideLink={props.outsideLink}>
      <Card>
        <CardContent sx={{ textAlign: "center" }}>
          <Icon style={{ fontSize: 40 }}>{props.icon}</Icon>
          <br />
          {props.text}
        </CardContent>
      </Card>
    </LinkType>
  </Grid>
));

interface LinkTypeProps {
  outsideLink?: boolean;
  href: string;
  children?: JSX.Element;
}

const LinkType: React.FC<LinkTypeProps> = React.memo((props) => {
  if (props.outsideLink) return <a href={props.href} className="text-decoration" target="_blank" rel="noopener noreferrer">{props.children}</a>
  else return <Link to={props.href}>{props.children}</Link>
});
