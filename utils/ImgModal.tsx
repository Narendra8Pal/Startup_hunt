import React, { useState } from "react";
import styles from "@/styles/ImgModal.module.css";

type ImgModalProps = {
  selectedUrl: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const ImgModal = (props: ImgModalProps) => {
  return (
    <>
      <div className={styles.ImgModal_div}></div>
      <div className={styles.modalOverlay} onClick={props.onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          {/* <div onClick={props.onPrev}  className={styles.prev_navButton}>
          <button className={styles.prevBtn}>Previous</button>
        </div> */}
          <img
            src={props.selectedUrl}
            alt={`project_img_${props.selectedUrl}`}
            className={styles.modalImage}
          />
          {/* <div  onClick={props.onNext} className={styles.next_navButton}>
          <button className={styles.nextBtn}>Next</button>
        </div> */}
        </div>
      </div>
    </>
  );
};

export default ImgModal;
