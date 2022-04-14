import React, { useEffect } from "react";
import { InputBox, PersonHelper, PersonInterface } from ".";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "react-bootstrap";

interface Props {
  person: PersonInterface,
  updatedFunction: (dataUrl: string) => void,
  onCancel: () => void
}

export const ImageEditor = ({ person, updatedFunction, onCancel }: Props) => {
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

  const cropperRef = React.useRef<HTMLImageElement>(null);

  const cropCallback = () => {
    if (cropperRef.current !== null) {
      const imageElement: any = cropperRef?.current;
      const cropper: any = imageElement?.cropper;
      let url = cropper.getCroppedCanvas({ width: 400, height: 300 }).toDataURL();
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
  const handleDelete = () => updatedFunction("");

  useEffect(() => {
    setCurrentUrl(PersonHelper.getPhotoUrl(person))
  }, [person]);

  return (
    <InputBox id="cropperBox" headerIcon="" headerText="Crop" saveFunction={handleSave} ariaLabelDelete="deletePhoto" saveText={"Update"} cancelFunction={onCancel} deleteFunction={handleDelete} headerActionContent={getHeaderButton()}>
      <Cropper
        ref={cropperRef}
        src={currentUrl}
        style={{ height: 240, width: "100%" }}
        aspectRatio={4 / 3}
        guides={false}
        crop={handleCrop} />
    </InputBox>
  );
}

