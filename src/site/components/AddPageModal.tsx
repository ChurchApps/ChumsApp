import { useState, useEffect } from "react";
import { ErrorMessages, InputBox, UserHelper, SlugHelper, ApiHelper } from "@churchapps/apphelper";
import { Permissions, type LinkInterface } from "@churchapps/helpers";
import { Button, Dialog, Grid, Icon, InputLabel, type SelectChangeEvent, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  mode: string,
  updatedCallback: () => void;
  onDone: () => void;
  requestedSlug?: string;
};

interface PageInterface {
  id?: string;
  title?: string;
  url?: string;
  layout?: string;
}

export function AddPageModal(props: Props) {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageInterface>(null);
  const [link, setLink] = useState<LinkInterface>(null);
  const [errors, setErrors] = useState([]);
  const [pageTemplate, setPageTemplate] = useState<string>("blank");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCancel = () => props.onDone();
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let p = { ...page };
    const val = e.target.value;
    switch (e.target.name) {
      case "title": p.title = val; break;
      case "url":
        p.url = val.toLowerCase();
        if (link) {
          let l = { ...link };
          l.url = val.toLowerCase();
          setLink(l);
        }
        break;
      case "layout": p.layout = val; break;
    }
    setPage(p);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let l = { ...link };
    const val = e.target.value;
    switch (e.target.name) {
      case "linkText": l.text = val; break;
      case "linkUrl": l.url = val; break;
    }
    setLink(l);
  };

  const validate = () => {
    let errors = [];
    if (pageTemplate === "link") {
      if (!link.url || link.url === "") errors.push("Please enter a url.");
    } else {
      if (!page.title || page.title === "") errors.push("Please enter a title.");
    }
    if (props.mode === "navigation") {
      if (!link.text || link.text === "") errors.push("Please enter link text.");
    }
    if (!UserHelper.checkAccess(Permissions.contentApi.content.edit)) errors.push("Unauthorized to create pages");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        let pageData = null;
        let linkData = null;
        if (pageTemplate !== "link") {
          let p = { ...page };
          const slugString = link?.text || page.title || "new-page";
          p.url = props.requestedSlug || SlugHelper.slugifyString("/" + slugString.toLowerCase().replace(" ", "-"), "urlPath");

          pageData = await ApiHelper.post("/pages", [p], "ContentApi").then((data: any) => {
            setPage(data[0]);
            return data[0];
          });
        }

        if (props.mode === "navigation") {
          const l = { ...link };
          if (pageTemplate !== "link") l.url = pageData.url;
          linkData = await ApiHelper.post("/links", [l], "ContentApi").then((data: any) => data[0]);
        }

        props.updatedCallback();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const selectTemplate = (template: string) => {
    const p = { ...page };
    const l = { ...link };
    const churchName = UserHelper.currentUserChurch.church.name || "";
    switch (template) {
      case "sermons": p.title = "View Sermons"; l.text = "Sermons"; break;
      case "about": p.title = "About " + churchName; l.text = "About Us"; break;
      case "donate": p.title = "Support " + churchName; l.text = "Donate"; break;
      case "location": p.title = "Directions to " + churchName; l.text = "Location"; break;
    }
    setPage(p);
    setLink(l);
    setPageTemplate(template);
  }

  const getTemplateButton = (key: string, icon: string, text: string) => (
    <Grid size={3}>
      <Button variant={(pageTemplate.toLowerCase() === key) ? "contained" : "outlined"} startIcon={<Icon>{icon}</Icon>} onClick={() => { selectTemplate(key) }} fullWidth data-testid={`template-${key}-button`}>{text}</Button>
    </Grid>
  )

  useEffect(() => {
    setPage({ layout: "headerFooter" });
    setLink({ churchId: UserHelper.currentUserChurch.church.id, category: "website", linkType: "url", sort: 99 } as LinkInterface);
  }, [props.mode]);

  if (!page && !link) return <></>
  else return (

    <Dialog open={true} onClose={props.onDone} className="dialogForm">
      <InputBox id="dialogForm" headerText={(pageTemplate === "link") ? "New Link" : "New Page"} headerIcon="article" saveFunction={handleSave} cancelFunction={handleCancel} data-testid="add-page-modal" isSubmitting={isSubmitting}>
        <ErrorMessages errors={errors} />

        <InputLabel>Page Type</InputLabel>


        <Grid container spacing={2}>
          {getTemplateButton("blank", "article", "Blank")}
          {getTemplateButton("sermons", "subscriptions", "Sermons")}
          {getTemplateButton("about", "quiz", "About Us")}
          {getTemplateButton("donate", "volunteer_activism", "Donate")}
          {getTemplateButton("location", "location_on", "Location")}
          {(props.mode === "navigation") && getTemplateButton("link", "link", "Link")}
        </Grid>

        <Grid container spacing={2}>
          {(pageTemplate !== "link") && <Grid size={(props.mode === "navigation") ? 6 : 12}>
            <TextField size="small" fullWidth label="Page Title" name="title" value={page.title || ""} onChange={handleChange} onKeyDown={handleKeyDown} data-testid="page-title-input" />
          </Grid>}
          {(pageTemplate === "link") && <Grid size={(props.mode === "navigation") ? 6 : 12}>
            <TextField size="small" fullWidth label="Link Url" name="linkUrl" value={link.url || ""} onChange={handleLinkChange} onKeyDown={handleKeyDown} />
          </Grid>}
          {(props.mode === "navigation") && <Grid size={6}>
            <TextField size="small" fullWidth label="Link Text" name="linkText" value={link.text || ""} onChange={handleLinkChange} onKeyDown={handleKeyDown} />
          </Grid>}
        </Grid>
      </InputBox>

    </Dialog>
  );
}
