import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import authservice from "../../services/authservice";
import QRCode from "qrcode";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(null);

  const generateQRCode = useCallback(async (sessionCode) => {
    try {
      const qrCodeSvg = await QRCode.toString(sessionCode, {
        type: "svg",  // Specify the type as 'svg'
        color: {
          dark: "#FFF",  // Dark color (QR code color)
          light: "#1a202c",  // Light color (background)
        },
      });
      return qrCodeSvg; // Return SVG as a string
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  }, []);
  

  const fetchActiveSession = useCallback(async () => {
    try {
      const activeSession = await authservice.getActiveSession();
      if (activeSession) {
        const qrCodeUrl = await generateQRCode(activeSession.sessionCode);
        setSessionData({
          ...activeSession,
          timeRemaining: activeSession.remainingTime,
          qrCodeUrl: qrCodeUrl,
        });
      } else {
        setSessionData(null);
      }
    } catch (error) {
      console.error("Error fetching active session:", error);
      setSessionData(null);
    }
  }, [generateQRCode]);

  useEffect(() => {
    fetchActiveSession();
    const intervalId = setInterval(fetchActiveSession, 10000);
    return () => clearInterval(intervalId);
  }, [fetchActiveSession]);

  useEffect(() => {
    let timer;
    if (sessionData && sessionData.timeRemaining > 0) {
      timer = setInterval(() => {
        setSessionData((prevData) => {
          if (!prevData || prevData.timeRemaining <= 1) {
            clearInterval(timer);
            return null;
          }
          return {
            ...prevData,
            timeRemaining: prevData.timeRemaining - 1,
          };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionData]);

  const startSession = useCallback(
    async (data) => {
      const qrCodeUrl = await generateQRCode(data.sessionCode);
      setSessionData({
        ...data,
        timeRemaining: data.timeRemaining || data.expirationMinutes * 60,
        qrCodeUrl: qrCodeUrl,
      });
    },
    [generateQRCode]
  );

  const endSession = useCallback(async () => {
    if (sessionData) {
      try {
        await authservice.endSession(sessionData.sessionID);
        setSessionData(null);
      } catch (error) {
        console.error("Error ending session:", error);
        throw error;
      }
    }
  }, [sessionData]);

  const refreshSession = useCallback(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  return (
    <SessionContext.Provider
      value={{
        sessionData,
        startSession,
        endSession,
        refreshSession,
        generateQRCode,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
