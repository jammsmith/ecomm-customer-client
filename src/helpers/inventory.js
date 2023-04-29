import _ from 'lodash';

export const validateInventoryFields = (requestedFields, type) => {
  let requiredFields;
  switch (type) {
    case 'product':
      requiredFields = [
        'name',
        'description',
        'category',
        'subCategory',
        'images',
        'priceGBP',
        'priceUSD',
        'priceEUR',
        'numInStock',
        'weightInGrams'
      ];
      break;
    case 'subCategory':
      requiredFields = ['name', 'description', 'category', 'image'];
      break;
    case 'category':
      requiredFields = ['name', 'description', 'image'];
      break;
    default: throw new Error(`Invalid type '${type}' supplied to validateInventoryFields`);
  }

  const failedItems = [];

  for (const field of requiredFields) {
    if (!requestedFields[field]) {
      failedItems.push(field);
    }
  }
  if (failedItems.length) {
    return { result: 'failed', failedItems };
  }

  for (const field in requestedFields) {
    const item = requestedFields[field];
    switch (field) {
      case 'name':
      case 'description':
      case 'image':
        if (typeof item !== 'string' || item.trim().length < 1) {
          failedItems.push(field);
        }
        break;
      case 'images':
        if (!item.length) {
          failedItems.push(field);
        }
        break;
      case 'priceGBP':
      case 'priceUSD':
      case 'priceEUR': {
        const parsed = parseFloat(item);
        if (parsed === 0) {
          failedItems.push(field);
        }
      }
        break;
      case 'numInStock':
      case 'weightInGrams': {
        const parsed = parseInt(item);
        if (typeof parsed !== 'number') {
          failedItems.push(field);
        }
      }
        break;
      default:
    }
  }
  return failedItems.length
    ? { result: 'failed', failedItems }
    : { result: 'passed' };
};

export const getTrimmedFormFields = (fields) => {
  const clonedFields = Object.assign(fields, {});
  for (const field in clonedFields) {
    let item = clonedFields[field];
    if (typeof item === 'string') {
      item = item.trim();
    }
  }
  return clonedFields;
};

export const getInitialFormFields = (type) => {
  switch (type) {
    case 'product':
      return {
        name: '',
        description: '',
        images: [],
        category: '',
        subCategory: '',
        numInStock: '',
        priceGBP: '',
        priceUSD: '',
        priceEUR: '',
        weightInGrams: ''
      };
    case 'subCategory':
      return {
        name: '',
        description: '',
        image: '',
        category: ''
      };
    case 'category':
      return {
        name: '',
        description: '',
        image: ''
      };
    default: throw new Error(`Invalid inventory type '${type}' supplied to getInitialFormFields`);
  }
};

export const getFormattedRow = (item, type) => {
  if (!item || Object.keys(item).length === 0 || !type || typeof type !== 'string') {
    throw new Error('Failed to supply proper input to getFormattedRow');
  }

  const sharedFields = {
    id: item[`${type}_id`],
    name: _.startCase(item.name)
  };
  switch (type) {
    case 'product':
      return {
        ...sharedFields,
        numInStock: item.numInStock,
        price: item.priceGBP,
        category: _.startCase(item.category),
        subcategory: _.startCase(item.subCategory)
      };
    case 'subCategory':
      return {
        ...sharedFields,
        category: _.startCase(item.category)
      };
    case 'category':
      return sharedFields;
    default: throw new Error(`Invalid inventory type '${type}' supplied to getFormattedRow`);
  }
};
