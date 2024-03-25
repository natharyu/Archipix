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
  const { files } = useSelector((state) => state.file);
  const dispatch = useDispatch();

  const getUploadParams = ({ file, meta }) => {
    const body = new FormData();
    body.append("file", file);
    body.append("currentFolder", currentFolder);
    body.append("path", path.join("/"));
    return { url: "/api/v1/file/add", body };
  };

  const handleChangeStatus = ({ meta, file }, status, allFiles) => {
    allFiles.map(async (f) => {
      if (f.meta.status === "ready" && f.meta.exist === true) f.remove();

      if (f.meta.status === "done") {
        await f.remove();
        dispatch(setToast({ type: "success", message: "Fichiers importés avec succès !", showToast: true }));
        setTimeout(() => dispatch(getFiles(currentFolder)), 200);
      }
    });
  };

  const handleSubmit = async (successFiles, allFiles) => {
    await allFiles.map(async (f) => {
      await f.restart();
    });
  };

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
      canRemove={true}
      canCancel={true}
      canRestart={true}
      autoUpload={false}
      LayoutComponent={Layout}
      PreviewComponent={Preview}
      InputComponent={Input}
      SubmitButtonComponent={Submit}
      validate={handleValidate}
      inputContent={(files, extra) =>
        extra.reject
          ? "Seulement les images et les vidéos sont autorisées"
          : "Glisser les fichiers ici ou cliquez dans la zone"
      }
      styles={{
        dropzone: {
          color: "var(--base-content)",
          border: "2px dashed var(--primary)",
          overflow: "hidden",
        },
        dropzoneReject: { border: "2px solid transparent", backgroundColor: "var(--error)" },
        inputLabel: (files, extra) => (extra.reject ? { color: "var(--base)" } : {}),
      }}
    />
  );
};

export default DragAndDrop;
