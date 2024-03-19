import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../../../store/slices/files";
import { setToast } from "../../../../store/slices/toast";
import Input from "./DragAndDrop/Input";
import Layout from "./DragAndDrop/Layout";
import Preview from "./DragAndDrop/Preview";
import Submit from "./DragAndDrop/Submit";
const DragAndDrop = () => {
  const { currentFolder, path } = useSelector((state) => state.folder);
  const dispatch = useDispatch();

  const getUploadParams = ({ file, meta }) => {
    const body = new FormData();
    body.append("file", file);
    body.append("currentFolder", currentFolder);
    body.append("path", path.join("/"));
    return { url: "/api/v1/file/add", body };
  };

  const handleChangeStatus = ({ meta, file }, status) => {
    if (status === "done") {
      dispatch(getFiles(currentFolder));
    }
  };

  const handleSubmit = async (files, allFiles) => {
    await allFiles.map(async (f) => await f.restart());
    await allFiles.map(async (f) => await f.remove());
    dispatch(setToast({ type: "success", message: "Fichiers importés avec succès !", showToast: true }));
    dispatch(getFiles(currentFolder));
  };

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*,video/*"
      canRemove={true}
      canCancel={true}
      canRestart={true}
      autoUpload={false}
      LayoutComponent={Layout}
      PreviewComponent={Preview}
      InputComponent={Input}
      SubmitButtonComponent={Submit}
      inputContent={(files, extra) =>
        extra.reject
          ? "Seulement les images et les vidéos sont autorisées"
          : "Glisser les fichiers ici ou cliquez dans la zone"
      }
      styles={{
        dropzone: {
          color: "var(--base-content)",
          border: "2px dashed var(--primary)",
        },
        dropzoneReject: { border: "2px solid transparent", backgroundColor: "var(--error)" },
        inputLabel: (files, extra) => (extra.reject ? { color: "var(--base)" } : {}),
      }}
    />
  );
};

export default DragAndDrop;
