import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import SizeCalculator from "../../../../Components/SizeCalculator";
import { getFolders } from "../../../../store/slices/folder";
import { setToast } from "../../../../store/slices/toast";

function AddMenu({ setAddMenu }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [newFolder, setNewFolder] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const newFolderName = useRef(null);
  let percentage = 0;
  const dispatch = useDispatch();
  const { currentFolder, path } = useSelector((state) => state.folder);
  const dragZone = document.querySelector(".drag-and-drop");
  const { getRootProps, getInputProps, open, acceptedFiles, fileRejections, isDragActive } = useDropzone({
    noKeyboard: true,
    // accept: {
    //   "image/*": [".jpeg", ".png"],
    // },
    maxFiles: 10,
    onDragEnter: () => dragZone.classList.add("active-drag-and-drop"),
    onDragLeave: () => dragZone.classList.remove("active-drag-and-drop"),
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
      dragZone.classList.remove("active-drag-and-drop");
    },
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      <CheckCircleOutlineIcon className="valide-file" />
      <p>{file.path}</p>
      <SizeCalculator size={file.size} />
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.path}>
        <BlockIcon className="invalid-file" />
        {file.path} - <SizeCalculator size={file.size} />
        <ul>
          {errors.map((e) => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    );
  });

  const handleSendFiles = async () => {
    if (acceptedFiles.length === 0) return;
    const formData = new FormData();
    uploadedFiles.forEach((file) => formData.append("file", file));
    formData.append("currentFolder", currentFolder);
    formData.append("path", path.join("/"));

    try {
      setIsSending(true);
      await fetch("/api/v1/file/add", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            return dispatch(setToast({ type: "error", message: data.error, showToast: true }));
          }
          setUploadedFiles([]);
          acceptedFiles.length = 0;
          fileRejections.length = 0;
          setIsSending(false);
          setAddMenu(false);
          dispatch(setToast({ type: "success", message: data.message, showToast: true }));
        });
    } catch (error) {
      dispatch(setToast({ type: "error", message: "Une erreur est survenue", showToast: true }));
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.current.value) return;
    await fetch("/api/v1/folder/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentFolder: currentFolder,
        newFolderName: newFolderName.current.value,
        path: path.join("/"),
      }),
    }).then((res) => {
      if (res.ok) {
        dispatch(setToast({ type: "success", message: "Dossier créé avec succès !", showToast: true }));
        newFolderName.current.value = "";
        setNewFolder(!newFolder);
        setAddMenu(false);
        dispatch(getFolders(currentFolder));
      }
      if (!res.ok) {
        dispatch(setToast({ type: "error", message: "Une erreur est survenue", showToast: true }));
      }
    });
  };

  return (
    <>
      {!newFolder ? (
        <button className="create-new-folder" onClick={() => setNewFolder(!newFolder)}>
          {" "}
          <CreateNewFolderIcon />
          <p>Créer un nouveau dossier</p>
        </button>
      ) : (
        <form className="create-new-folder-form" onSubmit={handleCreateFolder}>
          <input type="text" placeholder="Nom du dossier" name="newFolderName" ref={newFolderName} />
          <div>
            <button className="create-new-folder" type="submit">
              Ajouter dossier
            </button>
            <button className="create-new-folder-cancel" onClick={() => setNewFolder(!newFolder)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <article {...getRootProps()} className="drag-and-drop">
        {isDragActive ? (
          <div>
            <p>Déposer le(s) fichier(s) ici</p>
          </div>
        ) : (
          <div>
            <input {...getInputProps()} />
            <p>Glisser et déposer vos fichiers dans cette zone.</p>
            <button type="button" onClick={open}>
              Ouvrir l'explorateur de fichiers
            </button>
          </div>
        )}
        <div className="file-list">
          {acceptedFileItems.length > 0 && (
            <aside>
              <h4>{acceptedFiles.length} Fichiers à envoyer :</h4>
              <ul>{acceptedFileItems}</ul>
            </aside>
          )}
          {fileRejectionItems.length > 0 && (
            <aside>
              <h4>{fileRejections.length} Fichiers non validés :</h4>
              <ul>{fileRejectionItems}</ul>
            </aside>
          )}
        </div>
      </article>
      <button className="send-files" onClick={handleSendFiles}>
        {isSending ? "Envoi en cours..." : "Envoyer"}
      </button>
    </>
  );
}

export default AddMenu;
