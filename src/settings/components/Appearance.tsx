import React, { useState } from "react";
import { ApiHelper, AppearanceEdit, DisplayBox, GenericSettingInterface } from "."
import { AppearanceHelper, AppearanceInterface } from "../../appBase/helpers"

interface Props { }

export const Appearance: React.FC<Props> = (props) => {
  const [currentSettings, setCurrentSettings] = useState<GenericSettingInterface[]>([]);
  const [mode, setMode] = useState("display");
  const [styles, setStyles] = useState<AppearanceInterface>({});

  const loadData = () => { ApiHelper.get("/settings", "MembershipApi").then(settings => { setCurrentSettings(settings); configureStyles(settings) }) }
  const handleEdit = () => { setMode("edit"); }
  const handleUpdate = () => { setMode("display"); loadData(); }

  const getLogo = (logoName: string) => {
    const logoSrc = (logoName === "logoLight")
      ? AppearanceHelper.getLogoLight(styles, "/images/sample-logo-header.png")
      : AppearanceHelper.getLogoDark(styles, "/images/sample-logo-header.png");
    let logoImg = (styles && logoSrc !== null && logoSrc !== undefined) ? <img src={logoSrc} alt="logo" /> : null;
    return logoImg
  }

  const getDefaultStyles = () => ({
    primaryColor: "#08A0CC",
    primaryContrast: "#FFFFFF",
    secondaryColor: "#FFBA1A",
    secondaryContrast: "#000000"
  })

  const configureStyles = (settings: GenericSettingInterface[]) => {
    let style: any = getDefaultStyles();
    settings.map(s => { style[s.keyName] = s.value; return null });
    setStyles(style);
  }

  React.useEffect(loadData, []); //eslint-disable-line

  if (mode === "edit") return (<AppearanceEdit settings={currentSettings} updatedFunction={handleUpdate} />)
  else return (
    <DisplayBox headerIcon="palette" headerText="Church Appearance" editFunction={handleEdit}>

      <div style={{ padding: 10, fontWeight: "bold", textAlign: "center", backgroundColor: "#EEE" }}>
        {getLogo("logoLight")}
      </div>

      <div style={{ padding: 10, fontWeight: "bold", textAlign: "center", backgroundColor: "#333", color: "#FFF" }}>
        {getLogo("logoDark")}
      </div>

      <div style={{ backgroundColor: styles.primaryColor, color: styles.primaryContrast, padding: 5, fontWeight: "bold" }}>
        Primary Colors
      </div>
      <div style={{ backgroundColor: styles.secondaryColor, color: styles.secondaryContrast, padding: 5, fontWeight: "bold" }}>
        Secondary Colors
      </div>

    </DisplayBox>
  );
}
