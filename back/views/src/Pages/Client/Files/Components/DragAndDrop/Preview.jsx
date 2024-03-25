import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { formatBytes, formatDuration } from "react-dropzone-uploader/dist/utils";

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
    title = `${title} (upload failed)`;
  }
  if (status === "aborted") title = `${title} (cancelled)`;

  return (
    <div className="preview">
      {previewUrl && <img className="img-preview" src={previewUrl} alt={title} title={title} />}
      {!previewUrl && <span className="name-preview">{title}</span>}

      <div className="status-preview">
        {isUpload && <progress max={100} value={status === "done" || status === "headers_received" ? 100 : percent} />}

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
