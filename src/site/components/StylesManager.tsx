import { useState, useEffect, useContext } from "react";
import { Box, Grid, Button, Stack, Typography, Tabs, Tab } from "@mui/material";
import { Palette as PaletteIcon, TextFields as TextFieldsIcon, Code as CodeIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { ApiHelper } from "@churchapps/apphelper";
import type { GlobalStyleInterface } from "../../helpers/Interfaces";
import { PaletteEdit, FontEdit, CssEdit, Preview } from "./";
import UserContext from "../../UserContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`style-tabpanel-${index}`} aria-labelledby={`style-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export function StylesManager() {
  const context = useContext(UserContext);
  const [globalStyle, setGlobalStyle] = useState<GlobalStyleInterface>(null);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const loadData = async () => {
    const data = await ApiHelper.get("/globalStyles/my", "ContentApi");
    if (data) setGlobalStyle(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleSavePalette = async (paletteJson: string) => {
    if (!paletteJson) {
      setEditSection(null);
      return;
    }
    const gs = { ...globalStyle, palette: paletteJson };
    await ApiHelper.post("/globalStyles", [gs], "ContentApi");
    setGlobalStyle(gs);
    setEditSection(null);
  };

  const handleSaveFonts = async (fontsJson: string) => {
    if (!fontsJson) {
      setEditSection(null);
      return;
    }
    const gs = { ...globalStyle, fonts: fontsJson };
    await ApiHelper.post("/globalStyles", [gs], "ContentApi");
    setGlobalStyle(gs);
    setEditSection(null);
  };

  const handleSaveCss = async (gs: GlobalStyleInterface) => {
    if (!gs) {
      setEditSection(null);
      return;
    }
    await ApiHelper.post("/globalStyles", [gs], "ContentApi");
    setGlobalStyle(gs);
    setEditSection(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (editSection === "palette") return <PaletteEdit globalStyle={globalStyle} updatedFunction={handleSavePalette} />;
  if (editSection === "fonts") return <FontEdit globalStyle={globalStyle} updatedFunction={handleSaveFonts} />;
  if (editSection === "css") return <CssEdit globalStyle={globalStyle} updatedFunction={handleSaveCss} />;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ backgroundColor: "#FFF", borderRadius: 2, border: "1px solid", borderColor: "grey.200", overflow: "hidden" }}>
            <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{
                  backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", p: 1, display: "flex", alignItems: "center", justifyContent: "center" 
                }}>
                  <VisibilityIcon sx={{ fontSize: 24, color: "#FFF" }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Website Preview</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>See how your styles look on your site</Typography>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
              <Preview globalStyle={globalStyle} churchSettings={context.userChurch?.church} churchName={context.userChurch?.church?.name || "Your Church"} />
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ backgroundColor: "#FFF", borderRadius: 2, border: "1px solid", borderColor: "grey.200", overflow: "hidden" }}>
            <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{
                  backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", p: 1, display: "flex", alignItems: "center", justifyContent: "center" 
                }}>
                  <PaletteIcon sx={{ fontSize: 24, color: "#FFF" }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Style Settings</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>Customize your website appearance</Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" aria-label="style settings tabs">
                <Tab label="Quick" id="style-tab-0" aria-controls="style-tabpanel-0" />
                <Tab label="Advanced" id="style-tab-1" aria-controls="style-tabpanel-1" />
              </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
              <Box sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PaletteIcon />}
                    onClick={() => setEditSection("palette")}
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.5,
                      textTransform: "none"
                    }}
                    data-testid="edit-palette-button">
                    <Box sx={{ textAlign: "left", flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Color Palette
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Customize your site colors
                      </Typography>
                    </Box>
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<TextFieldsIcon />}
                    onClick={() => setEditSection("fonts")}
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.5,
                      textTransform: "none"
                    }}
                    data-testid="edit-fonts-button">
                    <Box sx={{ textAlign: "left", flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Typography
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Select heading and body fonts
                      </Typography>
                    </Box>
                  </Button>
                </Stack>
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Box sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CodeIcon />}
                    onClick={() => setEditSection("css")}
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.5,
                      textTransform: "none"
                    }}
                    data-testid="edit-css-button">
                    <Box sx={{ textAlign: "left", flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Custom CSS & JS
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Add custom code
                      </Typography>
                    </Box>
                  </Button>
                </Stack>
              </Box>
            </TabPanel>

            <Box sx={{ p: 2, backgroundColor: "grey.50", borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="caption" color="text.secondary">
                Changes will be visible immediately on your website after saving
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
