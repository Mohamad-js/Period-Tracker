import { useState, useRef, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toJalaali } from "jalaali-js";
import { differenceInDays } from "date-fns";
import back from './../../assets/images/main.jpg';
import styles from './calendar.module.css';
import { LocalNotifications } from '@capacitor/local-notifications';



const PersianCalendar = () => {

   const [info,setInfo] = useState(true)
   const [diet,setDiet] = useState(false)
   const [actions,setActions] = useState(false)

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

   // Determine the current info of the menstrual cycle
   const getPhaseInfo = () => {
      if (!cycleLength) return "دوره شما تنظیم نشده است.";
      const cycleLengthNum = parseInt(cycleLength, 10);
      const ovulationDay = Math.floor(0.7 * cycleLengthNum); // Approximate ovulation day

      if (cycleDay < 5) {
      return (
         <>
            <div>
               <p>
               لایه های داخلی رحم نازت که اسم شون آندومتره باید از دیواره های رحم جدا بشن چون دیگه قرار نیست نوزادی شکل بگیره. رحم هم خودشو منقبض و منبسط میکنه تا آندومترها از دیواره داخلیش جدا بشن. برای همین احساس درد و التهاب ایجاد میکنه. و درد هایی که ایجاد میکنه بخاطر تحریک سیستم عصبی، ممکنه از بالا تا کمر و از پایین تا زانوهات ادامه داشته باشه. الهی همه ی این دردات به جونم.
               </p>
               <p>
               وقتی آندومترها جدا میشن باعث خونریزی میشن و این خون باید از طریق واژنت خارج بشه. به همین دلیل ممکنه لخته های خون هم همراه خون پریودت باشه. این لخته ها معمولا اندازه های کوچیک و بزرگ دارن اما اگه از حد عادی بزرگتر بودن بهم بگو.
               </p>
               <p>
               امروز سطح هورمون های استروژن و پرژسترون بدنت به شدت کم میشه و همین باعث ضعف توی مفاصل و بدنت میشه و ممکنه سردرد بگیری. گاهی وقت ها یک طرف سر و گاهی تمام سر. دردش ممکنه تا گردنت هم بیاد. اگه از حد قابل تحملت بیشتر شد حتما بهم بگو. کاهش این دو تا هورمون ممکنه باعث تورم و التهاب سینه هاتم بشه که در این صورت باید از لباس گشاد استفاده کنی که سینه های ناناز من اذیت نشن. بوس به هر دوتاشون که. 
               </p>

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

   console.log(cycleDay);

   const getPhaseDiet = () => {
      if (!cycleLength) return "دوره شما تنظیم نشده است.";
      const cycleLengthNum = parseInt(cycleLength, 10);
      const ovulationDay = Math.floor(0.7 * cycleLengthNum); // Approximate ovulation day

      if (cycleDay < 5) {
      return (
         <>
            <div className={styles.periodTitle}>
               <p style={{marginBottom: "10px"}}>اولویت های غذایی دوران پریود:</p>
               <h4>۱. آهن</h4>
               <p>
               برای بهتر شدن تهوعت و کمتر شدن حس خستگی یا ضعفت باید آهنی که بدنت داره با خونریزی از دست میده دوباره جایگزین کنی. برای همین رژیم غذاییت رو پر از آهن بکن و برای جذب بهتر آن، چایی را با یک ساعت فاصله مصرف کن. منابع غنی آهن:
               </p>
               <p style={{marginBottom: '10px'}}>اسفناج - گوشت قرمز - تخم مرغ - میگو - عدس و لوبیا- آب آلو
                  
               </p>
               <h4>۲. ویتامین C</h4>
               <p>
               برای اینکه بدنت بتونه از آهن موجود توی خوراکی های مختلف به خوبی استفاده کنه و حداکثر اون رو جذب کنه باید ویتامین C بدنت رو بالا نگهداری. منابع غنی ویتامین C:
               </p>
               <p style={{marginBottom: '10px'}}>
                  انبه - کلم بروکلی - کیوی - لیمو - گوجه فرنگی - کاهو - قرص جوشان ویتامین C
               </p>
               <h4>۳. کلسیم</h4>
               <p>
                  بالا نگه داشتن کلسیم بدنت باعث میشه دردهای استخونی و عضلانیت کمتر بشن. اما لبنیات پرچرب نخور چون باعث جوش های بعد پریود میشه. منابع غنی کلسیم:
               </p>
               <p style={{marginBottom: '10px'}}>
                  اسفناج - کاهو - شیر و پنیر کم چرب
               </p>
               <h4>۴. ویتامین D</h4>
               <p>
                  بالا نگه داشتن ویتامین D هم کمک میکنه دردهای استخونی و عضلانیت بهتر بشه. منابع غنی ویتامین D:
               </p>
               <p style={{marginBottom: '10px'}}>
                  ماهی چرب - ماهی سالمون - ماهی غزل آلا - ماهی تن
               </p>
               <h4>۵. آب</h4>
               <p>
                  برای بهتر شدن سردردهات و هیدراته موندن بدنت باید سعی کنی تا روز پنجم پریودت روزی ۲ لیتر آب بخوری.
               </p>
            </div>
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

   const getPhaseActions = () => {
      if (!cycleLength) return "دوره شما تنظیم نشده است.";
      const cycleLengthNum = parseInt(cycleLength, 10);
      const ovulationDay = Math.floor(0.7 * cycleLengthNum); // Approximate ovulation day

      if (cycleDay == 0) {
      return (
         <>
            <div className={styles.periodTitle}>
               وقتی پریود هستی پیاده روی میتونه دردهای بدنیت رو کمتر کنه اما به شرطی که بیشتر از ۲۰ دقیقه نشه و با سرعت ملایم قدم برداری. در این صورت مفیده.
            </div>
            <div className={styles.periodTitle}>
               حمام کردن توی روزهای اول و دوم ممکنه دردت رو بدتر کنه و خونریزیت رو شدیدتر کنه. اما از روز سوم می تونی دوش آب گرم کوتاه حداکثر ۱۵ دیقه ای بگیری.
            </div>
            <div className={styles.periodTitle}>
               برای کمتر شدنن دردهای پریود باید خواب کافی داشته باشی و شب ها ۶ تا ۸ ساعت بخوابی.
            </div>
            <div className={styles.periodTitle}>
               سعی کن بیشتر از نیم ساعت توی یه حالت نباشی. هر نیم ساعت یبار تغییر حالت بده چون موندن در یک حالت به مدت طولانی، دردهای پریودت رو تشدید میکنه.
            </div>
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
  
  
   function showInfo() {
      setInfo(true);
      setDiet(false);
      setActions(false);
   }

   function showDiet() {
      setInfo(false);
      setDiet(true);
      setActions(false);
   }

   function showActions() {
      setInfo(false);
      setDiet(false);
      setActions(true);
   }
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



   const calculatePmsDate = (cycleLength) => {
      const cycleLengthNum = parseInt(cycleLength, 10);
      const pmsStartDay = cycleLengthNum - 9; // PMS starts 9 days before the next period
      return pmsStartDay;
   };
 
   const calculateNotificationDates = (nextPeriodDate, cycleLength) => {
      if (!nextPeriodDate || !cycleLength) return [];

      const cycleLengthNum = parseInt(cycleLength, 10);
      const pmsStartDay = calculatePmsDate(cycleLength);

      // 5 days before PMS
      const fiveDaysBeforePms = new Date(nextPeriodDate);
      fiveDaysBeforePms.setDate(fiveDaysBeforePms.getDate() - (pmsStartDay + 5));

      // Daily during the period (first 5 days)
      const periodNotifications = [];
      for (let i = 0; i < 5; i++) {
         const notificationDate = new Date(nextPeriodDate);
         notificationDate.setDate(notificationDate.getDate() - (5 - i));
         periodNotifications.push(notificationDate);
      }

      return [fiveDaysBeforePms, ...periodNotifications];
   };

   const scheduleNotifications = async (nextPeriodDate, cycleLength) => {
      const notificationDates = calculateNotificationDates(nextPeriodDate, cycleLength);
      
      for (let i = 0; i < notificationDates.length; i++) {
         const date = notificationDates[i];
         const title = i === 0 ? '5 روز تا PMS' : `روز ${i} پریود`;
         const body = i === 0 ? 'آماده شوید برای PMS' : 'مراحل پریود خود را مدیریت کنید';
      
         await LocalNotifications.schedule({
            notifications: [
            {
               title,
               body,
               id: i + 1, // Unique ID for each notification
               schedule: { at: date },
               attachments: null,
               actionTypeId: '',
               extra: null,
            },
            ],
         });
      }
   };

   useEffect(() => {
      if (nextPeriodDate && cycleLength) {
        scheduleNotifications(nextPeriodDate, cycleLength);
      }
    }, [nextPeriodDate, cycleLength]);

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
            <div className={styles.info}>
               <div className={styles.tabsHolder}>
                  <button className={info ? styles.active : null} onClick={showInfo}>توضیحات</button>
                  <button className={diet ? styles.active : null} onClick={showDiet}>رژیم غذایی</button>
                  <button className={actions ? styles.active : null} onClick={showActions}>فعالیت ها</button>
               </div>
               <div className={styles.display}>
               {
                  info ?
                  <div className={styles.displayText}>{getPhaseInfo()}</div>
                  : diet ?
                  <div className={styles.displayText}>{getPhaseDiet()}</div>
                  : actions ?
                  <div className={styles.displayText}>{getPhaseActions()}</div>
                  : null
               }
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default PersianCalendar;