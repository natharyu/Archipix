import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { formatBytes, formatDuration } from "react-dropzone-uploader/dist/utils";

/**
 * Component to display preview of uploaded/uploading file.
 * @param {object} props Component props
 * @param {object} props.fileWithMeta Contains `cancel`, `remove`, `restart` methods
 * to interact with the file
 * @param {object} props.meta File metadata
 * @param {string} props.meta.name File name
 * @param {number} props.meta.percent Upload progress in %
 * @param {number} props.meta.size File size in bytes
 * @param {string} props.meta.previewUrl File preview URL if supported
 * @param {string} props.meta.status File status
 * @param {number} props.meta.duration Duration of the file if an audio/video
 * @param {string|Error} props.meta.validationError Error occurred during validation
 * @param {boolean} props.isUpload Indicates if file is currently uploading
 * @param {boolean} props.canCancel Indicates if cancellation is possible
 * @param {boolean} props.canRemove Indicates if file can be removed
 * @param {boolean} props.canRestart Indicates if file can be restarted
 * @param {object} props.extra Extra props from parent dropzone
 * @param {number} props.extra.minSizeBytes Minimum file size to be uploaded
 */
function Preview(props) {
  const {
    fileWithMeta: { cancel, remove, restart },
    meta: { name = "", percent = 0, size = 0, previewUrl, status, duration, validationError },
    isUpload,
    canCancel,
    canRemove,
    canRestart,
    extra: { minSizeBytes },
  } = props;
  let title = `${name || "?"}, ${formatBytes(size)}`;
  if (duration) title = `${title}, ${formatDuration(duration)}`;

  if (status === "error_file_size" || status === "error_validation") {
    /**
     * Display error message if file failed validation
     */
    return (
      <div className="preview-error">
        <span>{title}</span>
        {status === "error_file_size" && <span>{size < minSizeBytes ? "File too small" : "File too big"}</span>}
        {status === "error_validation" && <span>{String(validationError)}</span>}
        {canRemove && (
          <span onClick={remove}>
            <ClearIcon />
          </span>
        )}
      </div>
    );
  }

  if (status === "error_upload_params" || status === "exception_upload" || status === "error_upload") {
    /**
     * Display upload error message
     */
    title = `${title} (upload failed)`;
  }
  if (status === "aborted") {
    /**
     * Display cancellation message
     */
    title = `${title} (cancelled)`;
  }

  return (
    <div className="preview">
      {/**
       * Display file preview image or file name
       */}
      {previewUrl && <img className="img-preview" src={previewUrl} alt={title} title={title} />}
      {!previewUrl && <span className="name-preview">{title}</span>}

      <div className="status-preview">
        {/**
         * Display upload progress bar or file size
         */}
        {isUpload && <progress max={100} value={status === "done" || status === "headers_received" ? 100 : percent} />}
        {!isUpload && <span>{formatBytes(size)}</span>}

        {/**
         * Display cancel, remove and restart buttons
         */}
        {status === "uploading" && canCancel && (
          <span onClick={cancel}>
            <CancelIcon />
          </span>
        )}
        {status !== "preparing" && status !== "getting_upload_params" && status !== "uploading" && canRemove && (
          <span onClick={remove}>
            <ClearIcon />
          </span>
        )}
        {["error_upload_params", "exception_upload", "error_upload", "aborted", "ready"].includes(status) &&
          canRestart && (
            <span onClick={restart}>
              <RestartAltIcon />
            </span>
          )}
      </div>
    </div>
  );
}

export default Preview;
