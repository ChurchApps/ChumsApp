import React from "react";
// import { UserHelper, EnvironmentHelper } from ".";

interface Props { ts: number }
export const Preview: React.FC<Props> = (props) => (
  <div className="inputBox">
    <div className="header"><i className="calendar_month"></i> Preview</div>
    <div className="content">
      <div id="previewWrapper">
        {/* <iframe id="previewFrame" src={EnvironmentHelper.SubUrl.replace("{key}", UserHelper.currentChurch.subDomain) + "/?preview=1&ts=" + props.ts} title="Preview" ></iframe> */}
      </div>
      {/* <p style={{ marginTop: 10, marginBottom: 10 }}>View your live site: <a href={EnvironmentHelper.SubUrl.replace("{key}", UserHelper.currentChurch.subDomain) + "/"} target="_blank" rel="noopener noreferrer" >{EnvironmentHelper.SubUrl.replace("{key}", UserHelper.currentChurch.subDomain) + "/"}</a></p> */}
    </div>
  </div>
)
