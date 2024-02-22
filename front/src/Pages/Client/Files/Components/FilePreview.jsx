import { useSelector } from "react-redux";
const FilePreview = () => {
  const { currentFile } = useSelector((state) => state.file);
  const { rootFolder } = useSelector((state) => state.folder);
  return (
    <div>
      {currentFile?.type.includes("image") ? (
        <img src={`/api/v1/file/${rootFolder}/tmp/${currentFile.label}`} alt="Preview" />
      ) : (
        <div>
          <h1>No preview</h1>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
