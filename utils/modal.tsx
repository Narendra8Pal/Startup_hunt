//files, style, next.js
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/profile.module.css";
import { MouseEventHandler } from "react";

//redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import { setUser } from "@/store/userName";
import { setImgUrl } from "@/store/imgURL";

//firebase
import FirebaseApp from "../utils/firebase";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  addDoc,
  collection,
  getDoc,
  updateDoc,
  deleteField,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  UploadTask,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
//other packages
import { Tooltip } from "react-tooltip";

// type ImageState = {
//   selectedImage: File | null;
// };

type Project = {
  id: string;
  Project_title: string;
  description: string;
  github_link: string;
  userId: string;
  web_link: string;
  project_img: string[];
};

type Project_img = string[];

type ModalProps = {
  pathname?: any;
  setOpnAddProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  opnAddProjectModal: boolean;
  profileModal?: boolean;
  setProfileModal?: React.Dispatch<React.SetStateAction<boolean>>;
  opnEditProject: boolean;
  setOpnEditProject: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFile?: React.Dispatch<React.SetStateAction<File | null>>;
  selectedFile?: File | null;
  editProjObj?: Project;
};

const Modal = (props: ModalProps) => {
  const [xUsername, setXUsername] = useState<string>("");
  const [githubUsername, setGithubUsername] = useState<string>("");
  const [webLink, setWebLink] = useState<string>("");
  const [gitLink, setGitLink] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [userImgURL, setUserImgURL] = useState<string>("");
  const [uploadPfImg, setUploadPfImg] = useState<boolean>(false);
  const [uploadImg, setUploadImg] = useState<boolean>(false);
  const [projectImg, setProjectImg] = useState<Project_img>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imgStoredURL, setImgStoredURL] = useState<Project_img>([]);

  const [changePT, setChangePT] = useState<boolean>(false);
  const [changePD, setChangePD] = useState<boolean>(false);
  const [changeGL, setChangeGL] = useState<boolean>(false);
  const [changeWL, setChangeWL] = useState<boolean>(false);
  const [changePfImg, setChangePfImg] = useState<boolean>(false);

  const [projectTitle, setProjectTitle] = useState<string>(
    props.editProjObj?.Project_title || ""
  );

  const [projectDesc, setProjectDesc] = useState<string>(
    props.editProjObj?.description || ""
  );

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userName.user);
  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );

  const db = getFirestore(FirebaseApp);
  const storage = getStorage(FirebaseApp);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        // console.log(uid, "user uuid");
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
          console.log("projectTitle in addProjectModal working bro");
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
    props.setProfileModal?.(false);
    const docRef = doc(db, "users", userDocId);
    await updateDoc(docRef, {
      username: user,
      twitterUsername: xUsername,
      githubUsername: githubUsername,
      profile_img: userImgURL,
    });
    setImgUrl(true);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      props.setSelectedFile?.(file);
      setUploadPfImg(true);
    }
  };

  const handleFileUpload = async () => {
    // props.setSelectedFile?.(null);
    if (props.selectedFile) {
      console.log("its working bro");
      const storageRef = ref(
        storage,
        `${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/${props.selectedFile.name}`
      );
      const uploadTask: UploadTask = uploadBytesResumable(
        storageRef,
        props.selectedFile
      );

      try {
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              // console.log("Upload is " + progress + "% done");

              switch (snapshot.state) {
                case "paused":
                  // console.log("Upload is paused");
                  break;
                case "running":
                  // console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("File available at", downloadURL);
                if (uploadPfImg) {
                  setUserImgURL(downloadURL);
                  setUploadPfImg(false);
                }
                if (uploadImg) {
                  setProjectImg((prevProjectImg) => [
                    ...prevProjectImg,
                    downloadURL,
                  ]);
                  setUploadImg(false);
                }
              });
              resolve(getDownloadURL);
            }
          );
        });

        // console.log("File uploaded successfully.");
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  useEffect(() => {
    handleFileUpload();
  }, [uploadImg, uploadPfImg]);

  const cleanInputElements = () => {
    setProjectTitle("");
    setProjectDesc("");
    setWebLink("");
    setGitLink("");
  };

  const handleCreateProject = async () => {
    const docRef = await addDoc(collection(db, "projects"), {
      Project_title: projectTitle,
      description: projectDesc,
      github_link: gitLink,
      userId: uid,
      web_link: webLink,
      project_img: projectImg,
      project_vid: {},
    });
    props.setOpnAddProjectModal(false);
    setProjectImg([]);
    cleanInputElements();
  };

  const inputChangeFalse = () => {
    setChangePT(false);
    setChangePD(false);
    setChangeWL(false);
    setChangeGL(false);
  };

  const handleEditProject = async (id: string) => {
    await updateDoc(doc(db, "projects", id), {
      Project_title: changePT ? projectTitle : props.editProjObj?.Project_title,
      description: changePD ? projectDesc : props.editProjObj?.description,
      github_link: changeGL ? gitLink : props.editProjObj?.github_link,
      web_link: changeWL ? webLink : props.editProjObj?.web_link,
      project_img: changePfImg
        ? [...projectImg, ...(props.editProjObj?.project_img || [])]
        : props.editProjObj?.project_img,
    });
    if (imgStoredURL.length > 0) {
      handleDeleteImage(imgStoredURL);
    }
    props.setOpnEditProject(false);
    setProjectImg([]);
    cleanInputElements();
    inputChangeFalse();
  };

  const onClickHandler: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    if (props.opnAddProjectModal) {
      await handleCreateProject();
    } else {
      await handleEditProject(props.editProjObj?.id || "");
    }
  };

  const handlePfModal = () => {
    props.setProfileModal?.(false);
    setImgUrl(true);
  };

  const handleEditChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (fieldName === "projectTitle") {
      setProjectTitle(e.target.value);
      setChangePT(true);
    } else if (fieldName === "desc") {
      setProjectDesc(e.target.value);
      setChangePD(true);
    } else if (fieldName === "web_link") {
      setWebLink(e.target.value);
      setChangeWL(true);
    } else if (fieldName === "git_link") {
      setGitLink(e.target.value);
      setChangeGL(true);
    }
  };

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      props.setSelectedFile?.(file);
      setUploadImg(true);
    }
  };

  const handleEditMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      props.setSelectedFile?.(file);
      setUploadImg(true);
      setChangePfImg(true);
    }
  };

  const projectModalClose = () => {
    setImgStoredURL([]);
    if (props.opnAddProjectModal) {
      props.setOpnAddProjectModal(false);
      cleanInputElements();
      inputChangeFalse();
    } else {
      props.setOpnEditProject(false);
      cleanInputElements();
      inputChangeFalse();
    }
  };

  const storeImgInfoDel = (url: string, index: number) => {
    // setImgStoredURL(url);
    setImgStoredURL((prevURLs) => [...prevURLs, url]);
  };

  const handleDeleteImage = async (urls: string[]) => {
    console.log(urls, "url bro");
    console.log(...urls, "spread urls here");
    try {
      await updateDoc(doc(db, "projects", props.editProjObj?.id ?? ""), {
        project_img: arrayRemove(...urls),
      });
      setImgStoredURL([]);
    } catch (error) {
      console.error("Error deleting project img:", error);
    }
  };

  return (
    <>
      {props.opnAddProjectModal || props.opnEditProject ? (
        <>
          <div className={styles.modal_div}></div>
          <div className={styles.add_modal_bg} onClick={projectModalClose}>
            <div
              className={styles.add_project_modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modal_container}>
                <div className={styles.modal_content}>
                  <div className={styles.project_title_input}>
                    <h2 className={styles.project_title}>Project title</h2>
                    <div className={styles.title_div}>
                      {props.opnAddProjectModal ? (
                        <input
                          className={styles.title_input}
                          type="text"
                          onChange={handleChange("projectTitle")}
                          value={projectTitle}
                        />
                      ) : (
                        <input
                          className={styles.title_input}
                          type="text"
                          onChange={(e) => handleEditChange("projectTitle", e)}
                          value={
                            changePT
                              ? projectTitle
                              : props.editProjObj?.Project_title || ""
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className={styles.project_desc}>
                      Tell anything about your project
                    </h2>
                    <div className={styles.desc_div}>
                      {props.opnAddProjectModal ? (
                        <textarea
                          className={styles.desc_textarea}
                          onChange={handleChange("desc")}
                          value={projectDesc}
                        />
                      ) : (
                        <textarea
                          className={styles.desc_textarea}
                          onChange={(e) => handleEditChange("desc", e)}
                          value={
                            changePD
                              ? projectDesc
                              : props.editProjObj?.description || ""
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <div className={styles.media_title_btn}>
                      <h2 className={styles.carousel_title}>
                        Embed Img & Video
                      </h2>
                      {/* <button className={styles.media_btn}>Add Media</button> */}
                    </div>

                    <div className={styles.both_box}>
                      <div className={styles.modal_carousel_box}>
                        <label
                          htmlFor="fileInput"
                          className={styles.modal_upld_img}
                        >
                          <Image
                            alt="add"
                            src="/add.png"
                            width={50}
                            height={50}
                            priority={true}
                            className={styles.add_media}
                          />
                          <input
                            type="file"
                            accept="image/*, video/*"
                            id="fileInput"
                            onChange={
                              props.opnAddProjectModal
                                ? handleAddMedia
                                : handleEditMedia
                            }
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>

                      {props.opnAddProjectModal ? (
                        <div className={styles.modal_carousel_box}>
                          <div className={styles.modal_imgs}>
                            {projectImg.map((url, index) => (
                              <div key={index} className={styles.img_del}>
                                {hoveredIndex === index && (
                                  <div
                                    className={styles.deleteIcon}
                                    onClick={() => storeImgInfoDel(url, index)}
                                  >
                                    <Image
                                      src="/delete.png"
                                      alt="add_icon"
                                      width={15}
                                      height={15}
                                      priority={true}
                                    />
                                  </div>
                                )}
                                <img
                                  src={url}
                                  alt={`project_image_${index}`}
                                  className={styles.box_img}
                                  onMouseEnter={() => setHoveredIndex(index)}
                                  onMouseLeave={() => setHoveredIndex(null)}
                                  onClick={() => storeImgInfoDel(url, index)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className={styles.modal_carousel_box}>
                          <div className={styles.modal_imgs}>
                            {(props.editProjObj?.project_img || [])
                              .concat(projectImg || [])
                              ?.filter((url) => !imgStoredURL.includes(url))
                              .map((url, index) => (
                                <div className={styles.img_del} key={index}>
                                  {hoveredIndex === index && (
                                    <div
                                      className={styles.deleteIcon}
                                      onClick={() =>
                                        storeImgInfoDel(url, index)
                                      }
                                    >
                                      <Image
                                        src="/delete.png"
                                        alt="add_icon"
                                        width={15}
                                        height={15}
                                        priority={true}
                                      />
                                    </div>
                                  )}
                                  <img
                                    src={url}
                                    alt={`project_image_${index}`}
                                    className={styles.box_img}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => storeImgInfoDel(url, index)}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
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
                        {props.opnAddProjectModal ? (
                          <input
                            type="text"
                            className={styles.link_input}
                            onChange={handleChange("web_link")}
                            value={webLink}
                          />
                        ) : (
                          <input
                            type="text"
                            className={styles.link_input}
                            onChange={(e) => handleEditChange("web_link", e)}
                            value={
                              changeWL
                                ? webLink
                                : props.editProjObj?.web_link || ""
                            }
                          />
                        )}
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
                        {props.opnAddProjectModal ? (
                          <input
                            type="text"
                            className={styles.link_input}
                            onChange={handleChange("git_link")}
                            value={gitLink}
                          />
                        ) : (
                          <input
                            type="text"
                            className={styles.link_input}
                            onChange={(e) => handleEditChange("git_link", e)}
                            value={
                              changeGL
                                ? gitLink
                                : props.editProjObj?.github_link || ""
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.create_div}>
                  <button
                    className={styles.create_btn}
                    onClick={onClickHandler}
                  >
                    {props.opnAddProjectModal ? "Create" : "Edit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {props.profileModal && (
        <>
          <div className={styles.modal_div}></div>
          <div className={styles.add_modal_bg} onClick={handlePfModal}>
            <div
              className={styles.add_profile_modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modal_container}>
                <div className={styles.pf_modal_content}>
                  <div className={styles.pf_img_input}>
                    <div className={styles.pf_img_div}>
                      {/* <img
                        src={selectedFile.selectedImage || "userDefaultImg"}
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
                        onChange={handleFileChange}
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

      <Tooltip id="usernameTooltip" place="right" />
    </>
  );
};

export default Modal;
