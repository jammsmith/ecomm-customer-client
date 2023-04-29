import _ from 'lodash';

export const formatUserDetails = (details) => {
  const formattedFields = {};
  for (const key in details) {
    const value = details[key];
    switch (key) {
      case 'firstName':
      case 'lastName':
      case 'line1':
      case 'line2':
      case 'city':
      case 'county':
      case 'country':
        formattedFields[key] = _.startCase(value.trim());
        break;
      case 'postcode':
        formattedFields[key] = value.trim();
        break;
      case 'email':
        formattedFields.email = value.trim().toLowerCase();
        break;
      case 'phone':
        formattedFields.phone = value.toString().trim();
        break;
      default:
        break;
    }
  }
  return formattedFields;
};
