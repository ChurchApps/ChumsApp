import React, { memo, useMemo, useCallback } from "react";
import { ApiHelper, Loading, Locale } from "@churchapps/apphelper";
import { Link, Navigate } from "react-router-dom";
import {
 Button, Box, Card, CardContent, Typography, Stack, Avatar, Paper, Chip, IconButton, TextField, InputAdornment 
} from "@mui/material";
import { MusicNote as MusicIcon, LibraryMusic as LibraryIcon, Add as AddIcon, Search as SearchIcon, PlayCircle as PlayIcon, Timer as TimerIcon, Person as ArtistIcon } from "@mui/icons-material";
import { SongSearchDialog } from "./SongSearchDialog";
import { type ArrangementInterface, type ArrangementKeyInterface, type SongDetailInterface, type SongInterface } from "../../helpers";
import { useQuery } from "@tanstack/react-query";

export const SongsPage = memo(() => {
  const [showSearch, setShowSearch] = React.useState(false);
  const [redirect, setRedirect] = React.useState("");
  const [searchFilter, setSearchFilter] = React.useState("");
  const [showSearchField, setShowSearchField] = React.useState(false);
  const [failedImages, setFailedImages] = React.useState<Set<string>>(new Set());

  const songs = useQuery<SongDetailInterface[]>({
    queryKey: ["/songDetails", "ContentApi"],
    placeholderData: [],
  });

  const handleAdd = useCallback(async (songDetail: SongDetailInterface) => {
      let selectedSong = null;
      if (!songDetail.id) {
        songDetail = await ApiHelper.post("/songDetails/create", songDetail, "ContentApi");
      }

      const existing = await ApiHelper.get("/arrangements/songDetail/" + songDetail.id, "ContentApi");
      if (existing.length > 0) {
        const song = await ApiHelper.get("/songs/" + existing[0].songId, "ContentApi");
        selectedSong = song;
      } else {
        const s: SongInterface = { name: songDetail.title, dateAdded: new Date() };
        const songs = await ApiHelper.post("/songs", [s], "ContentApi");
        const a: ArrangementInterface = {
          songId: songs[0].id,
          songDetailId: songDetail.id,
          name: "(Default)",
          lyrics: "",
        };
        const arrangements = await ApiHelper.post("/arrangements", [a], "ContentApi");
        if (songDetail.keySignature) {
          const key: ArrangementKeyInterface = {
            arrangementId: arrangements[0].id,
            keySignature: songDetail.keySignature,
            shortDescription: "Default",
          };
          await ApiHelper.post("/arrangementKeys", [key], "ContentApi");
        }
        selectedSong = songs[0];
      }

      songs.refetch();
      setShowSearch(false);
      setRedirect("/plans/songs/" + selectedSong.id);
    }, [songs]);


  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgSrc = e.currentTarget.src;
    setFailedImages(prev => new Set(prev).add(imgSrc));
  }, []);

  // Get the first song with album art for the header
  const headerAlbumArt = useMemo(() => {
    if (!songs.data || songs.data.length === 0) return null;
    const songWithThumbnail = songs.data.find((song) => song.thumbnail && !failedImages.has(song.thumbnail));
    return songWithThumbnail?.thumbnail || null;
  }, [songs.data, failedImages]);

  const formatSeconds = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }, []);

  const filteredSongs = useMemo(() => {
    if (!songs.data) return null;
    if (!searchFilter.trim()) return songs.data;

    const filter = searchFilter.toLowerCase();
    return songs.data.filter((song) => song.title?.toLowerCase().includes(filter) || song.artist?.toLowerCase().includes(filter));
  }, [songs.data, searchFilter]);

  const songsContent = useMemo(() => {
    if (songs.isLoading) return <Loading size="sm" />;

    if (songs.data.length === 0) {
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
          <LibraryIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {Locale.label("songs.library.empty.title") || "No Songs Found"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {Locale.label("songs.library.empty.message") || "Get started by adding your first song to the library."}
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setShowSearch(true)} size="large">
            {Locale.label("songs.library.empty.action") || "Add First Song"}
          </Button>
        </Paper>
      );
    }

    if (filteredSongs && filteredSongs.length === 0) {
      return (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: "grey.50",
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          <SearchIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            {Locale.label("songs.library.noResults") || "No songs match your search criteria."}
          </Typography>
        </Paper>
      );
    }

    return (
      <Box
        sx={{
          "& .MuiCard-root": {
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
          },
        }}
      >
        <Stack spacing={2}>
          {filteredSongs?.map((songDetail) => (
            <Card
              key={songDetail.id}
              sx={{
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 2,
                },
              }}
            >
              <CardContent sx={{ pb: "16px !important" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Thumbnail/Avatar */}
                  <Avatar
                    src={songDetail.thumbnail && !failedImages.has(songDetail.thumbnail) ? songDetail.thumbnail : undefined}
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "primary.light",
                    }}
                    onError={handleImageError}
                  >
                    <MusicIcon sx={{ fontSize: 28, color: "primary.main" }} />
                  </Avatar>

                  {/* Song Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      component={Link}
                      to={`/plans/songs/${(songDetail as any).songId}`}
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        "&:hover": { textDecoration: "underline" },
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      {songDetail.title}
                    </Typography>

                    <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                      {songDetail.artist && (
                        <Chip
                          icon={<ArtistIcon />}
                          label={songDetail.artist}
                          variant="outlined"
                          size="small"
                          sx={{
                            color: "text.secondary",
                            borderColor: "grey.400",
                            fontSize: "0.75rem",
                          }}
                        />
                      )}

                      {songDetail.seconds && (
                        <Chip
                          icon={<TimerIcon />}
                          label={formatSeconds(songDetail.seconds)}
                          variant="outlined"
                          size="small"
                          sx={{
                            color: "text.secondary",
                            borderColor: "grey.400",
                            fontSize: "0.75rem",
                          }}
                        />
                      )}
                    </Stack>
                  </Box>

                  {/* Action Button */}
                  <IconButton
                    component={Link}
                    to={`/plans/songs/${(songDetail as any).songId}`}
                    sx={{
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "primary.light",
                        color: "primary.dark",
                      },
                    }}
                    aria-label={`Play ${songDetail.title}`}
                  >
                    <PlayIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }, [
songs.isLoading,
songs.data,
filteredSongs,
formatSeconds,
handleImageError,
failedImages
]);

  if (redirect) return <Navigate to={redirect} />;

  return (
    <>
      {/* Modern Blue Header */}
      <Box sx={{ backgroundColor: "var(--c1l2)", color: "#FFF", padding: "24px" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: "flex-start", md: "center" }} sx={{ width: "100%" }}>
          {/* Left side: Title and Icon/Album Art */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            {headerAlbumArt ? (
              <Avatar
                src={headerAlbumArt}
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "rgba(255,255,255,0.2)",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
                onError={handleImageError}
              >
                <LibraryIcon sx={{ fontSize: 32, color: "#FFF" }} />
              </Avatar>
            ) : (
              <Box
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LibraryIcon sx={{ fontSize: 32, color: "#FFF" }} />
              </Box>
            )}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: "1.75rem", md: "2.125rem" },
                }}
              >
                {Locale.label("songs.title") || "Songs"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Manage your song library and arrangements
              </Typography>
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
              startIcon={<SearchIcon />}
              onClick={() => setShowSearchField(!showSearchField)}
              sx={{
                color: "#FFF",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => setShowSearch(true)}
              variant="outlined"
              startIcon={<AddIcon />}
              data-testid="add-song-button"
              aria-label="Add song"
              sx={{
                color: "#FFF",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "#FFF",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {Locale.label("songs.addSong") || "Add Song"}
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        {(showSearchField || searchFilter) && songs.data && songs.data.length > 0 && (
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <CardContent sx={{ pb: "16px !important" }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <SearchIcon sx={{ color: "primary.main", fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                  Search Songs
                </Typography>
              </Stack>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={Locale.label("songs.search.placeholder") || "Search songs by title or artist..."}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                autoFocus={showSearchField}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "grey.50",
                    "&:hover": { backgroundColor: "#FFF" },
                    "&.Mui-focused": { backgroundColor: "#FFF" },
                  },
                }}
              />
            </CardContent>
          </Card>
        )}

        {songsContent}
      </Box>

      {showSearch && <SongSearchDialog onClose={() => setShowSearch(false)} onSelect={handleAdd} />}
    </>
  );
});
