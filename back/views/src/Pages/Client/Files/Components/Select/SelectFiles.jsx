import { useState } from "react";
import { useSelector } from "react-redux";
function SelectFiles({ setSelectedFiles }) {
  const [isCheckedFiles, setIsCheckedFiles] = useState(false);
  const { files } = useSelector((state) => state.file);

  const handleCheckFiles = () => {
    setIsCheckedFiles(!isCheckedFiles);
    setSelectedFiles([]);
    const selectedFiles = [];
    document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
      if (checkbox.name.includes("file")) {
        if (!isCheckedFiles) {
          const file_id = checkbox.name.replace("file-", "");
          const [file] = files.filter((file) => file.id === file_id);
          selectedFiles.push(file);
          checkbox.checked = !isCheckedFiles;
          setSelectedFiles(selectedFiles);
        }
        checkbox.checked = !isCheckedFiles;
      }
    });
    setIsCheckedFiles(false);
  };

  return (
    <button className="selectBtn" onClick={handleCheckFiles}>
      {isCheckedFiles ? "Décocher tout" : "Cocher tous les fichiers"}
    </button>
  );
}

export default SelectFiles;
