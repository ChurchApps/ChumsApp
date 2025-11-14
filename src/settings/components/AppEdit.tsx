import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Stack,
  TextField,
  FormControl,
  Icon,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  type SelectChangeEvent,
  Box,
  Divider,
  IconButton,
  Grid
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import type { LinkInterface } from "@churchapps/helpers";
import { IconPicker } from "../../components/iconPicker";
import { ApiHelper, UniqueIdHelper, ArrayHelper, Locale } from "@churchapps/apphelper";
import { CardWithHeader, LoadingButton } from "../../components/ui";

interface PageInterface {
  id?: string;
  churchId?: string;
  url?: string;
  title?: string;
}

interface Props {
  currentTab: LinkInterface;
  updatedFunction?: () => void;
}

export function AppEdit({ currentTab: currentTabFromProps, updatedFunction = () => {} }: Props) {
  const [currentTab, setCurrentTab] = useState<LinkInterface>(null);
  const [pages, setPages] = useState<PageInterface[]>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setCurrentTab(currentTabFromProps);
  }, [currentTabFromProps]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (currentTab.linkType !== "url" && currentTab.linkType !== "page") currentTab.url = "";
      await ApiHelper.post("/links", [currentTab], "ContentApi");
      updatedFunction();
    } catch (error) {
      console.error("Error saving tab:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const val = e.target.value;
    const t = { ...currentTab };
    switch (e.target.name) {
      case "text": t.text = val; break;
      case "type": t.linkType = val; break;
      case "page": t.linkData = val; t.url = ArrayHelper.getOne(pages, "id", val).url; break;
      case "url": t.url = val; break;
    }
    setCurrentTab(t);
  };

  const onSelect = useCallback((iconName: string) => {
    const t = { ...currentTab };
    t.icon = iconName;
    setCurrentTab(t);
    setIsModalOpen(false);
  }, [currentTab]);

  const handleDelete = () => {
    if (window.confirm(Locale.label("settings.app.confirmDeleteTab"))) {
      ApiHelper.delete("/links/" + currentTab.id, "ContentApi").then(() => {
        setCurrentTab(null);
        updatedFunction();
      });
    }
  };

  const loadPages = () => {
    ApiHelper.get("/pages", "ContentApi").then((_pages: PageInterface[]) => {
      const filteredPages: PageInterface[] = [];
      _pages.forEach(p => { if (p.url.startsWith("/member")) filteredPages.push(p); });
      setPages(filteredPages || []);
    });
  };

  const getPage = () => {
    if (currentTab?.linkType === "page") {
      let options: React.ReactElement[] = [];
      if (pages === null) loadPages();
      else {
        options = [];
        pages.forEach(page => {
          options.push(<MenuItem value={page.id} key={page.id}>{page.title}</MenuItem>);
        });
        if (currentTab.linkData === "") currentTab.linkData = pages[0]?.url;
      }
      return (
        <FormControl fullWidth>
          <InputLabel id="page">Page</InputLabel>
          <Select labelId="page" label="Page" name="page" value={currentTab?.linkData} onChange={handleChange} data-testid="page-select">
            {options}
          </Select>
        </FormControl>
      );
    } else return null;
  };

  if (!currentTab) return null;

  return (
    <>
      <CardWithHeader
        title={UniqueIdHelper.isMissing(currentTab?.id) ? "Add New Tab" : "Edit Tab"}
        icon={<EditIcon />}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={updatedFunction}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={isSaving}
              loadingText="Saving..."
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Save Tab
            </LoadingButton>
          </Stack>
        }
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Stack spacing={3}>
              {/* Tab Name and Icon */}
              <TextField
                fullWidth
                label="Tab Name"
                name="text"
                value={currentTab?.text || ""}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setIsModalOpen(true)}
                      data-testid="icon-dropdown-button"
                      sx={{ color: 'primary.main' }}
                    >
                      <Icon>{currentTab?.icon}</Icon>
                    </IconButton>
                  )
                }}
                helperText={Locale.label("settings.app.tabNameHelper")}
              />

              {/* Tab Type */}
              <FormControl fullWidth>
                <InputLabel id="type">Tab Type</InputLabel>
                <Select
                  labelId="type"
                  label="Tab Type"
                  name="type"
                  value={currentTab?.linkType || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="bible">Bible</MenuItem>
                  <MenuItem value="stream">Live Stream</MenuItem>
                  <MenuItem value="votd">Verse of the Day</MenuItem>
                  <MenuItem value="checkin">Checkin</MenuItem>
                  <MenuItem value="donation">Donation</MenuItem>
                  <MenuItem value="donationLanding">Donation Landing</MenuItem>
                  <MenuItem value="directory">Member Directory</MenuItem>
                  <MenuItem value="groups">My Groups</MenuItem>
                  <MenuItem value="lessons">Lessons.church</MenuItem>
                  <MenuItem value="url">External URL</MenuItem>
                  <MenuItem value="page">Internal Page</MenuItem>
                </Select>
              </FormControl>

              {/* URL Field */}
              {currentTab?.linkType === "url" && (
                <TextField
                  fullWidth
                  label="URL"
                  name="url"
                  type="url"
                  value={currentTab?.url || ""}
                  onChange={handleChange}
                  helperText={Locale.label("settings.app.urlHelper")}
                />
              )}

              {/* Page Selection */}
              {getPage()}

              {/* Delete Action */}
              {!UniqueIdHelper.isMissing(currentTab?.id) && (
                <>
                  <Divider sx={{ mt: 2 }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDelete}
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      Delete Tab
                    </Button>
                  </Box>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardWithHeader>

      {/* Icon Picker Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
          <IconPicker currentIcon={currentTab?.icon} onUpdate={onSelect} onClose={() => setIsModalOpen(false)} />
        </Dialog>
      )}
    </>
  );
}
