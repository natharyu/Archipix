import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import { useEffect, useState } from "react";
/**
 * Component to display the icon of a file based on its extension.
 * @param {string} ext - file extension
 * @returns {JSX.Element} Icon of the file
 */
function FileIcon({ ext }) {
  // List of image file extensions
  const imageExt = [
    "ase",
    "art",
    "bmp",
    "blp",
    "cd5",
    "cit",
    "cpt",
    "cr2",
    "cut",
    "dds",
    "dib",
    "djvu",
    "egt",
    "exif",
    "gif",
    "gpl",
    "grf",
    "icns",
    "ico",
    "iff",
    "jng",
    "jpeg",
    "jpg",
    "jfif",
    "jp2",
    "jps",
    "lbm",
    "max",
    "miff",
    "mng",
    "msp",
    "nef",
    "nitf",
    "ota",
    "pbm",
    "pc1",
    "pc2",
    "pc3",
    "pcf",
    "pcx",
    "pdn",
    "pgm",
    "PI1",
    "PI2",
    "PI3",
    "pict",
    "pct",
    "pnm",
    "pns",
    "ppm",
    "psb",
    "psd",
    "pdd",
    "psp",
    "px",
    "pxm",
    "pxr",
    "qfx",
    "raw",
    "rle",
    "sct",
    "sgi",
    "rgb",
    "int",
    "bw",
    "tga",
    "tiff",
    "tif",
    "vtf",
    "xbm",
    "xcf",
    "xpm",
    "3dv",
    "amf",
    "ai",
    "awg",
    "cgm",
    "cdr",
    "cmx",
    "dxf",
    "e2d",
    "egt",
    "eps",
    "fs",
    "gbr",
    "odg",
    "svg",
    "stl",
    "vrml",
    "x3d",
    "sxd",
    "v2d",
    "vnd",
    "wmf",
    "emf",
    "art",
    "xar",
    "png",
    "webp",
    "jxr",
    "hdp",
    "wdp",
    "cur",
    "ecw",
    "iff",
    "lbm",
    "liff",
    "nrrd",
    "pam",
    "pcx",
    "pgf",
    "sgi",
    "rgb",
    "rgba",
    "bw",
    "int",
    "inta",
    "sid",
    "ras",
    "sun",
    "tga",
    "heic",
    "heif",
  ];
  // List of video file extensions
  const videoExt = [
    "3g2",
    "3gp",
    "aaf",
    "asf",
    "avchd",
    "avi",
    "drc",
    "flv",
    "m2v",
    "m3u8",
    "m4p",
    "m4v",
    "mkv",
    "mng",
    "mov",
    "mp2",
    "mp4",
    "mpe",
    "mpeg",
    "mpg",
    "mpv",
    "mxf",
    "nsv",
    "ogg",
    "ogv",
    "qt",
    "rm",
    "rmvb",
    "roq",
    "svi",
    "vob",
    "webm",
    "wmv",
    "yuv",
  ];

  // State to hold the type of file icon to display
  const [icon, setIcon] = useState("");

  // Function to get the icon based on the extension
  /**
   * Get the icon of the file based on its extension
   * @param {string} ext - file extension
   */
  const getIcon = (ext) => {
    if (ext) {
      const extLower = ext.toLowerCase();
      if (imageExt.includes(extLower)) {
        return setIcon("image");
      }
      if (videoExt.includes(extLower)) {
        return setIcon("video");
      }
      return setIcon("other");
    }
  };

  // UseEffect hook to call the getIcon function on first render
  useEffect(() => {
    getIcon(ext);
  }, []);

  return (
    // Use a ternary operator to conditionally return the correct icon
    <>
      {(() => {
        switch (icon) {
          case "image":
            return <ImageIcon className="icon" />;
          case "video":
            return <VideoFileIcon className="icon" />;
          default:
            return <InsertDriveFileIcon className="icon" />;
        }
      })()}
    </>
  );
}

export default FileIcon;
