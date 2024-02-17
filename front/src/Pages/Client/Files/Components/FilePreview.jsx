import { useSelector } from "react-redux";
const FilePreview = () => {
  const { currentFile } = useSelector((state) => state.file);
  return (
    <div>
      {currentFile?.label ? (
        <img src={`http://localhost:3000/tmp/${currentFile.label}`} alt="Preview" />
      ) : (
        <div>
          <h1>No preview</h1>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
