exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.NODE_API_DB_NAME_TEST
    },
    session: {
      duration: process.env.NODE_API_JWT_SESSION_DURATION_TEST || '1',
      unit: process.env.NODE_API_JWT_SESSION_DURATION_UNIT_TEST || 'm'
    }
  }
};
