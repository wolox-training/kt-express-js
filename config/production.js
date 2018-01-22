exports.config = {
  environment: 'production',
  isProduction: true,
  common: {
    session: {
      duration: process.env.NODE_API_JWT_SESSION_DURATION || '24',
      unit: process.env.NODE_API_JWT_SESSION_DURATION_UNIT || 'h'
    }
  }
};
