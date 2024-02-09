import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../../store/slices/files";
import AddMenu from "./Components/AddMenu";
function Files() {
  const [addMenu, setAddMenu] = useState(false);
  const { files, isLoading } = useSelector((state) => state.file);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFiles());
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
      <article>
        <p>Affichage des fichiers</p>
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                <p>{file}</p>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}

export default Files;
