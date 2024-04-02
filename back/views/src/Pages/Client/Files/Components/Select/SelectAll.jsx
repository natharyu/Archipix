import { useState } from "react";
import { useSelector } from "react-redux";
function SelectAll({ setSelectedFolders, setSelectedFiles }) {
  const { folders } = useSelector((state) => state.folder);
  const { files } = useSelector((state) => state.file);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckAll = () => {
    setIsChecked(!isChecked);
    setSelectedFolders([]);
    setSelectedFiles([]);
    const selectedFolders = [];
    const selectedFiles = [];
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
      if (checkbox.name.includes("file")) {
        if (!isChecked) {
          const file_id = checkbox.name.replace("file-", "");
          const [file] = files.filter((file) => file.id === file_id);
          selectedFiles.push(file);
          checkbox.checked = !isChecked;
          setSelectedFiles(selectedFiles);
        }
        checkbox.checked = !isChecked;
      }
    });
    setIsChecked(false);
  };

  return (
    <>
      <button className="selectBtn" onClick={handleCheckAll}>
        {isChecked ? "Décocher tout" : "Cocher tout"}
      </button>
    </>
  );
}

export default SelectAll;
