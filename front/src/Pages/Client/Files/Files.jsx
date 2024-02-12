import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SizeCalculator from "../../../Components/SizeCalculator";
import { getFiles } from "../../../store/slices/files";
import { getRootFolder } from "../../../store/slices/folder";
import AddMenu from "./Components/AddMenu";
import FolderTree from "./Components/FolderTree";
function Files() {
  const [addMenu, setAddMenu] = useState(false);
  const { files, isLoading } = useSelector((state) => state.file);
  const { currentFolder } = useSelector((state) => state.folder);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRootFolder());
    dispatch(getFiles(currentFolder));
  }, [dispatch]);
  return (
    <section id="files">
      <article>
        {addMenu ? (
          <CancelIcon className="close-add-file" onClick={() => setAddMenu(!addMenu)} />
        ) : (
          <AddCircleIcon className="add-file" onClick={() => setAddMenu(!addMenu)} />
        )}
        <h2>Mes Fichiers</h2>
      </article>
      {addMenu && <AddMenu />}
      <article className="folder-tree">
        <FolderTree currentFolder={currentFolder} />
      </article>
      <article>
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <ul>
            {files.length === 0 ? (
              <p>Aucun fichier présent dans ce dossier</p>
            ) : (
              <>
                {files.map((file, index) => (
                  <li key={index}>
                    <p>{file.label}</p>
                    <SizeCalculator size={file.size} />
                  </li>
                ))}
              </>
            )}
          </ul>
        )}
      </article>
    </section>
  );
}

export default Files;
