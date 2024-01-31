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
} from "firebase/firestore";
import FirebaseApp from "../../utils/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
  const [opnCommentModal, setOpnCommentModal] = useState<boolean>(false);
  const [uid, setUid] = useState<string>("");
  const [textarea, setTextarea] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      }
    });
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
        console.log(doc.id, " => ", doc.data());
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
    const docRef = await setDoc(doc(db, "comments", uid), {
      profile_img: "",
      username: user,
      comment: textarea,
    });

    console.log(docRef, "msgsent");
  };

  const handleChange = () => {};

  return (
    <>
      <div className={Styles.left_pane}>
        <div className={Styles.left_pane_inside}>
          <div className={Styles.pane_items}>
            <ul className={Styles.ul_items}>
              <div
                className={Styles.icons_items}
                onClick={() => router.push(`/explore`)}
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
              <div className={Styles.icons_items}>
                <Image
                  src="/Grid.png"
                  alt="grid"
                  height={38}
                  width={38}
                  priority={true}
                />
                <li>Table</li>
              </div>
              <div className={Styles.icons_items}>
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
                            onClick={() => setOpnCommentModal(true)}
                          >
                            comment
                          </button>
                        </div>

                        <hr className={styles.ruler} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.show_comment}>
                    {opnCommentModal && (
                      <>
                        <div className={styles.btm_cmnt_input}>
                          <div className={styles.all_comments}>
                            <div className={styles.cmt_pp_name}>
                              <div className={styles.cmt_pp}>
                                <img src="" />
                              </div>
                              <div className={styles.cmt_name_txt}>
                                <h2 className={styles.cmt_user}>username</h2>
                                <p className={styles.cmt_txt}>
                                  what is the msg that user has written here
                                </p>
                              </div>
                            </div>
                          </div>

                          <textarea
                            placeholder="what do you wanna say?"
                            className={styles.cmt_textarea}
                            onChange={(e) => setTextarea(e.target.value)}
                          />
                          <hr />
                          <div className="flex">
                            <div
                              className="ml-auto bg-index-black_btn p-2 rounded-full cursor-pointer"
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
