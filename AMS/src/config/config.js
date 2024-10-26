const environments = {
    development: {
      API_URL: import.meta.env.VITE_API_URL || 'http://localhost:7243',
      SIGNALR_URL: import.meta.env.VITE_SIGNALR_URL || 'http://localhost:7243/attendanceHub',
      LOG_LEVEL: 'DEBUG'
    },
    staging: {
      API_URL: import.meta.env.VITE_API_URL,
      SIGNALR_URL: import.meta.env.VITE_SIGNALR_URL,
      LOG_LEVEL: 'INFO'
    },
    production: {
      API_URL: import.meta.env.VITE_API_URL,
      SIGNALR_URL: import.meta.env.VITE_SIGNALR_URL,
      LOG_LEVEL: 'ERROR'
    }
  };
  
  class ConfigService {
    constructor() {
      this.environment = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development';
      this.config = environments[this.environment];
      
      if (!this.config) {
        throw new Error(`Invalid environment: ${this.environment}`);
      }
  
      // Validate required environment variables in non-development environments
      if (this.environment !== 'development') {
        const requiredVars = ['VITE_API_URL', 'VITE_SIGNALR_URL'];
        requiredVars.forEach(varName => {
          if (!import.meta.env[varName]) {
            throw new Error(`Missing required environment variable: ${varName}`);
          }
        });
      }
    }
  
    get apiUrl() {
      return this.config.API_URL;
    }
  
    get signalRUrl() {
      return this.config.SIGNALR_URL;
    }
  
    get logLevel() {
      return this.config.LOG_LEVEL;
    }
  
    // Helper method to check if we're in development
    get isDevelopment() {
      return this.environment === 'development';
    }
  }
  
  export default new ConfigService();