import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import SizeCalculator from "../../../../Components/SizeCalculator";
import { setToast } from "../../../../store/slices/toast";
function AddMenu() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [newFolder, setNewFolder] = useState(false);
  const newFolderName = useRef(null);
  let percentage = 0;
  const dispatch = useDispatch();
  const { currentFolder } = useSelector((state) => state.folder);
  const dragZone = document.querySelector(".drag-and-drop");
  const { getRootProps, getInputProps, open, acceptedFiles, fileRejections, isDragActive } = useDropzone({
    noKeyboard: true,
    // accept: {
    //   "image/*": [".jpeg", ".png"],
    // },
    maxFiles: 50,
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

  const handleSendFiles = () => {
    if (acceptedFiles.length === 0) return;
    const formData = new FormData();
    uploadedFiles.forEach((file) => formData.append("file", file));
    formData.append("currentFolder", currentFolder);

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      percentage = parseInt((event.loaded / event.total) * 100);
      document.getElementById("progress").style.display = "block";
      document.querySelector(".progress-bar").style.width = `${percentage}%`;
      document.querySelector(".progress-bar").innerHTML = `${percentage}%`;
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status !== 200) {
        dispatch(setToast({ type: "error", message: "Une erreur est survenue", showToast: true }));
      }
      document.getElementById("progress").style.display = "none";
      percentage = 0;
      setUploadedFiles([]);
      acceptedFiles.length = 0;
      fileRejections.length = 0;
      dispatch(setToast({ type: "success", message: "Fichiers envoyés avec succès !", showToast: true }));
    };
    xhr.open("POST", "/api/v1/file/add", true);
    xhr.send(formData);
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.current.value) return;
    fetch("/api/v1/folder/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentFolder: currentFolder, newFolderName: newFolderName.current.value }),
    });
  };

  return (
    <>
      {!newFolder ? (
        <button onClick={() => setNewFolder(!newFolder)}>Nouveau dossier</button>
      ) : (
        <form onSubmit={handleCreateFolder}>
          <input type="text" placeholder="Nom du dossier" name="newFolderName" ref={newFolderName} />
          <button type="submit">Créer dossier</button>
          <button onClick={() => setNewFolder(!newFolder)}>Annuler</button>
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
      <button onClick={handleSendFiles}>Envoyer</button>
      <div id="progress">
        <div className="progress-bar">{percentage}%</div>
      </div>
    </>
  );
}

export default AddMenu;
