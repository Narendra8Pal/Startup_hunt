//files, style, next.js
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/profile.module.css";
import useEmblaCarousel from "embla-carousel-react";

//redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import { setUser } from "@/store/userName";

//firebase
import FirebaseApp from "../utils/firebase";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, updateDoc } from "firebase/firestore";
const db = getFirestore(FirebaseApp);

type ModalProps = {
  setOpnAddProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  opnAddProjectModal: boolean;
  profileModal: boolean;
  setProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
  opnEditProject: boolean;
  setOpnEditProject: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal = (props: ModalProps) => {
  const [xUsername, setXUsername] = useState<string>("");
  const [githubUsername, setGithubUsername] = useState<string>("");

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userName.user);
  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes());
    }
  }, [emblaApi]);

  const handleModalUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUser(e.target.value));
  };

  const handleGithubUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithubUsername(e.target.value);
  };

  const handleXUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setXUsername(e.target.value);
  };

  const pfDataToUpdate = async () => {
    const userDataRef = doc(db, "users", `${userDocId}`);
    await setDoc(userDataRef, {
      username: user,
    });

    await updateDoc(userDataRef, {
      username: userDocId,
      twitterUsername: xUsername,
      githubUsername: githubUsername,
    });
  };

  return (
    <>
      {props.opnAddProjectModal && (
        <>
          <div className={styles.modal_div}></div>
          <div
            className={styles.add_modal_bg}
            onClick={() => props.setOpnAddProjectModal(false)}
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

      {props.profileModal && (
        <>
          <div className={styles.modal_div}></div>
          <div
            className={styles.add_modal_bg}
            onClick={() => props.setProfileModal(false)}
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
                      <input
                        type="text"
                        className={styles.common_input}
                        value={user}
                        onChange={handleModalUsername}
                      />
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
                      <input
                        type="text"
                        className={styles.link_input}
                        onChange={handleXUsername}
                      />
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
                      <input
                        type="text"
                        className={styles.link_input}
                        onChange={handleGithubUsername}
                      />
                    </div>
                  </div>

                  <div className={styles.save_div}>
                    <button
                      className={styles.save_btn}
                      onClick={pfDataToUpdate}
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {props.opnEditProject && (
        <>
          <div className={styles.modal_div}></div>
          <div
            className={styles.add_modal_bg}
            onClick={() => props.setOpnEditProject(false)}
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
