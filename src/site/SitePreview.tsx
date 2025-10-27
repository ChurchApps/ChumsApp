import React, { useEffect, useState, CSSProperties } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Container, Typography, CssBaseline } from "@mui/material";
import { ApiHelper } from "@churchapps/apphelper";
import { Theme, Element, YoutubeBackground } from "@churchapps/apphelper-website";
import { StyleHelper } from "../helpers/StyleHelper";
import type { PageInterface, SectionInterface, GlobalStyleInterface } from "../helpers/Interfaces";
import { CuratedCalendar } from "../calendars/components/CuratedCalendar";
import { WebsiteHeader, WebsiteFooter } from "./components";

interface ElementRendererProps {
  element: any;
  churchId: string;
  churchSettings: any;
  textColor: string;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ element, churchId, churchSettings, textColor }) => {
  if (element.elementType === "calendar") {
    return (
      <div id={"el-" + element.id} style={{ backgroundColor: "white", padding: 50, borderRadius: 15 }}>
        <CuratedCalendar churchId={churchId} curatedCalendarId={element.answers?.calendarId} mode="view" />
      </div>
    );
  }
  return <Element element={element} churchSettings={churchSettings} textColor={textColor} />;
};

interface SectionProps {
  section: SectionInterface;
  first?: boolean;
  churchSettings: any;
  globalStyles: GlobalStyleInterface;
  churchId: string;
}

const SectionRenderer: React.FC<SectionProps> = ({ section, first, churchSettings, globalStyles, churchId }) => {
  const getElements = () => {
    const result: React.ReactElement[] = [];
    const textColor = StyleHelper.getTextColor(section?.textColor, globalStyles || {}, churchSettings);
    section?.elements?.forEach(e => {
      result.push(<ElementRenderer key={e.id} element={e} churchId={churchId} churchSettings={churchSettings} textColor={textColor} />);
    });
    return result;
  };

  const getStyle = (): CSSProperties => {
    let result: CSSProperties = {};
    if (section.background?.indexOf("/") > -1) {
      result = { backgroundImage: "url('" + section.background + "')" };
    } else {
      result = { background: section.background };
    }
    if (section.textColor?.startsWith("var(")) result.color = section.textColor;
    return result;
  };

  const getClassName = () => {
    let result = "section";
    if (section.background?.indexOf("/") > -1) result += " sectionBG";
    if (section.textColor === "light") result += " sectionDark";
    if (first) result += " sectionFirst";

    let hc = section.headingColor;
    if (hc) {
      hc = hc.replace("var(--", "").replace(")", "");
      result += " headings" + hc[0].toUpperCase() + hc.slice(1);
    }
    let lc = section.linkColor;
    if (lc) {
      lc = lc.replace("var(--", "").replace(")", "");
      result += " links" + lc[0].toUpperCase() + lc.slice(1);
    }
    return result;
  };

  const getVideoClassName = () => {
    let result = "sectionVideo";
    if (section.textColor === "light") result += " sectionDark";
    if (first) result += " sectionFirst";
    return result;
  };

  const getId = () => {
    let result = "section-" + section.answers?.sectionId?.toString();
    if (result === "section-undefined") result = "section-" + section.id;
    return result;
  };

  const getSectionAnchor = () => {
    if (section.answers?.sectionId) return <a id={section.answers?.sectionId} className="sectionAnchor"></a>;
    else return <></>;
  };

  const contents = <Container>{getElements()}</Container>;

  if (section.background && section.background.indexOf("youtube:") > -1) {
    const youtubeId = section.background.split(":")[1];
    return (
      <>
        {getSectionAnchor()}
        <YoutubeBackground isDragging={false} id={getId()} videoId={youtubeId} overlay="rgba(0,0,0,.4)" contentClassName={getVideoClassName()}>
          {contents}
        </YoutubeBackground>
      </>
    );
  } else {
    return (
      <>
        {getSectionAnchor()}
        <Box component="div" sx={{ ":before": { opacity: (section.answers?.backgroundOpacity) ? section.answers.backgroundOpacity + " !important" : "" } }} style={getStyle()} className={getClassName()} id={getId()}>
          {contents}
        </Box>
      </>
    );
  }
};

export const SitePreview: React.FC = () => {
  const { churchId } = useParams<{ churchId: string }>();
  const location = useLocation();
  const [pageData, setPageData] = useState<PageInterface | null>(null);
  const [churchSettings, setChurchSettings] = useState<any>(null);
  const [church, setChurch] = useState<any>(null);
  const [globalStyles, setGlobalStyles] = useState<GlobalStyleInterface | null>(null);
  const [navLinks, setNavLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!churchId) return;

      const pathParts = location.pathname.split("/");
      const churchIdIndex = pathParts.indexOf(churchId);
      const pageUrl = "/" + pathParts.slice(churchIdIndex + 1).join("/");

      setLoading(true);
      setError(null);

      try {
        const [page, settings, styles, links, churchData] = await Promise.all([
          ApiHelper.getAnonymous(`/pages/${churchId}/tree?url=${pageUrl}`, "ContentApi"),
          ApiHelper.getAnonymous(`/settings/public/${churchId}`, "MembershipApi"),
          ApiHelper.getAnonymous("/globalStyles", "ContentApi"),
          ApiHelper.getAnonymous(`/links/church/${churchId}?category=website`, "ContentApi"),
          ApiHelper.getAnonymous(`/churches/${churchId}`, "MembershipApi")
        ]);

        setPageData(page);
        setChurchSettings(settings);
        setGlobalStyles(styles);
        setNavLinks(links);
        setChurch(churchData);
      } catch (err: any) {
        console.error("Error loading page data:", err);
        setError(err.message || "Failed to load page data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [churchId, location.pathname]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!pageData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Page not found</Typography>
      </Box>
    );
  }

  const mainSections = pageData.sections?.filter(s => s.zone === "main") || [];
  const footerSections = pageData.sections?.filter(s => s.zone === "siteFooter") || [];
  const css = StyleHelper.getCss([...mainSections, ...footerSections]);
  const overlayContent = pageData.url === "/";

  return (
    <>
      <CssBaseline />
      <Theme globalStyles={globalStyles} appearance={churchSettings} />
      <style>{css}</style>
      <WebsiteHeader church={church} appearance={churchSettings} globalStyles={globalStyles} navLinks={navLinks} overlayContent={overlayContent} sections={mainSections} />
      <main>
        <div className="page">
          {mainSections.map((section, index) => (
            <SectionRenderer key={section.id} section={section} first={index === 0} churchSettings={churchSettings} globalStyles={globalStyles} churchId={churchId!} />
          ))}
        </div>
      </main>
      <WebsiteFooter church={church} appearance={churchSettings} globalStyles={globalStyles} footerSections={footerSections} />
    </>
  );
};
