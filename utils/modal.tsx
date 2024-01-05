import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/profile.module.css";
import useEmblaCarousel from "embla-carousel-react";

type ModalProps = {
  setOpnAddProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  opnAddProjectModal: boolean;
  profileModal: boolean;
  setProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
  opnEditProject: boolean;
  setOpnEditProject: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal = ({
  setOpnAddProjectModal,
  opnAddProjectModal,
  profileModal,
  setProfileModal,
  opnEditProject,
  setOpnEditProject,
}: ModalProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes());
    }
  }, [emblaApi]);

  return (
    <>
      {opnAddProjectModal && (
        <>
          <div className={styles.modal_div}></div>
          <div
            className={styles.add_modal_bg}
            onClick={() => setOpnAddProjectModal(false)}
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
                    <div className={styles.img_input}>
                      <div>
                        <Image
                          src="/addLink.png"
                          alt="websiteLink"
                          width={30}
                          height={30}
                          priority={true}
                        />
                      </div>
                      <div className={styles.h2_input}>
                        <h2 className={styles.input_head}>Add project link</h2>
                        <input type="text" className={styles.link_input} />
                      </div>
                    </div>

                    <div className={styles.img_input}>
                      <div>
                        <Image
                          src="/addLink.png"
                          alt="githubLink"
                          width={30}
                          height={30}
                          priority={true}
                        />
                      </div>

                      <div className={styles.h2_input}>
                        <h2 className={styles.input_head}>Add github link</h2>
                        <input type="text" className={styles.link_input} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.create_div}>
                  <button className={styles.create_btn}>Create</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {profileModal && (
        <>
          <div className={styles.modal_div}></div>
          <div
            className={styles.add_modal_bg}
            onClick={() => setProfileModal(false)}
          >
            <div
              className={styles.add_profile_modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modal_container}>
                <div className={styles.pf_modal_content}>
                  <div className={styles.pf_img_input}>
                    <div className={styles.pf_img_div}>
                      <img src="" className={styles.pf_img} />
                    </div>

                    <div className={styles.pf_name_input}>
                      <h2>Username</h2>
                      <input type="text" className={styles.common_input} />
                    </div>
                  </div>

                  <div className={styles.pf_img_input}>
                    <div className={styles.pf_socials}>
                      <Image
                        src="/twitter.png"
                        alt="twitterLink"
                        width={20}
                        height={20}
                        priority={true}
                      />
                    </div>

                    <div className={styles.h2_input}>
                      <h2 className={styles.input_head}>
                        Your twitter username
                      </h2>
                      <input type="text" className={styles.link_input} />
                    </div>
                  </div>

                  <div className={styles.pf_img_input}>
                    <div className={styles.pf_socials}>
                      <Image
                        src="/github.png"
                        alt="githubLink"
                        width={20}
                        height={20}
                        priority={true}
                      />
                    </div>

                    <div className={styles.h2_input}>
                      <h2 className={styles.input_head}>
                        Your github username
                      </h2>
                      <input type="text" className={styles.link_input} />
                    </div>
                  </div>

                  <div className={styles.save_div}>
                    <button className={styles.save_btn}>Save Profile</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {opnEditProject && (
        <>
          <div className={styles.modal_div}></div>
          <div
            className={styles.add_modal_bg}
            onClick={() => setOpnEditProject(false)}
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
                    <div className={styles.img_input}>
                      <div>
                        <Image
                          src="/addLink.png"
                          alt="websiteLink"
                          width={30}
                          height={30}
                          priority={true}
                        />
                      </div>
                      <div className={styles.h2_input}>
                        <h2 className={styles.input_head}>Add project link</h2>
                        <input type="text" className={styles.link_input} />
                      </div>
                    </div>

                    <div className={styles.img_input}>
                      <div>
                        <Image
                          src="/addLink.png"
                          alt="githubLink"
                          width={30}
                          height={30}
                          priority={true}
                        />
                      </div>

                      <div className={styles.h2_input}>
                        <h2 className={styles.input_head}>Add github link</h2>
                        <input type="text" className={styles.link_input} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.create_div}>
                  <button className={styles.create_btn}>Edit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
