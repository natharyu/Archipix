import { useSelector } from "react-redux";
const FilePreview = () => {
  const { currentFile } = useSelector((state) => state.file);

  const { path } = useSelector((state) => state.folder);

  return (
    <div>
      {currentFile?.type.includes("image") && (
        <img src={`/uploads/${path.join("/")}/${currentFile.label}`} alt="Preview" />
      )}

      {currentFile?.type.includes("video") && (
        <video src={`/uploads/${path.join("/")}/${currentFile.label}`} controls />
      )}
    </div>
  );
};

export default FilePreview;
