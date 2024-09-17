import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://ams-bmanedabbnb8gxdd.southeastasia-01.azurewebsites.net/attendanceHub")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onreconnecting(() => {
      console.log("SignalR reconnecting...");
    });

    this.connection.onreconnected(() => {
      console.log("SignalR reconnected.");
    });

    this.connection.onclose((error) => {
      console.log("SignalR connection closed.", error);
    });
  }

  async startConnection() {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log("SignalR Connected.");
      } catch (err) {
        console.error("Error starting SignalR connection:", err);
        setTimeout(() => this.startConnection(), 5000);
      }
    } else {
      console.log("Connection is already in", this.connection.state, "state");
    }
  }

  async stopConnection() {
    if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.stop();
        console.log("SignalR Disconnected.");
      } catch (err) {
        console.error("Error stopping SignalR connection:", err);
      }
    }
  }

  async joinSession(sessionCode) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("JoinSession", sessionCode);
        console.log("Joined session:", sessionCode);
      } catch (err) {
        console.error("Error joining session:", err);
      }
    } else {
      console.error("Cannot join session. Connection is not in Connected state.");
    }
  }

  onNewCheckIn(callback) {
    this.connection.on("NewCheckIn", callback);
  }
}

export default new SignalRService();