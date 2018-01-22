exports.config = {
  environment: 'development',
  isDevelopment: true,
  common: {
    session: {
      duration: process.env.NODE_API_JWT_SESSION_DURATION_TEST || '1',
      unit: process.env.NODE_API_JWT_SESSION_DURATION_UNIT_TEST || 'm'
    }
  }
};
