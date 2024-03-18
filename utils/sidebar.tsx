import React, { useState } from "react";
import styles from "@/styles/sidebar.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

//files
import Modal from "@/utils/modal";

//redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import { setUser } from "@/store/userName";

const Sidebar = () => {
  const router = useRouter();

  const [opnAddProjectModal, setOpnAddProjectModal] = useState<boolean>(false);
  const [opnEditProject, setOpnEditProject] = useState<boolean>(false);

  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );

  return (
    <>
      <div className={styles.left_pane}>
        <div className={styles.left_pane_inside}>
          <div className={styles.pane_items}>
            <ul className={styles.ul_items}>
              <div
                className={styles.icons_items}
                onClick={() => router.push(`/explore/${userDocId}`)}
              >
                <Image
                  src="/Compass.png"
                  alt="explore"
                  height={38}
                  width={38}
                  priority={true}
                />
                <li>Explore</li>
              </div>
              <div
                className={styles.icons_items}
                onClick={() => router.push(`/table/${userDocId}`)}
              >
                <Image
                  src="/Grid.png"
                  alt="grid"
                  height={38}
                  width={38}
                  priority={true}
                />
                <li>Table</li>
              </div>
              <div
                className={styles.icons_items}
                onClick={() => router.push(`/tasks/${userDocId}`)}
              >
                <Image
                  src="/View Module.png"
                  alt="tasks&feedback"
                  height={38}
                  width={38}
                  priority={true}
                />
                <li>Tasks & Feedback</li>
              </div>
              <div
                className={styles.icons_items}
                onClick={() => router.push(`/profile/${userDocId}`)}
              >
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

          <div
            className={styles.btn_div}
            onClick={() => setOpnAddProjectModal(true)}
          >
            <button>Add</button>
          </div>
        </div>
      </div>

      <Modal
        setOpnAddProjectModal={setOpnAddProjectModal}
        opnAddProjectModal={opnAddProjectModal}
        opnEditProject={opnEditProject}
        setOpnEditProject={setOpnEditProject}
      />
    </>
  );
};

export default Sidebar;
