export const getEnvVar = (variable) => {
  if (process.env.NODE_ENV === 'production') {
    return process.env[`REACT_APP_LIVE_${variable}`];
  } else {
    return process.env[`REACT_APP_LOCAL_${variable}`];
  }
};
