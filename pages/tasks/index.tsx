import React, { useState } from "react";
import styles from "@/styles/tasks.module.css";
import Image from "next/image";

const Tasks = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [taskModalContent, setTaskModalContent] = useState<boolean>(false);

  const handleModal = () => {
    setOpenModal(false);
    setTaskModalContent(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content_container}>
          <div className={styles.content_div}>
            <div className={styles.switch_btn}>
              <div className={styles.dropdown}>
                <p>switch between all tasks Projects using dropdown</p>

                <Image
                  src="/down_btn.png"
                  alt="down_btn"
                  height={30}
                  width={30}
                />
              </div>
              <div className={styles.btn_div}>
                <button
                  className={styles.btn}
                  onClick={() => setOpenModal(true)}
                >
                  create
                </button>
              </div>
            </div>

            <div className={styles.top_content}>
              <div className={styles.name_desc}>
                <h2 className={styles.title}>loop</h2>
                <p className={styles.desc}>
                  inference is the process of using a trained machine learning
                  model to make predictions or solve tasks. Inference is a test
                  of how well a model can apply information learned during
                  training.
                </p>
              </div>
            </div>

            <hr className={styles.ruler} />

            <div
              className={styles.bottom_content}
              onClick={() => setTaskModalContent(true)}
            >
              <div className={styles.btn_div}>
                <button className={styles.btn}>Add</button>
              </div>


    
















            </div>
          </div>
        </div>
      </div>

      {openModal || taskModalContent ? (
        <>
          <div className={styles.modal_div}></div>
          <div className={styles.add_modal_bg} onClick={handleModal}>
            <div
              className={styles.add_profile_modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modal_content}>
                <div>
                  <div>{taskModalContent ? "Task Title" : "Project Title"}</div>
                  <input type="text" className={styles.input} />
                </div>

                <div>
                  <div>
                    {taskModalContent
                      ? "Task Description"
                      : "Project Description"}
                  </div>
                  <textarea className={styles.textarea} />
                </div>

                {taskModalContent ? <div>Task Status</div> : null}
              </div>

              <div className={styles.btn_div}>
                <button className={styles.btn}>
                  {taskModalContent ? "Create Task" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Tasks;
