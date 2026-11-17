const xlsx = require('xlsx');

/**
 * Builds an Excel buffer from rows of data
 * @param {Array<Object>} data
 * @param {string} sheetName
 * @returns {Buffer}
 */
const buildExcelBuffer = (data, sheetName = 'Participants') => {
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

/**
 * Builds a CSV string from rows of data
 * @param {Array<Object>} data
 * @returns {string}
 */
const buildCsvString = (data) => {
  const worksheet = xlsx.utils.json_to_sheet(data);
  return xlsx.utils.sheet_to_csv(worksheet);
};

module.exports = {
  buildExcelBuffer,
  buildCsvString
};
