import { useState } from "react";
function SelectAll() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckAll = () => {
    setIsChecked(!isChecked);
    document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
      checkbox.checked = !isChecked;
    });
  };

  return (
    <div>
      <button onClick={handleCheckAll}>{isChecked ? "Décocher tout" : "Cocher tout"}</button>
    </div>
  );
}

export default SelectAll;
