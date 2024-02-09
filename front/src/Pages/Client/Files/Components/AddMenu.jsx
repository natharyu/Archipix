import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { setToast } from "../../../../store/slices/toast";
function AddMenu() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  let percentage = 0;
  const dispatch = useDispatch();
  const dragZone = document.querySelector(".drag-and-drop");
  const { getRootProps, getInputProps, open, acceptedFiles, fileRejections } = useDropzone({
    noKeyboard: true,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
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
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.path}>
        <BlockIcon className="invalid-file" />
        {file.path} - {file.size} bytes
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

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      percentage = parseInt((event.loaded / event.total) * 100);
      console.log(percentage); // Update progress here
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
    xhr.open("POST", "https://httpbin.org/post", true);
    xhr.send(formData);
  };

  return (
    <>
      <article {...getRootProps()} className="drag-and-drop">
        <div>
          <input {...getInputProps()} />
          <p>Glisser et déposer vos fichiers dans cette zone.</p>
          <button type="button" onClick={open}>
            Ouvrir l'explorateur de fichiers
          </button>
        </div>
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
