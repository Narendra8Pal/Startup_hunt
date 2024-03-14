import React from "react";
import styles from "@/styles/table.module.css";

const Table = () => {


    






  return (









    <div className={styles.container}>
      <div className={styles.content_container}>
        <div className={styles.content_div}>
          <div className={styles.heading}>View Tasks</div>
          <div className={styles.bg_box}>is this working or notd</div>

          <div className={styles.selection}>
            <ul className={styles.selection_bg}>
              <li className={styles.selected}>All Tasks</li>
              <li className={styles.selected}>Users</li>
            </ul>
          </div>

          <div className={styles.tasks_list}>
            <div className={styles.list_content}>
              <div className={styles.box}>
                <div className={styles.date_day}>
                  <ul className={styles.date_day_ul}>
                    <li className={styles.day}>Wed</li>
                    <li className={styles.date}>8</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
