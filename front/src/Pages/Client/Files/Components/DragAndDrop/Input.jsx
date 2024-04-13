/**
 * The DragAndDrop Input component renders an input with type "file" and
 * handles the files upload. It also renders a label that can display a
 * different content when there are files in the list.
 *
 * @param {Object} props
 * @param {string} props.className The CSS class applied to the input.
 * @param {Object} props.style The CSS styles applied to the input.
 * @param {Object} props.labelStyle The CSS styles applied to the label.
 * @param {Object} props.labelWithFilesStyle The CSS styles applied to the
 *     label when there are files in the list.
 * @param {Function} props.getFilesFromEvent Function that returns a Promise
 *     with the files chosen by the user.
 * @param {string} props.accept The accepted file types.
 * @param {boolean} props.multiple Whether multiple files can be selected.
 * @param {boolean} props.disabled Whether the input is disabled.
 * @param {JSX.Element} props.content The content of the label when there are
 *     no files in the list.
 * @param {JSX.Element} props.withFilesContent The content of the label when
 *     there are files in the list.
 * @param {Function} props.onFiles Callback function called when the user
 *     chooses files.
 * @param {Object[]} props.files The files list.
 * @returns {JSX.Element} The DragAndDrop Input component.
 */
function Input(props) {
  const {
    className,
    style,
    labelStyle,
    labelWithFilesStyle,
    getFilesFromEvent,
    accept,
    multiple,
    disabled,
    content,
    withFilesContent,
    onFiles,
    files,
  } = props;

  return (
    <label
      className={files.length > 0 ? "add-file" : "input-without-file"}
      style={files.length > 0 ? labelWithFilesStyle : labelStyle}
    >
      {files.length > 0 ? withFilesContent : content}
      <input
        className={className}
        style={style}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={async (e) => {
          const target = e.target;
          const chosenFiles = await getFilesFromEvent(e);
          onFiles(chosenFiles);
          //@ts-ignore
          target.value = null;
        }}
      />
    </label>
  );
}

export default Input;
