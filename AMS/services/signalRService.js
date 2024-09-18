import * as signalR from '@microsoft/signalr';

const API_URL = 'https://ams-bmanedabbnb8gxdd.southeastasia-01.azurewebsites.net';

class SignalRService {
  constructor() {
    this.connection = null;
    this.connectionPromise = null;
  }

  async startConnection() {
    if (!this.connectionPromise) {
      this.connectionPromise = new Promise((resolve, reject) => {
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(`${API_URL}/attendanceHub`, {
            accessTokenFactory: () => localStorage.getItem('token')
          })
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: retryContext => {
              if (retryContext.elapsedMilliseconds < 60000) {
                // If we've been reconnecting for less than 60 seconds so far,
                // wait between 0 and 10 seconds before the next reconnect attempt.
                return Math.random() * 10000;
              } else {
                // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
                return null;
              }
            }
          })
          .build();

        this.connection.onclose(error => {
          console.error('SignalR Connection closed:', error);
          this.connectionPromise = null;
        });

        this.connection.start()
          .then(() => {
            console.log('SignalR Connected');
            resolve();
          })
          .catch(err => {
            console.error('Error starting SignalR connection:', err);
            this.connectionPromise = null;
            reject(err);
          });
      });
    }

    return this.connectionPromise;
  }

  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR Disconnected');
      } catch (err) {
        console.error('Error stopping SignalR connection:', err);
      } finally {
        this.connection = null;
        this.connectionPromise = null;
      }
    }
  }

  async joinSession(sessionCode) {
    await this.startConnection();
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('JoinSession', sessionCode);
    }
  }

  async leaveSession(sessionCode) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('LeaveSession', sessionCode);
    }
  }

  onNewCheckIn(callback) {
    if (this.connection) {
      this.connection.on('NewCheckIn', callback);
    }
  }

  offNewCheckIn(callback) {
    if (this.connection) {
      this.connection.off('NewCheckIn', callback);
    }
  }
}

export default new SignalRService();