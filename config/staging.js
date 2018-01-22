exports.config = {
  environment: 'staging',
  isStage: true,
  common: {
    session: {
      duration: process.env.NODE_API_JWT_SESSION_DURATION || '24',
      unit: process.env.NODE_API_JWT_SESSION_DURATION_UNIT || 'h'
    }
  }
};
