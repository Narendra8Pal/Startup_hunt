import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "../styles/profile.module.css";

export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel();

  return (
    <>
      <div className={styles.carousel_container}>
        <div className={styles.slider} ref={emblaRef}>
            <div className={styles.slider__container}>
              <div className={styles.slider__slide}>
                <img
                  src={img}
                  alt={`project_img_${imgIndex}`}
                  className={styles.slider_img}
                />
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
