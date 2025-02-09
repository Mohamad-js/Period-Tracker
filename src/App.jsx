import { useState } from "react";
import PersianCalendar from "./components/calendar/PersianCalendar";
import OnboardingScreen from "./components/boarding/onBoarding";



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