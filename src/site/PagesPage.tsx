import React, { useEffect, useState } from "react";
import { Box, Button, Card, Chip, Grid, Icon, IconButton, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Add as AddIcon, Article as ArticleIcon, ChevronRight as ChevronRightIcon, Description as DescriptionIcon, Edit as EditIcon, ExpandMore as ExpandMoreIcon, Public as PublicIcon, Transform as TransformIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { ApiHelper, ErrorMessages, PageHeader, SmallButton, UserHelper, Locale } from "@churchapps/apphelper";
import { useWindowWidth } from "@react-hook/window-size";
import { Navigate, useNavigate } from "react-router-dom";
import { AddPageModal, NavLinkEdit } from "./components";
import { PageHelper, EnvironmentHelper } from "../helpers";
import type { PageLink } from "../helpers";
import type { GenericSettingInterface, LinkInterface } from "@churchapps/helpers";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SiteNavigation } from "../components/SiteNavigation";

export const PagesPage = () => {
  const windowWidth = useWindowWidth();
  const navigate = useNavigate();
  const [pageTree, setPageTree] = useState<PageLink[]>([]);
  const [addMode, setAddMode] = useState<string>("");
  const [requestedSlug, setRequestedSlug] = useState<string>("");
  const [links, setLinks] = useState<LinkInterface[]>([]);
  const [editLink, setEditLink] = useState<LinkInterface | null>(null);
  const [showLogin, setShowLogin] = useState<GenericSettingInterface>();

  const getExpandControl = (item: PageLink, level: number) => {
    if (item.children && item.children.length > 0) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", ml: level * 2 }}>
          <IconButton size="small" onClick={() => { item.expanded = !item.expanded; setPageTree([...pageTree]); }} sx={{ p: 0.5 }}>
            {item.expanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </Box>
      );
    }
    else return <Box sx={{ width: 32, ml: level * 2 }}></Box>;
  }

  const getTreeLevel = (items: PageLink[], level: number) => {
    const result: React.ReactElement[] = [];
    items.forEach((item) => {
      result.push(
        <TableRow key={item.url} sx={{ '&:hover': { backgroundColor: 'action.hover' }, transition: 'background-color 0.2s ease' }}>
          <TableCell sx={{ width: 120 }}>
            {item.custom
              ? (<Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => { navigate("/site/pages/preview/" + item.pageId) }} data-testid="edit-page-button" sx={{ textTransform: 'none', minWidth: 'auto', fontSize: '0.75rem' }}>{Locale.label("common.edit")}</Button>)
              : (<Button variant="outlined" size="small" startIcon={<TransformIcon />} onClick={() => { if (confirm(Locale.label("site.pagesPage.confirmConvert"))) { setRequestedSlug(item.url); setAddMode("unlinked"); } }} color="secondary" data-testid="convert-page-button" sx={{ textTransform: 'none', minWidth: 'auto', fontSize: '0.75rem' }}>{Locale.label("site.pages.convert")}</Button>)}
          </TableCell>
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={1}>
              {getExpandControl(item, level)}
              <Typography variant="body2" sx={{ fontFamily: 'monospace', cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }} onClick={() => window.open(EnvironmentHelper.B1Url.replace('{subdomain}', UserHelper.currentUserChurch.church.subDomain) + item.url, '_blank')}>
                {item.url}
              </Typography>
              <Tooltip title="Preview page"><IconButton size="small" onClick={() => window.open(EnvironmentHelper.B1Url.replace('{subdomain}', UserHelper.currentUserChurch.church.subDomain) + item.url, '_blank')} sx={{ p: 0.5 }}><VisibilityIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
              {!item.custom && (<Chip label="Generated" size="small" color="default" sx={{ fontSize: '0.7rem', height: 18 }} />)}
            </Stack>
          </TableCell>
          <TableCell>
            <Typography variant="body2">
              {item.title}
            </Typography>
          </TableCell>
        </TableRow>
      );
      if (item.expanded && item.children) result.push(...getTreeLevel(item.children, level + 1));
    });
    return result;
  }

  const loadData = () => {
    PageHelper.loadPageTree().then((data) => { setPageTree(data); });
    ApiHelper.get("/links?category=website", "ContentApi").then((data: any) => { setLinks(data); });
    ApiHelper.get("/settings", "ContentApi").then((data: GenericSettingInterface[]) => {
      const loginSetting = data.filter((d: any) => d.keyName === "showLogin");
      if (loginSetting) setShowLogin(loginSetting[0]);
    });
  }

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting: GenericSettingInterface = showLogin ? { ...showLogin, value: `${e.target.checked}` } : { keyName: "showLogin", value: `${e.target.checked}`, public: 1 };
    ApiHelper.post("/settings", [setting], "ContentApi").then((data: any) => { setShowLogin(data[0]); });
  };

  const handleDrop = (index: number, parentId: string, link: LinkInterface) => {
    if (parentId === "") parentId = null;
    if (parentId === "unlinked") {
      if (link) ApiHelper.delete("/links/" + link.id, "ContentApi").then(() => { loadData(); });
    } else {
      if (link) {
        link.parentId = parentId;
        link.sort = index;
        ApiHelper.post("/links", [link], "ContentApi").then(() => { loadData(); });
      } else {
        const newLink: LinkInterface = { id: "", churchId: UserHelper.currentUserChurch.church.id, category: "website", url: "/new-page", linkType: "url", linkData: "", icon: "", text: "New Link", sort: index, parentId: parentId };
        ApiHelper.post("/links", [newLink], "ContentApi").then(() => { loadData(); });
      }
    }
  };

  const addLinkCallback = (link: LinkInterface) => {
    loadData();
    setEditLink(null);
  };

  const getPageStats = () => {
    const countPages = (items: PageLink[]): { custom: number, auto: number, total: number } => {
      let custom = 0;
      let auto = 0;

      items.forEach((item) => {
        if (item.custom) custom++;
        else auto++;

        if (item.children) {
          const childStats = countPages(item.children);
          custom += childStats.custom;
          auto += childStats.auto;
        }
      });

      return { custom, auto, total: custom + auto };
    };

    return countPages(pageTree);
  }

  useEffect(() => {
    loadData();
  }, []);


  const pageStats = getPageStats();
  const checked = showLogin?.value === "true" ? true : false;

  if (windowWidth < 882) {
    return <ErrorMessages errors={["Page editor is only available in desktop mode"]} />;
  }

  return (
    <>
      {(addMode !== "") && <AddPageModal updatedCallback={() => { loadData(); setAddMode(""); setRequestedSlug(""); }} onDone={() => { setAddMode(""); setRequestedSlug(""); }} mode={addMode} requestedSlug={requestedSlug} />}
      {(editLink) && <NavLinkEdit updatedCallback={addLinkCallback} onDone={() => { setEditLink(null); }} link={editLink} />}
      <PageHeader icon={<ArticleIcon />} title="Website Pages" subtitle="Manage your website pages, content, and navigation" statistics={[{ icon: <DescriptionIcon />, value: pageStats.total.toString(), label: "Total Pages" }, { icon: <EditIcon />, value: pageStats.custom.toString(), label: "Custom Pages" }, { icon: <PublicIcon />, value: pageStats.auto.toString(), label: "Auto-generated" }]}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => { setAddMode("unlinked"); }} data-testid="add-page-button" sx={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#FFF', backgroundColor: 'rgba(255,255,255,0.1)' } }}>Add Page</Button>
      </PageHeader>
      <Grid container spacing={3}>
        <Grid item xs={12} md={2} style={{ backgroundColor: "#FFF", paddingLeft: 40, paddingTop: 24, position: "relative", zIndex: 1 }}>
          <DndProvider backend={HTML5Backend}>
            <h2 style={{ marginTop: 0 }}>Pages</h2>
            <div>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography sx={{ fontSize: "13.5px", fontStyle: "italic" }}>Show Login</Typography>
                  <Tooltip title="Show login button in the navigation bar" arrow><Icon color="primary" sx={{ fontSize: "18px !important", cursor: "pointer" }}>info</Icon></Tooltip>
                </Stack>
                <Switch onChange={handleSwitchChange} checked={showLogin ? checked : true} inputProps={{ 'aria-label': "Toggle login button visibility" }} data-testid="show-login-switch" />
              </Stack>
            </div>
            <div>
              <span style={{ float: "right" }}>
                <SmallButton icon="add" onClick={() => { setEditLink({ churchId: UserHelper.currentUserChurch.church.id, category: "website", linkType: "url", sort: 99, linkData: "", icon: "" }); }} data-testid="add-navigation-link" />
              </span>
              <h3>Main Navigation</h3>
            </div>
            <SiteNavigation links={links} refresh={loadData} select={(link) => { }} handleDrop={handleDrop} />
          </DndProvider>
        </Grid>
        <Grid item xs={12} md={10} style={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ p: 3 }}>
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ArticleIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Pages
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Below is a list of custom and auto-generated pages. You can add new pages, edit existing ones, or convert auto-generated pages to custom pages.
                </Typography>

                {pageTree.length === 0
                  ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <ArticleIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No pages found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Get started by adding your first page.</Typography>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setAddMode("unlinked"); }}>Add First Page</Button>
                    </Box>
                  )
                  : (
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead sx={{ backgroundColor: 'grey.50', '& .MuiTableCell-root': { borderBottom: '2px solid', borderBottomColor: 'divider' } }}>
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Actions
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Path
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Title
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getTreeLevel(pageTree, 0)}
                      </TableBody>
                    </Table>
                  )}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
