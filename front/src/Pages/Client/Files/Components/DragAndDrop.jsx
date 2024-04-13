import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../../../store/slices/files";
import { resetToast, setToast } from "../../../../store/slices/toast";
import Input from "./DragAndDrop/Input";
import Layout from "./DragAndDrop/Layout";
import Preview from "./DragAndDrop/Preview";
import Submit from "./DragAndDrop/Submit";
/**
 * Drag and drop component for adding files to a folder.
 */
const DragAndDrop = ({ setAddMenu }) => {
  /**
   * Redux state object containing current folder and path.
   */
  const { currentFolder, path } = useSelector((state) => state.folder);

  /**
   * Redux state object containing files.
   */
  const { files } = useSelector((state) => state.file);

  /**
   * Redux dispatch function.
   */
  const dispatch = useDispatch();

  /**
   * Called when the drag and drop component needs to get the upload
   * parameters for a file. Returns a FormData object with the file,
   * current folder, and path.
   * @param {Object} fileAndMeta - Contains the file and metadata
   * @returns {Object} FormData object with file, current folder, and path
   */
  const getUploadParams = ({ file, meta }) => {
    const body = new FormData();
    body.append("file", file);
    body.append("currentFolder", currentFolder);
    body.append("path", path.join("/"));
    return { url: "/api/v1/file/add", body };
  };

  /**
   * Called when the status of an upload changes. If the status is "ready"
   * and the file exists, remove the file from the upload queue. If the
   * status is "done", close the add menu.
   * @param {{ meta: Object, file: Object }} fileAndMeta - Contains the file and metadata
   * @param {String} status - The new status of the upload
   * @param {Array<Object>} allFiles - Array of files in the upload queue
   */
  const handleChangeStatus = ({ meta, file }, status, allFiles) => {
    allFiles.map(async (f) => {
      if (status === "ready" && f.meta.exist === true) await f.remove();
      if (status === "headers_received") {
        await f.remove();
        dispatch(resetToast());
        dispatch(setToast({ message: "Fichier(s) ajouté(s)", type: "success", showToast: true }));
        setAddMenu(false);
      }
    });
    setTimeout(() => dispatch(getFiles(currentFolder)), 1000);
  };

  /**
   * Called when the upload queue is submitted. Restarts all uploads
   * in the queue.
   * @param {Array<Object>} successFiles - Array of successfully uploaded files
   * @param {Array<Object>} allFiles - Array of files in the upload queue
   */
  const handleSubmit = async (successFiles, allFiles) => {
    allFiles.map(async (f) => {
      await f.restart();
    });
  };

  /**
   * Called when a file is added to the upload queue. Checks if the file
   * already exists in the current folder and sets the "exist" property
   * of the metadata to true if it does.
   * @param {{ meta: Object }} fileAndMeta - Contains the file and metadata
   */
  const handleValidate = ({ meta }) => {
    files.map((file) => {
      if (file.label === meta.name) {
        return (meta.exist = true);
      }
    });
  };

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*,video/*"
      multiple={true}
      canRemove={true}
      canCancel={true}
      canRestart={true}
      autoUpload={false}
      LayoutComponent={Layout}
      PreviewComponent={Preview}
      InputComponent={Input}
      SubmitButtonComponent={Submit}
      validate={handleValidate}
      maxFiles={5}
      inputContent={(files, extra) => {
        if (extra.reject) {
          return "Seulement les images et les vidéos sont autorisées. Maximum 5 fichiers.";
        }
        return "Glisser les fichiers ici ou cliquez dans la zone. Maximum 5 fichiers.";
      }}
      styles={{
        dropzone: {
          color: "var(--base-content)",
          border: "2px dashed var(--primary)",
          overflow: "hidden",
        },
        dropzoneReject: { color: "var(--base-content)", border: "2px dashed var(--primary)", overflow: "hidden" },
        inputLabel: (files, extra) => (extra.reject ? { color: "var(--base--content)" } : {}),
      }}
    />
  );
};

export default DragAndDrop;
