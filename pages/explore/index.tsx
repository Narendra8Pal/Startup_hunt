//next.js ,styles
import React, { useEffect, useState } from "react";
import styles from "@/styles/startups.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

//redux
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

//files
import Modal from "@/utils/modal";
import Styles from "@/styles/sidebar.module.css";
import Sidebar from "@/utils/sidebar";

//firebase
import {
  collection,
  getDocs,
  getFirestore,
  setDoc,
  doc,
  serverTimestamp,
  addDoc,
  getDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import FirebaseApp from "../../utils/firebase";

//other packages

type Project = {
  id: string;
  Project_title: string;
  description: string;
  github_link: string;
  userId: string;
  web_link: string;
  project_img: string[];
};

type Comment = {
  comment: string;
  timestamp: any;
};

type CmntSection = {
  profile_img: string;
  username: string;
  text: Comment[];
};

const Explore = () => {
  const router = useRouter();
  const { pathname } = router;

  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );
  const user = useSelector((state: RootState) => state.userName.user);
  const db = getFirestore(FirebaseApp);

  const [showDefault, setShowDefault] = useState<boolean>(true);
  const [opnAddProjectModal, setOpnAddProjectModal] = useState<boolean>(false);
  const [opnEditProject, setOpnEditProject] = useState<boolean>(false);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [opnCommentBoxArray, setOpnCommentBoxArray] = useState<{
    [key: string]: boolean;
  }>({});
  const [uid, setUid] = useState<string>("");
  const [textarea, setTextarea] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [projectUserId, setProjectUserId] = useState<string>("");
  const [prjUsername, setPrjUsername] = useState<string>("");
  const [userPfImg, setUserPfImg] = useState<string>("");
  const [cmntBox, setCmntBox] = useState<CmntSection[]>([]);
  const [showCmntSection, setShowCmntSection] = useState<boolean>(false);
  const [cmntUsrImg, setCmntUsrImg] = useState<string>("");

  useEffect(() => {
    const modalCloseUpdate = () => {
      getDoc(doc(db, "users", `${userDocId}`))
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUid(data.userId);
            setCmntUsrImg(data.profile_img);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document: ", error);
        });
    };
    if (userDocId) {
      modalCloseUpdate();
    }
  }, [userDocId]);

  // for realtime comments
  //   const unsub = onSnapshot(doc(db, "projects", ""), (doc) => {
  //     console.log("Current data: ", doc.data());
  // });

  useEffect(() => {
    const getAllProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsArray: Project[] = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const projectData = { id: doc.id, ...doc.data() } as Project;
        projectsArray.push(projectData);

        if (doc.data() !== null) {
          setShowDefault(false);
        }
      });
      setProjectsData(projectsArray);
    };
    getAllProjects();
  }, []);

  const handleMsgSent = async () => {
    const commentsCollection = collection(
      db,
      "projects",
      projectId,
      "comments"
    );
    const newCommentRef = doc(commentsCollection, uid);
    const textCollectionRef = collection(newCommentRef, "text");
    const newComment = {
      profile_img: cmntUsrImg,
      username: user,
    };

    try {
      await setDoc(newCommentRef, newComment);
      await addDoc(textCollectionRef, {
        comment: textarea,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setTextarea("");
    setShowCmntSection(true);
  };

  const handleCommentButtonClick = (
    projectId: string,
    projectUserId: string
  ) => {
    setTextarea("");
    setProjectId(projectId);

    setOpnCommentBoxArray((prevOpnCommentModalArray) => {
      setCmntBox([]);
      const updatedArray = {
        [projectId]: !prevOpnCommentModalArray[projectId],
      };

      Object.keys(prevOpnCommentModalArray).forEach((id) => {
        if (id !== projectId) {
          updatedArray[id] = false;
        }
      });

      return updatedArray;
    });
    getPrjUserInfo(projectUserId);
    setShowCmntSection(true);
  };

  useEffect(() => {
    const fetchCmnts = async () => {
      try {
        const commentsCollection = collection(
          db,
          "projects",
          projectId,
          "comments"
        );
        const q = query(commentsCollection);
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const fetchedComments: any = [];
          // snapshot.forEach(async (doc) => {
          await Promise.all(
            snapshot.docs.map(async (doc) => {
              const commentData = doc.data();
              const textCollectionRef = collection(doc.ref, "text");
              const textQuerySnapshot = await getDocs(textCollectionRef);
              const textData = textQuerySnapshot.docs.map((textDoc) =>
                textDoc.data()
              );
              fetchedComments.push({
                id: doc.id,
                ...commentData,
                text: textData,
              });
              setCmntBox(fetchedComments);
            })
          );
          setShowCmntSection(false);
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    if (projectId && showCmntSection) {
      fetchCmnts();
    }
  }, [showCmntSection]);

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     console.log("fetchComments ran bro");
  //     const commentsCollection = collection(
  //       db,
  //       "projects",
  //       projectId,
  //       "comments"
  //     );
  //     const querySnapshot = await getDocs(commentsCollection);

  //     const comments: any = [];
  //     querySnapshot.forEach(async (doc) => {
  //       const commentData = doc.data();
  //       const textCollectionRef = collection(doc.ref, "text");
  //       const textQuerySnapshot = await getDocs(textCollectionRef);
  //       const textData = textQuerySnapshot.docs.map((textDoc) =>
  //         textDoc.data()
  //       );

  //       comments.push({
  //         ...commentData,
  //         text: textData,
  //       });
  //       setCmntBox(comments);
  //     });

  //     setShowCmntSection(false);
  //     return comments;
  //   };
  //   if (projectId && showCmntSection) {
  //     fetchComments();
  //   }
  // }, [showCmntSection]);

  const getPrjUserInfo = async (projectUserId: string) => {
    // console.log(projectUserId, "projectUserId");
    const userQuery = query(
      collection(db, "users"),
      where("userId", "==", projectUserId)
    );
    const userQuerySnapshot = await getDocs(userQuery);
    if (!userQuerySnapshot.empty) {
      const userData = userQuerySnapshot.docs[0].data();
      setPrjUsername(userData.username);
      setUserPfImg(userData.profile_img);
    } else {
      console.error("User not found.");
    }
  };

  return (
    <>
      <div className={Styles.left_pane}>
        <div className={Styles.left_pane_inside}>
          <div className={Styles.pane_items}>
            <ul className={Styles.ul_items}>
              <div
                className={Styles.icons_items}
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
                className={Styles.icons_items}
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
                className={Styles.icons_items}
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
                className={Styles.icons_items}
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
            className={Styles.btn_div}
            onClick={() => setOpnAddProjectModal(true)}
          >
            <button>Add</button>
          </div>
        </div>
      </div>

      {/* <Sidebar /> */}

      {showDefault ? (
        <div className={styles.default_page}>
          <div className={styles.df_bg}>
            <div className={styles.df_icons}>
              <Image
                src="/largeCompass.png"
                alt="icons"
                width={98}
                height={98}
                priority={true}
              />
              <Image
                src="/largeGrid.png"
                alt="icons"
                width={98}
                height={98}
                priority={true}
              />
              <Image
                src="/large_ViewModule.png"
                alt="icons"
                width={98}
                height={98}
                priority={true}
              />
            </div>
            <div className={styles.text}>
              <h2>please create something to show it here</h2>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.layout_div}>
            <div className={styles.layout_content}>
              {projectsData.map((project, index) => (
                <div className={styles.container} key={index}>
                  <div className={styles.container_content}>
                    <div className={styles.project_showcase}>
                      <div className={styles.header}>
                        <h2 className={styles.title}>
                          {project.Project_title}
                        </h2>
                        <Image
                          alt="share"
                          width={30}
                          height={30}
                          src="/Share.png"
                          priority={true}
                          className={styles.share}
                        />
                      </div>

                      <div className={styles.carousel_box}>
                        {project.project_img.map((img, imgIndex) => (
                          <img
                            src={img}
                            alt={`project_img_${imgIndex}`}
                            className={styles.carousel_img}
                            key={imgIndex}
                          />
                        ))}
                      </div>

                      <div className={styles.desc_btm}>
                        <div className={styles.desc}>{project.description}</div>
                      </div>

                      <div className={styles.comment_box}>
                        <div className={styles.text_btn}>
                          <h4 className={styles.txt}>Write your opinions.</h4>
                          <button
                            className={styles.cmnt_btn}
                            onClick={() =>
                              handleCommentButtonClick(
                                project.id,
                                project.userId
                              )
                            }
                          >
                            {opnCommentBoxArray[project.id]
                              ? "hide"
                              : "comment"}
                          </button>
                        </div>

                        <hr className={styles.ruler} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.show_comment}>
                    {opnCommentBoxArray[project.id] && (
                      <>
                        <div className={styles.btm_cmnt_input}>
                          <div className={styles.all_comments}>
                            <div className={styles.user_reply_box}>
                              {cmntBox.map((comments, index) => (
                                <div key={index}>
                                  {comments.text.map((comment, textIndex) => (
                                    <div
                                      key={textIndex}
                                      className={styles.img_username}
                                    >
                                      <div className={styles.cmt_pp_div}>
                                        <img
                                          src={comments.profile_img}
                                          className={styles.cmt_pp}
                                        />
                                      </div>
                                      <div className={styles.cmt_name_txt}>
                                        <h2 className={styles.cmt_user}>
                                          {comments.username}
                                        </h2>
                                        <p className={styles.cmt_txt}>
                                          {comment.comment}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>

                          <textarea
                            placeholder="what do you wanna say?"
                            className={styles.cmt_textarea}
                            onChange={(e) => setTextarea(e.target.value)}
                            value={textarea}
                          />
                          <hr />
                          <div className="flex">
                            <div
                              className={styles.send_btn}
                              onClick={handleMsgSent}
                            >
                              <Image
                                src="/Sent.png"
                                alt="sent"
                                width={20}
                                height={20}
                                priority={true}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Modal
        setOpnAddProjectModal={setOpnAddProjectModal}
        opnAddProjectModal={opnAddProjectModal}
        opnEditProject={opnEditProject}
        setOpnEditProject={setOpnEditProject}
        pathname={pathname}
      />
    </>
  );
};

export default Explore;
