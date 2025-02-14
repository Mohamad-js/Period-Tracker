import { useState, useEffect } from "react";
import PersianCalendar from "./components/calendar/PersianCalendar";
import OnboardingScreen from "./components/boarding/onBoarding";
import { LocalNotifications } from '@capacitor/local-notifications';


const App = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    // Check if the user has already completed onboarding
    const periodStartDate = localStorage.getItem("periodStartDate");
    const cycleLength = localStorage.getItem("cycleLength");
    return periodStartDate && cycleLength;
  });

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  useEffect(() => {
   const registerNotifications = async () => {
     await LocalNotifications.requestPermissions();
     await LocalNotifications.registerNotificationChannels([
       {
         id: 'period-reminder',
         name: 'Period Reminder',
         importance: 4,
         sound: null,
       },
     ]);
   };
   registerNotifications();
 }, []);

  return (
    <div>
      {isOnboardingComplete ? (
        <PersianCalendar />
      ) : (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
};

export default App;