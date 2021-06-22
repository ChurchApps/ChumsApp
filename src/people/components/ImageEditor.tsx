import React, { useCallback } from "react";
import { InputBox, PersonHelper, PersonInterface } from ".";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "react-bootstrap";

interface Props {
    person: PersonInterface,
    updatedFunction: (dataUrl: string) => void,
}

export const ImageEditor = ({ person, updatedFunction }: Props) => {
  const [originalUrl, setOriginalUrl] = React.useState("about:blank");
  const [currentUrl, setCurrentUrl] = React.useState("about:blank");
  const [dataUrl, setDataUrl] = React.useState(null);
  let timeout: any = null;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let files;
    if (e.target) files = e.target.files;
    const reader = new FileReader();
    reader.onload = () => {
      let url = reader.result.toString();
      setCurrentUrl(url);
      setDataUrl(url);
    };
    reader.readAsDataURL(files[0]);
  }

  const getHeaderButton = () => (<div>
    <input type="file" onChange={handleUpload} id="fileUpload" accept="image/*" style={{ display: "none" }} />
    <Button size="sm" variant="info" onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById("fileUpload").click(); }}>Upload</Button>
  </div>)

  const cropper = React.useRef(null);

  const cropCallback = () => {
    if (cropper.current !== null) {
      let url = cropper.current.getCroppedCanvas({ width: 400, height: 300 }).toDataURL();
      setDataUrl(url);
    }
  }

  const handleCrop = () => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
      timeout = null;
    }
    timeout = window.setTimeout(cropCallback, 200);
  }

  const handleSave = () => updatedFunction(dataUrl);
  const handleCancel = () => updatedFunction(originalUrl);
  const handleDelete = () => updatedFunction("");

  const init = useCallback(() => {
    let startingUrl = PersonHelper.getPhotoUrl(person)
    setOriginalUrl(startingUrl);
    setCurrentUrl(startingUrl);
  }, [person]);

  React.useEffect(init, [person]);

  return (
    <InputBox id="cropperBox" headerIcon="" headerText="Crop" saveFunction={handleSave} saveText={"Update"} cancelFunction={handleCancel} deleteFunction={handleDelete} headerActionContent={getHeaderButton()}>
      <Cropper
        ref={cropper}
        src={currentUrl}
        style={{ height: 240, width: "100%" }}
        aspectRatio={4 / 3}
        guides={false}
        crop={handleCrop} />
    </InputBox>
  );
}

