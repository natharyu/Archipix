import { useSelector } from "react-redux";
/**
 * FilePreview component
 *
 * This component displays a preview of the current file
 * being displayed in the file preview modal.
 *
 * @returns {JSX.Element} The FilePreview component
 */
const FilePreview = ({ setFilePreview }) => {
  const { currentFile } = useSelector((state) => state.file);
  const { path } = useSelector((state) => state.folder);

  return (
    <section id="file-preview">
      <article>
        <button className="close-file-preview" onClick={() => setFilePreview(false)}>
          Fermer
        </button>
        {/* If the file is an image, display an image tag */}
        {currentFile?.type.includes("image") && (
          <img
            src={`https://archipix.s3.eu-west-3.amazonaws.com/${path.join("/")}/${currentFile.label}`}
            alt="Preview"
          />
        )}

        {/* If the file is a video, display a video tag */}
        {currentFile?.type.includes("video") && (
          <video src={`https://archipix.s3.eu-west-3.amazonaws.com/${path.join("/")}/${currentFile.label}`} controls />
        )}
      </article>
    </section>
  );
};

export default FilePreview;
