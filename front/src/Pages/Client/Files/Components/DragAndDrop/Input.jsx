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
