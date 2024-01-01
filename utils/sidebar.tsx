import React from "react";
import styles from "@/styles/sidebar.module.css";
import Image from "next/image";

const Sidebar: React.FC = () => {
  return (
    <>
      <div className={styles.left_pane}>
        <div className={styles.left_pane_inside}>
          <div className={styles.pane_items}>
            <ul className={styles.ul_items}>
              <div className={styles.icons_items}>
                <Image
                  src="/Compass.png"
                  alt="explore"
                  height={38}
                  width={38}
                  priority={true}
                />
                <li>Explore</li>
              </div>
              <div className={styles.icons_items}>
                <Image
                  src="/Grid.png"
                  alt="grid"
                  height={38}
                  width={38}
                  priority={true}
                />
                <li>Table</li>
              </div>
              <div className={styles.icons_items}>
                <Image
                  src="/View Module.png"
                  alt="tasks&feedback"
                  height={38}
                  width={38}
                  priority={true}
                />
                <li>Tasks & Feedback</li>
              </div>
              <div className={styles.icons_items}>
                <Image
                  src="/Profile.png"
                  alt="Profile"
                  height={38}
                  width={38}
                  priority={true}
                />
                <li>Profile</li>
              </div>
            </ul>
          </div>

          <div className={styles.btn_div}>
            <button>Add</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
