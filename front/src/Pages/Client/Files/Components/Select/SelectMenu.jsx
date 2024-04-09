import { useState } from "react";
import SelectAll from "./SelectAll";
import SelectFiles from "./SelectFiles";
import SelectFolders from "./SelectFolders";

function SelectMenu({ setSelectedFiles, setSelectedFolders }) {
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const handleShowSelectMenu = () => {
    setShowSelectMenu(!showSelectMenu);
  };
  return (
    <button className="selectMenu" onClick={handleShowSelectMenu}>
      <p>Sélection</p>
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
