import _ from 'lodash';
import axios from 'axios';

export const validateInputFields = (inputFields, requiredFields) => {
  // no address provided -->
  if (!inputFields) {
    return { isValid: false, message: 'Must provide delivery details' };
  }

  const fields = { ...inputFields };
  // Check to make sure at least some value has been passed for the required fields -->
  let tests = [];
  let failedTests = [];

  if (requiredFields) {
    requiredFields.forEach(key => {
      if (fields[key]) {
        tests.push({ key, result: true });
      } else {
        tests.push({ key, result: false });
      }
    });

    // Check for failed fields and provide a relevant message to show user -->
    failedTests = tests.filter(t => t.result === false);
    if (failedTests.length) {
      console.log('failedTests[0]', failedTests[0]);
      let message;
      switch (failedTests.length) {
        case 1:
          message = `'${_.startCase(failedTests[0].key)}' is missing`;
          break;
        case 2:
          message = `'${_.startCase(failedTests[0].key)}' and '${_.startCase(failedTests[1].key)}' are missing`;
          break;
        default: message = 'Required fields missing';
      }
      return { isValid: false, message, failedTests };
    }
  }

  // Check format of personal details fields
  const personalDetails = ['firstName', 'lastName', 'email', 'phone'];
  tests = [];
  failedTests = [];

  const regexCheck = (key, value) => {
    let regex;
    if (key === 'firstName' || key === 'lastName') {
      regex = /^[a-zA-Z]+$/;
    } else if (key === 'email') {
      regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    } else if (key === 'phone') {
      regex = /^(?:[0-9] ?){6,14}[0-9]$/;
    }
    tests.push({ key, value, result: regex.test(value) });
  };

  personalDetails.forEach(key => {
    if (fields[key]) {
      let value = fields[key];
      if (typeof value !== 'string') {
        value = value.toString();
      }
      value = value.trim();
      regexCheck(key, value);
    }
  });
  failedTests = tests.filter(t => t.result === false);

  if (failedTests.length) {
    return { isValid: false, message: 'Errors in form details, please check and re-submit', failedTests };
  } else {
    return { isValid: true };
  }
};

export const getAddressesFromPostcode = async (postcode) => {
  try {
    // Get address ID from postcode -->
    const apiKey = 'FU89-WW97-YH46-EG62';
    const url = 'https://api.addressy.com/Capture/Interactive';
    const findEndpoint = `${url}/Find/v1.10/json3.ws?Key=${apiKey}&Text=${postcode}&Limit=2`;

    let addressOptions;

    // Attempt to fetch address ID, this may pass back a postcode ID, in which case run the function again until
    // an address ID is returned -->
    const { data, error } = await axios.get(findEndpoint);
    const originalData = data;

    if (error) throw new Error('Failed to find any address for postcode.', error);
    if (data && data.Items) {
      // If items are of address Type then pass addresses back to component for user to select between
      if (data.Items[0].Type === 'Postcode' && data.Items.length === 1) {
        addressOptions = (async function retry () {
          const { data } = await axios.get(`${findEndpoint}&Container=${originalData.Items[0].Id}`);
          if (data.Items[0].Type === 'Address') {
            return data.Items;
          } else {
            retry();
          }
        })();
      } else {
        return { message: 'Postcode not specific enough' };
      }
    }
    const fulfilledOptions = await Promise.resolve(addressOptions);

    // Return addresses for use in dropdown selector
    return fulfilledOptions.map(option => `${option.Text}, ${option.Description}`);
  } catch (err) {
    console.log('Error getting address from postcode', err);
  }
};

export const getDefaultAddress = (addresses) => {
  if (addresses && addresses.length) {
    const defaultAddress = addresses.find(addr => addr.isDefault === true);

    if (defaultAddress) {
      return defaultAddress;
    }
  }
};
