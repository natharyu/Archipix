import { useState } from "react";
import { useSelector } from "react-redux";
function SelectFolders({ setSelectedFolders }) {
  const [isChecked, setIsChecked] = useState(false);
  const { folders } = useSelector((state) => state.folder);

  const handleCheckFolders = () => {
    setIsChecked(!isChecked);
    setSelectedFolders([]);
    const selectedFolders = [];
    document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
      if (checkbox.name.includes("folder")) {
        if (!isChecked) {
          const folder_id = checkbox.name.replace("folder-", "");
          const [folder] = folders.filter((folder) => folder.id === folder_id);
          selectedFolders.push(folder);
          checkbox.checked = !isChecked;
          setSelectedFolders(selectedFolders);
        }
        checkbox.checked = !isChecked;
      }
    });
  };

  return (
    <div>
      <button onClick={handleCheckFolders}>{isChecked ? "Décocher tout" : "Cocher tous les dossiers"}</button>
    </div>
  );
}

export default SelectFolders;
