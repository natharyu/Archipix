import { useSelector } from "react-redux";
const FilePreview = () => {
  const { currentFile } = useSelector((state) => state.file);
  const { rootFolder } = useSelector((state) => state.folder);

  return (
    <div>
      {currentFile?.type.includes("image") && (
        <img src={`/api/v1/file/${rootFolder}/tmp/${currentFile.label}`} alt="Preview" />
      )}

      {currentFile?.type.includes("video") && (
        <video src={`/api/v1/file/${rootFolder}/tmp/${currentFile.label}`} controls />
      )}
    </div>
  );
};

export default FilePreview;
