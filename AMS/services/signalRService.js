import * as signalR from "@microsoft/signalr";
import config from "../src/config/config";

class SignalRService {
  constructor() {
    this.connection = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    this.callbacks = new Map();
    this.activeSessionCode = null;
  }

  async initializeConnection() {
    if (this.connection) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(config.signalRUrl, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
            return null;
          }
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        }
      })
      .configureLogging(config.logLevel === 'DEBUG' ? signalR.LogLevel.Debug : signalR.LogLevel.Error)
      .build();

    this.setupConnectionHandlers();
  }

  setupConnectionHandlers() {
    this.connection.onclose(async (error) => {
      console.error('SignalR connection closed:', error);
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        await this.startConnection();
      } else {
        console.error('Max reconnection attempts reached');
        this.dispatchEvent('connectionFailed');
      }
    });

    this.connection.onreconnecting((error) => {
      console.warn('Attempting to reconnect:', error);
      this.dispatchEvent('reconnecting');
    });

    this.connection.onreconnected((connectionId) => {
      console.log('Reconnected with ID:', connectionId);
      this.dispatchEvent('reconnected');
      this.rejoinSessions();
    });
  }

  async startConnection() {
    try {
      await this.initializeConnection();
      await this.connection.start();
      this.reconnectAttempts = 0;
      console.log("SignalR Connected Successfully");
      this.dispatchEvent('connected');
    } catch (err) {
      console.error("SignalR Connection Error:", err);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.startConnection(), this.reconnectInterval);
      } else {
        this.dispatchEvent('connectionFailed');
        throw new Error('Failed to establish SignalR connection');
      }
    }
  }

  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.connection = null;
        console.log("SignalR Disconnected Successfully");
      } catch (err) {
        console.error("Error stopping SignalR connection:", err);
      }
    }
  }

  async joinSession(sessionCode) {
    if (!sessionCode) {
      throw new Error('Session code is required');
    }

    try {
      await this.ensureConnection();
      await this.connection.invoke("JoinSession", sessionCode);
      this.activeSessionCode = sessionCode;
    } catch (err) {
      console.error("Error joining session:", err);
      throw err;
    }
  }

  async leaveSession(sessionCode) {
    if (!sessionCode) {
      throw new Error('Session code is required');
    }

    try {
      await this.ensureConnection();
      await this.connection.invoke("LeaveSession", sessionCode);
      this.activeSessionCode = null;
    } catch (err) {
      console.error("Error leaving session:", err);
      throw err;
    }
  }

  onNewCheckIn(callback) {
    if (!callback || typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    this.connection.on("NewCheckIn", (data) => {
      try {
        callback(data);
      } catch (error) {
        console.error("Error in NewCheckIn callback:", error);
      }
    });
  }

  offNewCheckIn() {
    this.connection.off("NewCheckIn");
  }

  async ensureConnection() {
    if (!this.connection || this.connection.state === signalR.HubConnectionState.Disconnected) {
      await this.startConnection();
    }
  }

  async rejoinSessions() {
    if (this.activeSessionCode) {
      await this.joinSession(this.activeSessionCode);
    }
  }

  addEventListener(event, callback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set());
    }
    this.callbacks.get(event).add(callback);
  }

  removeEventListener(event, callback) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  dispatchEvent(event, data) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

export default new SignalRService();