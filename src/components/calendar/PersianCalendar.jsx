import { useState, useRef, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toJalaali } from "jalaali-js";
import { differenceInDays } from "date-fns";
import back from './../../assets/images/main.jpg';
import styles from './calendar.module.css';

const PersianCalendar = () => {
  // Load initial state from local storage
  const [periodStartDate, setPeriodStartDate] = useState(() => {
    const savedPeriodStartDate = localStorage.getItem("periodStartDate");
    return savedPeriodStartDate ? new Date(savedPeriodStartDate) : null;
  });
  const [nextPeriodDate, setNextPeriodDate] = useState(() => {
    const savedNextPeriodDate = localStorage.getItem("nextPeriodDate");
    return savedNextPeriodDate ? new Date(savedNextPeriodDate) : null;
  });
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [today, setToday] = useState(new Date());
  const datePickerRef = useRef(null);

  // Function to calculate the next period date
  const calculateNextPeriodDate = (startDate, cycleLength = 28) => {
    if (!startDate) return null;
    const nextDate = new Date(startDate); // Ensure startDate is a Date object
    nextDate.setDate(nextDate.getDate() + cycleLength);
    return nextDate;
  };

  // Handle period start date change
  const handlePeriodStartDateChange = (dateObject) => {
    if (!dateObject) return;
    const date = dateObject.toDate(); // Convert DateObject to Date
    setPeriodStartDate(date);
    const nextDate = calculateNextPeriodDate(date);
    setNextPeriodDate(nextDate);
    // Save to local storage
    localStorage.setItem("periodStartDate", date.toISOString());
    localStorage.setItem("nextPeriodDate", nextDate.toISOString());
  };

  // Function to convert Gregorian date to Persian (Jalali) date string
  const toPersianDateString = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return "Invalid Date";
    const { jy, jm, jd } = toJalaali(date);
    return `${jy}/${jm}/${jd}`;
  };

  // Function to convert English numbers to Persian numerals
  const toPersianNumber = (number) => {
    const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(number).replace(/\d/g, (digit) => persianNumbers[parseInt(digit)]);
  };

  // Calculate the current day of the menstrual cycle
  const calculateCycleDay = () => {
    if (!periodStartDate || !today) return null;
    const daysSinceStart = differenceInDays(today, periodStartDate);
    return Math.max(0, daysSinceStart); // Ensure non-negative value
  };

  const cycleDay = calculateCycleDay();

  // Reset the period start date when the button is clicked
  const handleNewPeriodStart = () => {
    setPeriodStartDate(today);
    const nextDate = calculateNextPeriodDate(today);
    setNextPeriodDate(nextDate);
    // Save to local storage
    localStorage.setItem("periodStartDate", today.toISOString());
    localStorage.setItem("nextPeriodDate", nextDate.toISOString());
  };

  useEffect(() => {
    if (nextPeriodDate) {
      const days = differenceInDays(nextPeriodDate, today);
      setDaysRemaining(days > 0 ? days : 0);
    }
  }, [nextPeriodDate, today]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setToday(new Date());
    }, 60 * 60 * 1000); // Update every hour
    return () => clearInterval(intervalId);
  }, []);

  const renderDay = (dateObject) => {
    const isToday = dateObject.format() === new DateObject(today).format();
    return (
      <div
        style={{
          backgroundColor: isToday ? "#ff00c8" : "",
          color: isToday ? "white" : "",
          borderRadius: "50%",
          width: "25px",
          height: "25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {toPersianNumber(dateObject.day)}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.imgHolder}>
        <img className={styles.back} src={back} alt="background flower" />
      </div>
      <div className={styles.mainHolder}>
        <div className={styles.curHolder}>
          <div className={styles.curDate}>
            <div>تاریخ امروز:</div>
            <p>{toPersianNumber(toPersianDateString(today))}</p>
          </div>
        </div>
        <div className={styles.pickingHolder}>
          <label>تاریخ شروع پریود قبلیت رو وارد کن:</label>
          <div className={styles.chooseHolder}>
            <DatePicker
              value={periodStartDate}
              onChange={handlePeriodStartDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              calendarPosition="bottom-right"
              inputClass="custom-input"
              ref={datePickerRef}
              onFocus={() => datePickerRef.current?.openCalendar()}
              renderDay={renderDay}
            />
          </div>
        </div>
      </div>
      <div className={styles.datesHolder}>
        {nextPeriodDate && (
         <div className={styles.nextHolder}>
            <div className={styles.next}>
               <h3>پریود بعدیت</h3>
               <p>{toPersianNumber(toPersianDateString(nextPeriodDate))}</p>
            </div>
            <div className={styles.buttonHolder}>
               {daysRemaining !== null && (
                  <p>
                  {daysRemaining > 0
                     ? `${toPersianNumber(daysRemaining)} روز باقی مونده`
                     : null}
                  </p>
               )}
               {cycleDay >= 21 && (

               <button onClick={handleNewPeriodStart} className={styles.restartButton}>
                  پریود شدم
               </button>

               )}
            </div>
         </div>
        )}
      </div>
    </div>
  );
};

export default PersianCalendar;