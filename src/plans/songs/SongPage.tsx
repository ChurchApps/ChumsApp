import React, { useEffect, memo, useCallback, useMemo } from "react";
import { ApiHelper, ArrayHelper } from "@churchapps/apphelper";
import { useParams } from "react-router-dom";
import { type ArrangementInterface, type ArrangementKeyInterface, type SongDetailInterface, type SongInterface } from "../../helpers";
import {
 Grid, Box, Card, CardContent, Typography, Stack, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Button, Paper, Avatar, Chip 
} from "@mui/material";
import {
  LibraryMusic as MusicIcon,
  Add as AddIcon,
  QueueMusic as ArrangementIcon,
  MusicNote as NoteIcon,
  Person as ArtistIcon,
  Album as AlbumIcon,
  Timer as TimerIcon,
  MusicOff as KeyIcon,
  Speed as BpmIcon,
  Edit as EditIcon,
  Language as LanguageIcon,
  DateRange as DateIcon,
  Schedule as TimeIcon,
} from "@mui/icons-material";
import { Arrangement } from "./components/Arrangement";
import { SongSearchDialog } from "./SongSearchDialog";
import { SongDetailsEdit } from "./components/SongDetailsEdit";

export const SongPage = memo(() => {
  const [song, setSong] = React.useState<SongInterface>(null);
  const [songDetail, setSongDetail] = React.useState<SongDetailInterface>(null);
  const [showSearch, setShowSearch] = React.useState(false);
  const [editSongDetails, setEditSongDetails] = React.useState(false);
  const [arrangements, setArrangements] = React.useState<ArrangementInterface[]>([]);
  const [selectedArrangement, setSelectedArrangement] = React.useState(null);
  const params = useParams();

  const loadData = useCallback(async () => {
    if (!params.id) return;
    const s = await ApiHelper.get("/songs/" + params.id, "ContentApi");
    setSong(s);
    const arrangements = await ApiHelper.get("/arrangements/song/" + s.id, "ContentApi");
    setArrangements(arrangements);
    if (arrangements.length > 0) {
      setSelectedArrangement(arrangements[0]);
      // Load song details from the first arrangement if available
      if (arrangements[0].songDetailId) {
        const songDetail = await ApiHelper.get("/songDetails/" + arrangements[0].songDetailId, "ContentApi");
        setSongDetail(songDetail);
      }
    }
  }, [params.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectArrangement = useCallback((arrangementId: string) => {
      const arr = ArrayHelper.getOne(arrangements, "id", arrangementId);
      setSelectedArrangement(arr);
    }, [arrangements]);

  const handleAdd = useCallback(async (songDetail: SongDetailInterface) => {
      if (!song?.id) return;
      const a: ArrangementInterface = {
        songId: song.id,
        songDetailId: songDetail.id,
        name: songDetail.artist,
        lyrics: "",
      };
      await ApiHelper.post("/arrangements", [a], "ContentApi");
      if (songDetail.keySignature) {
        const key: ArrangementKeyInterface = { arrangementId: a.id, keySignature: songDetail.keySignature, shortDescription: "Default" };
        await ApiHelper.post("/arrangementKeys", [key], "ContentApi");
      }
      loadData();
      setShowSearch(false);
    }, [song?.id, loadData]);

  const arrangementNavigation = useMemo(() => (
      <Card sx={{ height: "fit-content", borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <MusicIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
              Arrangements
            </Typography>
          </Stack>

          <List sx={{ p: 0 }}>
            {arrangements.map((arrangement, index) => (
              <Box key={arrangement.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemButton
                    selected={selectedArrangement?.id === arrangement.id}
                    onClick={() => selectArrangement(arrangement.id)}
                    sx={{
                      borderRadius: 1,
                      "&.Mui-selected": {
                        backgroundColor: "primary.light",
                        "&:hover": { backgroundColor: "primary.light" },
                      },
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ArrangementIcon sx={{ color: selectedArrangement?.id === arrangement.id ? "primary.main" : "text.secondary" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={arrangement.name}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: selectedArrangement?.id === arrangement.id ? 600 : 400,
                          color: selectedArrangement?.id === arrangement.id ? "primary.main" : "text.primary",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < arrangements.length - 1 && <Divider sx={{ my: 0.5 }} />}
              </Box>
            ))}
          </List>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowSearch(true)}
            fullWidth
            sx={{
              mt: 2,
              borderStyle: "dashed",
              color: "text.secondary",
              borderColor: "grey.400",
              "&:hover": {
                borderColor: "primary.main",
                color: "primary.main",
                backgroundColor: "primary.light",
              },
            }}
          >
            Add Arrangement
          </Button>
        </CardContent>
      </Card>
    ), [arrangements, selectedArrangement, selectArrangement]);

  const currentContent = useMemo(() => {
    if (!selectedArrangement) {
      return (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "grey.50",
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          <ArrangementIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Arrangement Selected
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select an arrangement from the sidebar to get started.
          </Typography>
        </Paper>
      );
    }

    return <Arrangement arrangement={selectedArrangement} reload={loadData} />;
  }, [selectedArrangement, loadData]);

  const formatSeconds = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }, []);

  return (
    <>
      {/* Modern Blue Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: "flex-start", md: "center" }} sx={{ width: "100%" }}>
          {/* Left side: Album Art, Title and Details */}
          <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
            {/* Album Art */}
            <Avatar
              src={songDetail?.thumbnail}
              sx={{
                width: 80,
                height: 80,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <MusicIcon sx={{ fontSize: 40, color: "#FFF" }} />
            </Avatar>

            {/* Song Info */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                }}
              >
                {songDetail?.title || song?.name || "Loading..."}
              </Typography>

              {/* Song Stats - All Details */}
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1, gap: 1 }}>
                {songDetail?.artist && (
                  <Chip
                    icon={<ArtistIcon />}
                    label={songDetail.artist}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail?.album && (
                  <Chip
                    icon={<AlbumIcon />}
                    label={songDetail.album}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail?.releaseDate && (
                  <Chip
                    icon={<DateIcon />}
                    label={new Date(songDetail.releaseDate).toLocaleDateString()}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail?.language && (
                  <Chip
                    icon={<LanguageIcon />}
                    label={songDetail.language}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail?.seconds && (
                  <Chip
                    icon={<TimerIcon />}
                    label={formatSeconds(songDetail.seconds)}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail?.keySignature && (
                  <Chip
                    icon={<KeyIcon />}
                    label={`Key: ${songDetail.keySignature}`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail?.tones && (
                  <Chip
                    icon={<NoteIcon />}
                    label={`Tones: ${songDetail.tones}`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail?.meter && (
                  <Chip
                    icon={<TimeIcon />}
                    label={`Meter: ${songDetail.meter}`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}

                {songDetail?.bpm && (
                  <Chip
                    icon={<BpmIcon />}
                    label={`${songDetail.bpm} BPM`}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#FFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Right side: Action Buttons */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexShrink: 0,
              justifyContent: { xs: "flex-start", md: "flex-end" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditSongDetails(true)}
              sx={{
                color: "#FFF",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
              title="Edit Song Details"
            >
              Edit Details
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowSearch(true)}
              sx={{
                color: "#FFF",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Add Arrangement
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {editSongDetails ? (
          <SongDetailsEdit
            songDetail={songDetail}
            onCancel={() => setEditSongDetails(false)}
            onSave={() => {
              setEditSongDetails(false);
              loadData();
            }}
            reload={loadData}
          />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>{arrangementNavigation}</Grid>

            <Grid size={{ xs: 12, md: 9 }}>{currentContent}</Grid>
          </Grid>
        )}
      </Box>

      {showSearch && <SongSearchDialog searchText={song?.name} onClose={() => setShowSearch(false)} onSelect={handleAdd} />}
    </>
  );
});
