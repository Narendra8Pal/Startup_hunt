import React from "react";
import styles from "@/styles/startups.module.css";

const Startups: React.FC = () => {
  return (
    <>
      <div className={styles.nav}>
        <h2 className={styles.title}>loop</h2>

        <div className={styles.nav_items}>loop</div>

        <div className={styles.usr_info}>
          <h2>username</h2>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.add}>
          <button className={styles.btn}>Add</button>
        </div>

        <div className={styles.startups_info}>
          <div className={styles.startups_list}>
            <div className={styles.startups_img}>
            <img src=""/>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Startups;
