import persian from "react-date-object/calendars/persian";
import { useState } from "react";
import persian_fa from "react-date-object/locales/persian_fa";
import styles from './onBoarding.module.css';
import DatePicker from "react-multi-date-picker";
import logo from './../../assets/favicon.png'


const OnboardingScreen = ({ onComplete }) => {
   const [periodStartDate, setPeriodStartDate] = useState(null);

   const [cycleLength, setCycleLength] = useState(() => {
      const savedCycleLength = localStorage.getItem("cycleLength");
      return savedCycleLength ? savedCycleLength : "28"; // Default is "28" as string
   });
   
   // const [today, setToday] = useState(new Date());

   const [nextPeriodDate, setNextPeriodDate] = useState(() => {
      const savedNextPeriodDate = localStorage.getItem("nextPeriodDate");
      return savedNextPeriodDate ? new Date(savedNextPeriodDate) : null;
   });
  
 
   const handlePeriodStartDateChange = (dateObject) => {
      if (!dateObject) return;
  
      const date = dateObject.toDate();
      setPeriodStartDate(date);
  
      const nextDate = calculateNextPeriodDate(date, cycleLength);
      setNextPeriodDate(nextDate);
  
      // Save to local storage
      localStorage.setItem("periodStartDate", date.toISOString());
      localStorage.setItem("nextPeriodDate", nextDate.toISOString());
   };

   const calculateNextPeriodDate = (startDate, cycleLength = 28) => {
      if (!startDate) return null;
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + parseInt(cycleLength));
      return nextDate;
    };
 
    const handleCycleLengthChange = (e) => {
      const inputValue = e.target.value; // Get the raw input value
      setCycleLength(inputValue ? inputValue : 28); // Allow free typing without restrictions
   };
   
   const handleCycleLengthBlur = () => {
      let value = parseInt(cycleLength, 10); // Parse the input value
      if (isNaN(value)) {
         value = 28; // Default to 28 if invalid
      }
      value = Math.max(21, Math.min(45, value)); // Clamp to 21-45
      setCycleLength(value.toString()); // Update state with clamped value
      localStorage.setItem("cycleLength", value.toString()); // Save to local storage
   
      // Recalculate next period date if periodStartDate exists
      if (periodStartDate) {
         const nextDate = calculateNextPeriodDate(periodStartDate, value);
         setNextPeriodDate(nextDate);
         localStorage.setItem("nextPeriodDate", nextDate.toISOString());
      }
   };
 
   const handleSubmit = () => {
      if (!periodStartDate) {
         alert("لطفا تاریخ شروع پریود را وارد کنید!");
         return;
      }
 
     let value = parseInt(cycleLength, 10); // Parse the input value

      if (isNaN(value)) {
         value = 28; // Default to 28 if invalid
      }

     value = Math.max(21, Math.min(45, value)); // Clamp to 21-45

     setCycleLength(value.toString()); // Update state with clamped value
     localStorage.setItem("cycleLength", value.toString()); // Save to local storage
  
     // Recalculate next period date if periodStartDate exists
     if (periodStartDate) {
        const nextDate = calculateNextPeriodDate(periodStartDate, value);
        setNextPeriodDate(nextDate);
        localStorage.setItem("nextPeriodDate", nextDate.toISOString());
     }
 
     // Save data to local storage
     localStorage.setItem("periodStartDate", periodStartDate.toISOString());
 
     // Notify parent component to switch to the main calendar
     onComplete();
   };
 
   return (
      <div className={styles.onboardingContainer}>
         <img className={styles.logo} src={logo} alt="logo" />
         <h2>اپلیکیشن سلامت پریود پرنسسم</h2>
         <div className={styles.onboardingContent}>
            <div className={styles.inputGroup}>
               <label>تاریخ شروع آخرین پریودت رو وارد کن:</label>
               <DatePicker
                  value={periodStartDate}
                  onChange={handlePeriodStartDateChange}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  inputClass="custom-input"
               />

               <label>معمولا سیکل ماهانت چند روز طول میکشه؟</label>
               <input className={styles.aveCycle}
                  type="number"
                  value={cycleLength}
                  onChange={handleCycleLengthChange}
                  onBlur={handleCycleLengthBlur} // Enforce range constraints on blur
                  placeholder="روز"
               />
            </div>
            <button onClick={handleSubmit} className={styles.saveButton}>
               ذخیره
            </button>
         </div>

         <div className={styles.welcomeHolder}>
            <div className={styles.welcomeMsg}>تقدیم به غزلم :)</div>
         </div>

     </div>
   );
 };

export default OnboardingScreen;