import { Grid, TextField } from "@mui/material";
import React from "react";
import { InputBox, ApiHelper, ImageEditor, GenericSettingInterface, ArrayHelper } from "."

interface Props {
  updatedFunction?: () => void,
  settings?: GenericSettingInterface[],
}

export const AppearanceEdit: React.FC<Props> = (props) => {
  const [currentSettings, setCurrentSettings] = React.useState<GenericSettingInterface[]>([]);
  const [editLogo, setEditLogo] = React.useState(false);
  const [currentEditLogo, setCurrentEditLogo] = React.useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const settings = [...currentSettings]
    const keySetting = settings.filter(c => c.keyName === name);

    if (keySetting.length === 0) {
      settings.push({ keyName: name, value, public: 1 });
    } else {
      keySetting[0].value = value;
    }

    setCurrentSettings(settings);
  }

  const imageUpdated = (dataUrl: string, keyName: string) => {
    if (dataUrl !== null) {
      const settings = [...currentSettings];
      const keySetting = settings.filter(s => s.keyName === keyName);

      if (keySetting.length === 0) {
        settings.push({ keyName, value: dataUrl, public: 1 });
      } else {
        keySetting[0].value = dataUrl;
      }

      setCurrentSettings(settings);
    }
    setEditLogo(false);
  }

  const getLogoEditor = (logoName: string) => {
    if (!editLogo) return null;
    else return <ImageEditor settings={currentSettings} name={logoName} updatedFunction={(dataUrl) => imageUpdated(dataUrl, logoName)} aspectRatio={4} />
  }

  const getLogoLink = (name: string, backgroundColor: string) => {
    const logoImage = ArrayHelper.getOne(currentSettings, "keyName", name)
    let logoImg = (currentSettings && logoImage !== null) ? <img src={logoImage.value} alt="logo" style={{ backgroundColor: backgroundColor }} /> : "none";
    return <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditLogo(true); setCurrentEditLogo(name) }}>{logoImg}</a>
  }

  const handleSave = () => { ApiHelper.post("/settings", currentSettings, "MembershipApi").then(props.updatedFunction); }
  const handleCancel = () => { props.updatedFunction(); }

  React.useEffect(() => { setCurrentSettings(props.settings); }, [props.settings]);

  return (
    <>
      {getLogoEditor(currentEditLogo)}
      <InputBox headerIcon="palette" headerText="Church Appearance" saveFunction={handleSave} cancelFunction={handleCancel}>
        <div style={{ backgroundColor: "#EEE", padding: 10 }}>

          <label>Logo - Light background</label><br />
          <p style={{ color: "#999", fontSize: 12 }}>Upload horizontal logo with a transparent background suitable for use of light backrounds. The ideal size is 1280 pixels wide by 320 pixels high.</p>
          {getLogoLink("logoLight", "#EEE")}

        </div>
        <hr />
        <div style={{ backgroundColor: "#333", padding: 10, color: "#FFF" }}>

          <label>Logo - Dark background</label><br />
          <p style={{ color: "#999", fontSize: 12 }}>Upload horizontal logo with a transparent background suitable for use of dark backrounds. The ideal size is 1280 pixels wide by 320 pixels high.</p>
          {getLogoLink("logoDark", "#333")}

        </div>
        <hr />
        <div className="section">Primary Colors</div>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField type="color" label="Color" fullWidth name="primaryColor" value={(ArrayHelper.getOne(currentSettings, "keyName", "primaryColor"))?.value || "#08A0CC"} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField type="color" label="Contrast" fullWidth name="primaryContrast" value={(ArrayHelper.getOne(currentSettings, "keyName", "primaryContrast"))?.value || "#FFFFFF"} onChange={handleChange} />
          </Grid>
        </Grid>
        <div className="section">Secondary Colors</div>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField type="color" label="Color" fullWidth name="secondaryColor" value={(ArrayHelper.getOne(currentSettings, "keyName", "secondaryColor"))?.value || "#FFBA1A"} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField type="color" label="Contrast" fullWidth name="secondaryContrast" value={(ArrayHelper.getOne(currentSettings, "keyName", "secondaryContrast"))?.value || "#000000"} onChange={handleChange} />
          </Grid>
        </Grid>
      </InputBox>
    </>
  );
}
