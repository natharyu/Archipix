import { useEffect, useState } from "react";
import SelectAll from "./SelectAll";
import SelectFiles from "./SelectFiles";
import SelectFolders from "./SelectFolders";

function SelectMenu({ setSelectedFiles, setSelectedFolders }) {
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const handleShowSelectMenu = () => {
    setShowSelectMenu(!showSelectMenu);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.matches(".selectMenu") && showSelectMenu) {
        setShowSelectMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
  }, [showSelectMenu]);

  return (
    <button className="selectMenu" onClick={handleShowSelectMenu}>
      Sélection
      {showSelectMenu && (
        <div className="selectMenuContent">
          <SelectAll setSelectedFiles={setSelectedFiles} setSelectedFolders={setSelectedFolders} />
          <SelectFolders setSelectedFolders={setSelectedFolders} />
          <SelectFiles setSelectedFiles={setSelectedFiles} />
        </div>
      )}
    </button>
  );
}

export default SelectMenu;
