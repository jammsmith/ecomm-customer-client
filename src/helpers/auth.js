import { MongoDBRealmError } from 'realm-web';

//
export const registerEmailPassword = async (app, email, password) => {
  const unknownErrorMessage = 'Something went wrong, please refresh and try again';

  const handleRegistrationError = (err) => {
    let message;

    if (err instanceof MongoDBRealmError) {
      const { error, statusCode } = err;
      const errorType = error || statusCode;
      switch (errorType) {
        case 'invalid username':
          message = 'Email address is invalid';
          break;
        case 'invalid username/password':
        case 'invalid password':
        case 401:
          message = 'Password is invalid';
          break;
        case 'name already in use':
        case 409:
          message = 'Email address is already registered';
          break;
        case 'password must be between 6 and 128 characters':
        case 400:
          message = 'Invalid password - must be between 6 and 128 characters';
          break;
        default: message = unknownErrorMessage;
          break;
      }
    } else {
      message = unknownErrorMessage;
    }
    return message;
  };

  let errorMessage;
  try {
    await app.emailPasswordAuth.registerUser(email, password);
  } catch (err) {
    errorMessage = handleRegistrationError(err);
  }
  return { error: errorMessage };
};

//
export const getLoginError = (err) => {
  let message;

  if (err instanceof MongoDBRealmError) {
    const { error, statusCode } = err;
    const errorType = error || statusCode;

    switch (errorType) {
      case 'invalid username/password':
      case 'invalid username':
      case 401:
        message = 'Email address or password is invalid';
        break;
      default: message = 'Login failed, please try again.';
    }

    return message;
  }
};

//
export const isAuthenticated = (user) => {
  if (!user) return false;

  if (
    user.providerType === 'local-userpass' &&
    user.dbUser &&
    (user.dbUser.type === 'customer' || user.dbUser.type === 'admin')
  ) {
    return true;
  } else {
    return false;
  }
};

export const isAdmin = (user) => {
  return !!(isAuthenticated(user) && user.dbUser.type === 'admin');
};
