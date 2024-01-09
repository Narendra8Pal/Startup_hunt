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
import {
  doc,
  addDoc,
  collection,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//other packages
import { Tooltip } from "react-tooltip";

type ImageState = {
  selectedImage: string | null;
};

type ModalProps = {
  pathname?: any;
  setOpnAddProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  opnAddProjectModal: boolean;
  profileModal?: boolean;
  setProfileModal?: React.Dispatch<React.SetStateAction<boolean>>;
  opnEditProject: boolean;
  setOpnEditProject: React.Dispatch<React.SetStateAction<boolean>>;
  setImageState?: React.Dispatch<React.SetStateAction<ImageState>>;
  imageState?: ImageState;
};

const Modal = (props: ModalProps) => {
  const [xUsername, setXUsername] = useState<string>("");
  const [githubUsername, setGithubUsername] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDesc, setProjectDesc] = useState<string>("");
  const [webLink, setWebLink] = useState<string>("");
  const [gitLink, setGitLink] = useState<string>("");
  const [uid, setUid] = useState<string>("");

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userName.user);
  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );

  const db = getFirestore(FirebaseApp);

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes());
    }
  }, [emblaApi]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid, "user uuid");
        setUid(uid);
      }
    });
  }, []);

  const handleChange =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      switch (key) {
        case "modalUsername":
          dispatch(setUser(e.target.value));
          break;
        case "githubUsername":
          setGithubUsername(e.target.value);
          break;
        case "xUsername":
          setXUsername(e.target.value);
          break;
        case "projectTitle":
          setProjectTitle(e.target.value);
          break;
        case "desc":
          setProjectDesc(e.target.value);
          break;
        case "web_link":
          setWebLink(e.target.value);
          break;
        case "git_link":
          setGitLink(e.target.value);
          break;
        default:
          break;
      }
    };

  const pfDataToUpdate = async () => {
    const docRef = doc(db, "users", userDocId);
    await updateDoc(docRef, {
      username: user,
      twitterUsername: xUsername,
      githubUsername: githubUsername,
    });
    props.setProfileModal?.(false);
    // uploadFile();
  };

  useEffect(() => {
    const getUserData = () => {
      getDoc(doc(db, "users", userDocId))
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            dispatch(setUser(data.username));
            setGithubUsername(data.githubUsername);
            setXUsername(data.twitterUsername);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document: ", error);
        });
    };
    if (userDocId) {
      getUserData();
    }
  }, [userDocId, props.profileModal]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      props.setImageState?.({ selectedImage: URL.createObjectURL(img) });

      const storage = getStorage();

      const storageRef = ref(storage);

      const imagesRef = ref(storageRef, "images");

      const fileName = "profile.jpg";
      const spaceRef = ref(imagesRef, fileName);
      const path = spaceRef.fullPath;
      const name = spaceRef.name;
      const imagesRefAgain = spaceRef.parent;
      uploadBytes(storageRef, img).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });
    }
  };

  const handleCreateProject = async () => {
    const docRef = await addDoc(collection(db, "projects"), {
      Project_title: projectTitle,
      description: projectDesc,
      github_link: gitLink,
      userId: uid,
      web_link: webLink,
    });
    props.setOpnAddProjectModal(false);
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
                      <input
                        className={styles.title_input}
                        type="text"
                        onChange={handleChange("projectTitle")}
                        value={projectTitle}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className={styles.project_desc}>
                      Tell anything about your project
                    </h2>
                    <div className={styles.desc_div}>
                      <textarea
                        className={styles.desc_textarea}
                        onChange={handleChange("desc")}
                        value={projectDesc}
                      />
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
                        <input
                          type="text"
                          className={styles.link_input}
                          onChange={handleChange("web_link")}
                          value={webLink}
                        />
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
                        <input
                          type="text"
                          className={styles.link_input}
                          onChange={handleChange("git_link")}
                          value={gitLink}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.create_div}>
                  <button
                    className={styles.create_btn}
                    onClick={handleCreateProject}
                  >
                    Create
                  </button>
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
            onClick={() => props.setProfileModal?.(false)}
          >
            <div
              className={styles.add_profile_modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modal_container}>
                <div className={styles.pf_modal_content}>
                  <div className={styles.pf_img_input}>
                    <div className={styles.pf_img_div}>
                      {/* <img
                        src={imageState.selectedImage || "userDefaultImg"}
                        className={styles.pf_img}
                      /> */}
                      <label
                        htmlFor="fileInput"
                        className={styles.addPhotoLabel}
                      >
                        <img
                          src="/addPhoto.png"
                          className={styles.addPhotoIcon}
                          alt="Add Photo"
                        />
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        id="fileInput"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </div>

                    <div className={styles.pf_name_input}>
                      <h2>Username</h2>
                      <input
                        type="text"
                        className={styles.common_input}
                        value={user}
                        onChange={handleChange("modalUsername")}
                      />
                    </div>
                  </div>

                  <div className={styles.pf_social_img_input}>
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
                        onChange={handleChange("xUsername")}
                        value={xUsername}
                        data-tooltip-id="usernameTooltip"
                        data-tooltip-content="Enter a valid Twitter username"
                      />
                    </div>
                  </div>

                  <div className={styles.pf_social_img_input}>
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
                        onChange={handleChange("githubUsername")}
                        value={githubUsername}
                        data-tooltip-id="usernameTooltip"
                        data-tooltip-content="Enter a valid Github username"
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

      <Tooltip id="usernameTooltip" place="right" />
    </>
  );
};

export default Modal;
