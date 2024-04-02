import { useState } from "react";
import { useSelector } from "react-redux";
function SelectFolders({ setSelectedFolders }) {
  const [isCheckedFolders, setIsCheckedFolders] = useState(false);
  const { folders } = useSelector((state) => state.folder);

  const handleCheckFolders = () => {
    setIsCheckedFolders(!isCheckedFolders);
    setSelectedFolders([]);
    const selectedFolders = [];
    document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
      if (checkbox.name.includes("folder")) {
        if (!isCheckedFolders) {
          const folder_id = checkbox.name.replace("folder-", "");
          const [folder] = folders.filter((folder) => folder.id === folder_id);
          selectedFolders.push(folder);
          checkbox.checked = !isCheckedFolders;
          setSelectedFolders(selectedFolders);
        }
        checkbox.checked = !isCheckedFolders;
      }
    });
    setIsCheckedFolders(false);
  };

  return (
    <>
      <button className="selectBtn" onClick={handleCheckFolders}>
        {isCheckedFolders ? "Décocher tout" : "Cocher tous les dossiers"}
      </button>
    </>
  );
}

export default SelectFolders;
