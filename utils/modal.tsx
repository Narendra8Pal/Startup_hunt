import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import styles from '@/styles/profile.module.css'
import useEmblaCarousel from "embla-carousel-react";

const Modal: React.FC  = () => {
    // const [opnAddProjectModal, setOpnAddProjectModal] = useState<boolean>(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });


    useEffect(() => {
        if (emblaApi) {
          console.log(emblaApi.slideNodes());
        }
      }, [emblaApi]);





  return (
    <>
    <div className={styles.modal_div}></div>
    <div
      className={styles.add_modal_bg}
    //   onClick={() => setOpnAddProjectModal(false)}
    >
      <div
        className={styles.add_project_modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal_container}>
          <div className={styles.modal_content}>
            <div className={styles.project_title_input}>
              <h2 className={styles.project_title}>Project title</h2>
              <div className={styles.title_div}>
                <input className={styles.title_input} type="text" />
              </div>
            </div>

            <div>
              <h2 className={styles.project_desc}>
                Tell anything about your project
              </h2>
              <div className={styles.desc_div}>
                <textarea className={styles.desc_textarea} />
              </div>
            </div>

            <div>
              <h2 className={styles.carousel_title}>Embed Img & Video</h2>
              <div className={styles.carousel_container}>
                <div className={styles.embla} ref={emblaRef}>
                  <div className={styles.embla__container}>
                    <div className={styles.embla__slide}>Slide 1</div>
                    <div className={styles.embla__slide}>Slide 2</div>
                    <div className={styles.embla__slide}>Slide 3</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex mb-6">
                <div>
                  <Image
                    src="/addLink.png"
                    alt="websiteLink"
                    width={30}
                    height={30}
                    priority={true}
                  />
                </div>
                <div className="flex flex-col ml-8">
                  <h2 className="mb-2 text-sm font-semibold">
                    Add project link
                  </h2>
                  <input type="text" className={styles.link_input} />
                </div>
              </div>

              <div className="flex mb-6">
                <div>
                  <Image
                    src="/addLink.png"
                    alt="githubLink"
                    width={30}
                    height={30}
                    priority={true}
                  />
                </div>

                <div className="flex flex-col ml-8">
                  <h2 className="mb-2 text-sm font-semibold">
                    Add github link
                  </h2>
                  <input type="text" className={styles.link_input} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.save_div}>
            <button className={styles.save_btn}>Create</button>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default Modal