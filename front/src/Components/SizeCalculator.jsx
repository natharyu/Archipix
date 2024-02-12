function SizeCalculator({ size }) {
  let i = -1;
  const byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
  do {
    size /= 1024;
    i++;
  } while (size > 1024);

  const convertedSize = Math.max(size, 0.1).toFixed(1) + byteUnits[i];

  return <p>{convertedSize}</p>;
}

export default SizeCalculator;
