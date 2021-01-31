import Papa from 'papaparse';
import AdmZip from 'adm-zip';
import FileSaver from 'file-saver';

export class UploadHelper {

    static zipFiles(files: { name: string, contents: string | Buffer }[], zipFileName: string) {
        var zip = new AdmZip();
        files.forEach((f) => {
            if (typeof f.contents === "string") zip.addFile(f.name, Buffer.alloc(f.contents.length, f.contents));
            else zip.addFile(f.name, f.contents as Buffer);
        });
        var buffer = zip.toBuffer();
        var blob = new Blob([buffer], { type: 'applicatoin/zip' });
        FileSaver.saveAs(blob, zipFileName);
    }

    static downloadImageBytes(files: { name: string, contents: string | Buffer }[], name: string, url: string) {
        return new Promise<void>((resolve, reject) => {
            try {
                var oReq = new XMLHttpRequest();
                oReq.open("GET", url, true);
                oReq.responseType = "blob";
                oReq.onload = async () => {
                    const blob = new Blob([oReq.response], { type: 'image/png' });
                    var buffer = this.toBuffer(await blob.arrayBuffer());
                    files.push({ name: name, contents: buffer });
                    resolve();
                };
                oReq.send();
            } catch {
                reject(new DOMException("Could not download image."));
            }
        });
    }

    static toBuffer(ab: ArrayBuffer) {
        var buffer = new Buffer(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) buffer[i] = view[i];
        return buffer;
    }

    static async getCsv(files: FileList, fileName: string) {
        var file = this.getFile(files, fileName);
        if (file !== null) return await this.readCsv(file);
        else return null;
    }

    static readCsvString(csv: string) {
        var result = [];
        var data = Papa.parse(csv, { header: true });
        for (let i = 0; i < data.data.length; i++) {
            var r: any = this.getStrippedRecord(data.data[i]);
            result.push(r);
        }
        return result;
    }

    static readCsv(file: File) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                var result = [];
                var csv = reader.result.toString();
                var data = Papa.parse(csv, { header: true });

                for (let i = 0; i < data.data.length; i++) {
                    var r: any = this.getStrippedRecord(data.data[i]);
                    result.push(r);
                }
                resolve(result);
            };
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException("Problem parsing input file."));
            };
            reader.readAsText(file);
        });
    }

    static getFile(files: FileList, fileName: string) {
        for (let i = 0; i < files.length; i++) if (files[i].name === fileName) return files[i];
        return null;
    }

    static readBinary(file: File) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => { resolve(reader.result.toString()); };
            reader.onerror = () => { reject(new DOMException("Error reading image")) }
            reader.readAsArrayBuffer(file);
        });
    }

    static getZippedFile(files: AdmZip.IZipEntry[], name: string) {
        for (let i = 0; i < files.length; i++) if (files[i].entryName === name) return files[i];
        return null;
    }

    static readZippedCsv(files: AdmZip.IZipEntry[], name: string) {
        var f = this.getZippedFile(files, name);
        if (f === null) return [];
        var txt = f.getData().toString();
        var cleanedText = txt.trim(); // .substr(1, txt.length - 2); //sof and eof chars
        return UploadHelper.readCsvString(cleanedText)
    }


    static readZippedImage(files: AdmZip.IZipEntry[], photoUrl: string) {
        return new Promise<string>((resolve, reject) => {
            var file = this.getZippedFile(files, photoUrl);
            if (file === null) reject(new DOMException("Did not find image"));
            else {
                var buffer = file.getData();
                resolve('data:image/png;base64,' + buffer.toString('base64'));
            }
        });
    }

    static readImage(files: FileList, photoUrl: string) {
        return new Promise<string>((resolve, reject) => {
            var match = false;
            for (let i = 0; i < files.length; i++) {
                if (files[i].name === photoUrl) {
                    const reader = new FileReader();
                    reader.onload = () => { resolve(reader.result.toString()); };
                    reader.onerror = () => { reject(new DOMException("Error reading image")) }
                    reader.readAsDataURL(files[i]);
                }
            }
            if (match) reject(new DOMException("Did not find image"));
        });
    }

    static getStrippedRecord(r: any) {
        var names = Object.getOwnPropertyNames(r)
        for (let j = names.length - 1; j >= 0; j--) {
            var n = names[j];
            if (r[n] === '') delete r[n];
        }
        return r;
    }

}