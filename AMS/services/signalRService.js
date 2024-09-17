import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://ams-bmanedabbnb8gxdd.southeastasia-01.azurewebsites.net/attendanceHub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onclose(async () => {
      await this.startConnection();
    });
  }

  async startConnection() {
    try {
      await this.connection.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.log(err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  async stopConnection() {
    try {
      await this.connection.stop();
      console.log("SignalR Disconnected.");
    } catch (err) {
      console.log(err);
    }
  }

  async joinSession(sessionCode) {
    try {
      await this.connection.invoke("JoinSession", sessionCode);
    } catch (err) {
      console.log(err);
    }
  }

  onNewCheckIn(callback) {
    this.connection.on("NewCheckIn", callback);
  }
}

export default new SignalRService();