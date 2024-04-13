/**
 * Component that converts bytes to human readable format
 * @param {number} size - size in bytes
 * @returns {JSX.Element} component with the human readable size
 */
function SizeCalculator({ size }) {
  // Iterate through the different byte units
  let i = -1;
  const byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
  do {
    // Divide the size by 1024 to get the value in terms of the next unit
    size /= 1024;
    // Increment the unit index
    i++;
  } while (size > 1024); // Repeat until the size is smaller than 1024

  // Format the size to 1 decimal place and append the current byte unit
  const convertedSize = Math.max(size, 0.1).toFixed(1) + byteUnits[i];

  return <p>{convertedSize}</p>; // Return a paragraph with the human readable size
}

export default SizeCalculator;
