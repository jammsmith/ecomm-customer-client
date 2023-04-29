export const isObjectEmpty = (obj) => {
  if (typeof obj !== 'object') return undefined;
  return !Object.keys(obj).length;
};

export const capitaliseFirstCharacter = (string) => {
  if (!string || typeof string !== 'string') return undefined;
  return `${string.substring(0, 1).toUpperCase()}${string.substring(1)}`;
};

export const getDateFromUTCString = (utcString) => {
  if (typeof utcString !== 'string') return undefined;
  return utcString.split('T')[0];
};

export const getUpdatedObjectFields = (originalObj, fieldsToCompare) => {
  const updatedFields = {};

  for (const field in fieldsToCompare) {
    if (originalObj[field] !== fieldsToCompare[field]) {
      updatedFields[field] = fieldsToCompare[field];
    }
  }
  const hasUpdatedFields = !!(Object.keys(updatedFields).length);

  return {
    updatedFields,
    hasUpdatedFields
  };
};
