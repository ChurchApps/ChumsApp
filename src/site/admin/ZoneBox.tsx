import { Chip } from "@mui/material";
import type { SectionInterface } from "../../helpers/Interfaces";

interface ZoneBoxProps {
  sections: SectionInterface[];
  name: string;
  keyName: string;
  deviceType: string;
  children: React.ReactNode;
}

export function ZoneBox(props: ZoneBoxProps) {
  const { keyName, deviceType, children } = props;

  return (
    <div key={"zone-" + keyName} style={{ minHeight: 100, position: "relative" }}>
      <div style={{
        position: "absolute",
        right: 16,
        top: 8,
        zIndex: 99,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)"
      }}>
        <Chip
          label={`Zone: ${keyName}`}
          size="small"
          sx={{
            backgroundColor: "rgba(25, 118, 210, 0.9)",
            color: "#ffffff",
            border: "1px solid rgba(25, 118, 210, 1)",
            fontWeight: 600,
            fontSize: "0.75rem",
            letterSpacing: "0.5px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(21, 101, 192, 0.95)",
            }
          }}
        />
      </div>
      <div style={{ minHeight: 100 }}>
        <>
          <div className="page" style={(deviceType === "mobile" ? { width: 400, marginLeft: "auto", marginRight: "auto" } : {})}>
            {children}
          </div>
        </>
      </div>
      <div style={{ height: "31px" }}></div>
    </div>
  );
}
