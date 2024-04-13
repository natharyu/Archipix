import FolderIcon from "@mui/icons-material/Folder";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { shareGetFiles } from "../../../store/slices/files";
import { setCurrentFolder, shareGetFolders, shareGetPath } from "../../../store/slices/folder";
import { setToast } from "../../../store/slices/toast";
import ShareDownloadBtn from "./ShareDownloadBtn";
import ShareDownloadBtnFolder from "./ShareDownloadBtnFolder";

function ShareFolder() {
  const { id } = useParams();
  const [validLink, setValidLink] = useState(false);
  const dispatch = useDispatch();
  const { files, isLoading: isLoadingFiles } = useSelector((state) => state.file);
  const { isLoading: isLoadingFolder, folders, path, currentFolder } = useSelector((state) => state.folder);
  const navigate = useNavigate();
  /**
   * Verify link to shared folder
   *
   * @param {string} id Link ID
   */
  const verifyLink = async (id) => {
    // Send GET request to verify link
    await fetch(`/api/v1/share/verify/${id}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          // If link is valid
          setValidLink(true); // Set validLink state to true
          let currentShareFolder = data.link.split("/"); // Get folder ID
          currentShareFolder = currentShareFolder[currentShareFolder.length - 1]; // Get last element of array
          dispatch(shareGetFiles(currentShareFolder)); // Get files of folder
          dispatch(shareGetFolders(currentShareFolder)); // Get folders of folder
          dispatch(shareGetPath(currentShareFolder)); // Get path of folder
        } else {
          // If link is not valid
          setValidLink(false); // Set validLink state to false
          navigate("/error");
          dispatch(
            setToast({
              // Show toast with error message
              message: data.message,
              type: "error",
              showToast: true,
            })
          );
        }
      });
  };

  useEffect(() => {
    verifyLink(id);
  }, [id]);

  useEffect(() => {
    if (currentFolder) {
      dispatch(shareGetFiles(currentFolder));
      dispatch(shareGetFolders(currentFolder));
      dispatch(shareGetPath(currentFolder));
    }
  }, [currentFolder]);

  const handleClickFolder = (id, label) => {
    // Set current folder state
    dispatch(
      setCurrentFolder({
        // Id of folder
        currentFolder: id,
        // Label of folder
        currentFolderName: label,
      })
    );

    // Get files of folder
    dispatch(shareGetFiles(id));
  };

  return (
    <>
      {validLink ? (
        <section id="share-folder">
          <h2>Dossier partagé</h2>
          {/* Folders grid view */}
          <article className="grid-view">
            {isLoadingFolder ? (
              <p>Chargement...</p>
            ) : (
              <>
                {/* If there are no folders, do not display anything */}
                {folders.length === 0 ? null : (
                  <>
                    {/* Map folders to display them as a grid */}
                    {folders.map((folder, index) => (
                      <div key={index}>
                        {/* Button to download folder */}
                        <ShareDownloadBtnFolder folder_id={folder.id} />
                        <div className="grid-folder" onClick={() => handleClickFolder(folder.id, folder.label)}>
                          {/* Folder icon */}
                          <FolderIcon className="grid-folder-icon" />
                          {/* Folder name */}
                          <p>{folder.label}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </article>

          {/* Files grid view */}
          <article className="grid-view">
            {isLoadingFiles ? (
              <p>Chargement...</p>
            ) : (
              <>
                {/* If there are no files, do not display anything */}
                {files.length === 0 ? null : (
                  <>
                    {/* Map files to display them as a grid */}
                    {files.map((file, index) => (
                      <div className="grid-file-container" key={index}>
                        {/* Button to download file */}
                        <ShareDownloadBtn file={file} />
                        <div className="grid-file" onClick={() => handleClickFile(file)}>
                          {/* If file is an image, display it */}
                          {file.type.includes("image") && (
                            <img
                              src={`https://archipix.s3.eu-west-3.amazonaws.com/${path.join("/")}/${file.label}`}
                              alt={file.label}
                            />
                          )}

                          {/* If file is a video, display it */}
                          {file.type.includes("video") && (
                            <video
                              src={`https://archipix.s3.eu-west-3.amazonaws.com/${path.join("/")}/${file.label}`}
                              controls
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </article>
        </section>
      ) : (
        <h2>Le lien n'est pas valide</h2>
      )}
    </>
  );
}

export default ShareFolder;
