import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FolderIcon from "@mui/icons-material/Folder";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SizeCalculator from "../../../Components/SizeCalculator";
import { getFile, getFiles, resetCurrentFile } from "../../../store/slices/files";
import { getFolders, getPath, getRootFolder, setCurrentFolder } from "../../../store/slices/folder";
import AddMenu from "./Components/AddMenu";
import FileIcon from "./Components/FileIcon";
import FilePreview from "./Components/FilePreview";
import FolderTree from "./Components/FolderTree";
function Files() {
  const [addMenu, setAddMenu] = useState(false);
  const [filePreview, setFilePreview] = useState(false);
  const { files, isLoading: isLoadingFiles } = useSelector((state) => state.file);
  const { currentFolder, isLoading: isLoadingFolder, folders, path } = useSelector((state) => state.folder);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRootFolder());
    dispatch(getFiles(currentFolder));
    dispatch(getFolders(currentFolder));
    dispatch(getPath(currentFolder));
  }, [dispatch]);

  const handleClickFolder = (id, label) => {
    setFilePreview(false);
    dispatch(resetCurrentFile());
    dispatch(getFolders(id));
    dispatch(getFiles(id));
    dispatch(getPath(id));
    dispatch(setCurrentFolder({ currentFolder: id, currentFolderName: label }));
  };

  const handleClickFile = (file_id, label) => {
    setFilePreview(true);
    const exactpath = path.join("&&&");
    dispatch(getFile({ id: file_id, label: label, path: exactpath }));
  };

  return (
    <>
      <section id="files">
        <article>
          {addMenu ? (
            <CancelIcon className="close-add-file" onClick={() => setAddMenu(!addMenu)} />
          ) : (
            <AddCircleIcon className="add-file" onClick={() => setAddMenu(!addMenu)} />
          )}
          <h2>Mes Fichiers</h2>
        </article>
        {addMenu && <AddMenu setAddMenu={setAddMenu} />}
        <article className="folder-tree">
          <FolderTree />
        </article>
        <article>
          {isLoadingFolder ? (
            <p>Chargement...</p>
          ) : (
            <ul>
              {folders.length === 0 ? null : (
                <>
                  {folders.map((folder, index) => (
                    <li key={index} onClick={() => handleClickFolder(folder.id, folder.label)}>
                      <p>
                        <FolderIcon className="icon" />
                        {folder.label}
                      </p>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </article>
        <article>
          {isLoadingFiles ? (
            <p>Chargement...</p>
          ) : (
            <ul>
              {files.length === 0 ? (
                <p>Aucun fichier présent dans ce dossier</p>
              ) : (
                <>
                  {files.map((file, index) => (
                    <li key={index} onClick={() => handleClickFile(file.id, file.label)}>
                      <p>
                        <FileIcon ext={file.extension} />
                        {file.label}
                      </p>
                      <SizeCalculator size={file.size} />
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </article>
      </section>
      {filePreview && <FilePreview />}
    </>
  );
}

export default Files;
