import { useState } from "react";
import { useSelector } from "react-redux";
function SelectFiles({ setSelectedFiles }) {
  const [isChecked, setIsChecked] = useState(false);
  const { files } = useSelector((state) => state.file);

  const handleCheckFolders = () => {
    setIsChecked(!isChecked);
    setSelectedFiles([]);
    const selectedFiles = [];
    document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
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
    <div>
      <button onClick={handleCheckFolders}>{isChecked ? "Décocher tout" : "Cocher tous les fichiers"}</button>
    </div>
  );
}

export default SelectFiles;
