import { useState, useRef, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toJalaali } from "jalaali-js";
import { differenceInDays } from "date-fns";
import back from './../../assets/images/main.jpg';
import styles from './calendar.module.css';

const PersianCalendar = () => {

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

   const [cycleLength, setCycleLength] = useState(() => {
      const savedCycleLength = localStorage.getItem("cycleLength");
      return savedCycleLength ? savedCycleLength : "28"; // Default is "28" as string
   });
   const datePickerRef = useRef(null);

   // Function to calculate the next period date
   const calculateNextPeriodDate = (startDate, cycleLength = 28) => {
      if (!startDate) return null;
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + parseInt(cycleLength));
      return nextDate;
   };

   // Handle period start date change
   const handlePeriodStartDateChange = (dateObject) => {
      if (!dateObject) return;

      const date = dateObject.toDate();
      if (date > today) {
      alert("تاریخ شروع نباید بعد از تاریخ امروز باشد!");
      return;
      }

      setPeriodStartDate(date);
      const nextDate = calculateNextPeriodDate(date, cycleLength);
      setNextPeriodDate(nextDate);

      // Save to local storage
      localStorage.setItem("periodStartDate", date.toISOString());
      localStorage.setItem("nextPeriodDate", nextDate.toISOString());
   };

   // Handle cycle length change (allow free typing)
   const handleCycleLengthChange = (e) => {
      setCycleLength(e.target.value); // Allow free typing
   };

   // Enforce range constraints on blur
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

// Determine the current info of the menstrual cycle
const getPhaseInfo = () => {
   if (!cycleLength) return "دوره شما تنظیم نشده است.";
   const cycleLengthNum = parseInt(cycleLength, 10);
   const ovulationDay = Math.floor(0.7 * cycleLengthNum); // Approximate ovulation day

   if (cycleDay == 0) {
   return (
      <>
         <div className={styles.periodTitle}>
            توضیحات در آپدیت بعدی
         </div>
      </>
   );
   } else if (cycleDay == 1) {
      return (
         <>
            <div className={styles.periodTitle}>
            توضیحات در آپدیت بعدی
            </div>
         </>
      );
   } else if (cycleDay == 2) {
      return (
         <>
            <div className={styles.periodTitle}>
            توضیحات در آپدیت بعدی
            </div>
         </>
      );
   } else if (cycleDay == 3) {
      return (
         <>
            <div className={styles.periodTitle}>
            توضیحات در آپدیت بعدی
            </div>
         </>
      );
   } else if (cycleDay == 4) {
      return (
         <>
            <div className={styles.periodTitle}>
            توضیحات در آپدیت بعدی
            </div>
         </>
      );
   } else if (cycleDay <= ovulationDay - 5) {
      return (
         <>
            <div className={styles.periodTitle}>
            توضیحات در آپدیت بعدی
            </div>
         </>
      );
   } else if (cycleDay === ovulationDay) {
      return (
         <>
            <div className={styles.periodTitle}>
            توضیحات در آپدیت بعدی
            </div>
         </>
      );
   } else if (cycleDay <= cycleLengthNum - 9) {
      return (
         <>
            <div className={styles.periodTitle}>
            توضیحات در آپدیت بعدی
            </div>
         </>
      );
   } else {
      return (
         <>
            <div className={styles.periodTitle}>
            توضیحات در آپدیت بعدی
            </div>
         </>
      );
   }
};

  const getPhaseTitle = () => {
   if (!cycleLength) return "دوره شما تنظیم نشده است.";
   const cycleLengthNum = parseInt(cycleLength, 10);
   const ovulationDay = Math.floor(0.7 * cycleLengthNum); // Approximate ovulation day

   if (cycleDay == 0) {
   return (
      <>
         <div className={styles.periodTitle}>روز اول پریودته</div>
      </>
   );
   } else if (cycleDay == 1) {
      return (
         <>
            <div className={styles.periodTitle}>روز دوم پریودته</div>
         </>
      );
   } else if (cycleDay == 2) {
      return (
         <>
            <div className={styles.periodTitle}>روز سوم پریودته</div>
         </>
      );
   } else if (cycleDay == 3) {
      return (
         <>
            <div className={styles.periodTitle}>روز چهارم پریودته</div>
         </>
      );
   } else if (cycleDay == 4) {
      return (
         <>
            <div className={styles.periodTitle}>روز پنجم پریودته</div>
         </>
      );
   } else if (cycleDay <= ovulationDay - 5) {
      return (
         <>
            <div className={styles.periodTitle}>فاز فولیکولار</div>
         </>
      );
   } else if (cycleDay === ovulationDay) {
      return (
         <>
            <div className={styles.periodTitle}>آغاز تخمک گذاری</div>
         </>
      );
   } else if (cycleDay <= cycleLengthNum - 9) {
      return (
         <>
            <div className={styles.periodTitle}>فاز لوتئال</div>
         </>
      );
   } else {
      return (
         <>
            <div className={styles.periodTitle}>فاز PMS</div>
         </>
      );
   }
}

  // Reset the period start date when the button is clicked
  const handleNewPeriodStart = () => {
    setPeriodStartDate(today);
    const nextDate = calculateNextPeriodDate(today, cycleLength);
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
        <div className={styles.curDate}>
          <div>تاریخ امروز:</div>
          <p>{toPersianNumber(toPersianDateString(today))}</p>
        </div>
        <div className={styles.cycleAveHolder}>
          <label>میانگین هر سیکلت:</label>
          <input
            className={styles.aveCycle}
            type="number"
            value={cycleLength}
            onChange={handleCycleLengthChange}
            onBlur={handleCycleLengthBlur} // Enforce range constraints on blur
            placeholder="طول دوره (21-45 روز)"
          />
        </div>
        <div className={styles.pickingHolder}>
          <label>تاریخ شروع پریودت:</label>
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
                  <button
                    onClick={handleNewPeriodStart}
                    className={styles.restartButton}
                    aria-label="شروع دوره جدید"
                  >
                    پریود شدم
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      {/* Display the current phase */}
         <div className={styles.phaseInfo}>
            <div className={styles.title}>وضعیت فعلیت:{getPhaseTitle()}</div>
            <div className={styles.info}>{getPhaseInfo()}</div>
         </div>
      </div>

    </div>
  );
};

export default PersianCalendar;