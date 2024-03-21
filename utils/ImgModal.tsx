import React from "react";
import styles from "@/styles/ImgModal.module.css";

type ImgModalProps = {
  images: string[];
  selectedIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const ImgModal = (props: ImgModalProps) => {
  const image = props.images[props.selectedIndex];

  return (
    <div className={styles.modalOverlay} onClick={props.onClose}>
      <div className={styles.modalContent}>
        <button onClick={props.onPrev} className={styles.navButton}>
          Previous
        </button>
        <img
          src={image}
          alt={`project_img_${props.selectedIndex}`}
          className={styles.modalImage}
        />
        <button onClick={props.onNext} className={styles.navButton}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ImgModal;
