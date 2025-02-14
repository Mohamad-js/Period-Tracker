import './../../global.css'
import styles from './ham.module.css'




function Hamburger(){




   return(
      <>
         <div className={styles.container}>
            <div className={styles.menu}>
               <div className={styles.item}>صفحه اصلی</div>
               <div className={styles.item}></div>
               <div className={styles.item}></div>
               <div className={styles.item}></div>
               <div className={styles.item}></div>
            </div>
         </div>
      </>
   )
}

export default Hamburger;