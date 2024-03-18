//next.js, style,files
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
} from "react";
import styles from "@/styles/profile.module.css";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/utils/modal";
//redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import { setUser } from "@/store/userName";
import { setImgUrl } from "@/store/imgURL";
//firebase
import FirebaseApp from "../../utils/firebase";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  where,
  collection,
  query,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
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

type Tasks_Content = {
  id: string;
  Project_Title: string;
  Project_Desc: string;
  Date: string;
  Day: string;
  userId: string;
};

type User_Info = {
  id: string;
  githubUsername: string;
  twitterUsername: string;
  username: string;
  userId: string;
};

const Profile = () => {
  const [opnAddProjectModal, setOpnAddProjectModal] = useState<boolean>(false);
  const [profileModal, setProfileModal] = useState<boolean>(false);
  const [opnEditProject, setOpnEditProject] = useState<boolean>(false);
  const [xUsername, setXUsername] = useState<string>("");
  const [gitUsername, setGitUsername] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userImgURL, setUserImgURL] = useState<string>("");
  const [editProjObj, setEditProjObj] = useState<Project>();

  //tasks content
  const [tasksData, setTasksData] = useState<Tasks_Content[]>([]);

  const [refs, setRefs] = useState<(HTMLDivElement | null)[]>([]);

  const [uid, setUid] = useState<string>("");
  const [projectsData, setProjectsData] = useState<Project[]>([]);

  const [showProjects, setShowProjects] = useState<boolean>(true);
  const [showTasks, setShowTasks] = useState<boolean>(false);

  const db = getFirestore(FirebaseApp);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userName.user);
  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );
  const imgURL = useSelector((state: RootState) => state.imgURL.imgURL);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
      }
    });
  }, [userDocId]);

  // for getting tasks data
  useEffect(() => {
    const getTasksData = async () => {
      const q = query(collection(db, "tasks"));
      const querySnapshot = await getDocs(q);
      const projectsArray: Tasks_Content[] = [];
      querySnapshot.forEach((doc) => {
        const projectData = { id: doc.id, ...doc.data() } as Tasks_Content;
        projectsArray.push(projectData);
      });

      const filteredTasks = projectsArray.filter((task) => task.userId === uid);
      setTasksData(filteredTasks);
    };
    getTasksData();
  }, [showTasks]);

  // for getting the 'users' collection data
  useEffect(() => {
    const modalCloseUpdate = () => {
      getDoc(doc(db, "users", `${userDocId}`))
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            dispatch(setUser(data.username));
            setXUsername(data.twitterUsername);
            setGitUsername(data.githubUsername);
            setUserImgURL(data.profile_img);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document: ", error);
        });
      dispatch(setImgUrl(false));
    };
    if (userDocId) {
      modalCloseUpdate();
    }
  }, [profileModal, userDocId, imgURL]);

  useEffect(() => {
    const getProjectsData = async () => {
      const q = query(collection(db, "projects"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const projectsArray: Project[] = [];
      querySnapshot.forEach((doc) => {
        const projectData = { id: doc.id, ...doc.data() } as Project;
        projectsArray.push(projectData);
      });
      setProjectsData(projectsArray);
    };

    if (uid) {
      getProjectsData();
    }
  }, [opnAddProjectModal, userDocId, uid, opnEditProject]);

  const handleProjectDelete = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      setProjectsData((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEditProject = (project: Project) => {
    setOpnEditProject(true);
    setEditProjObj(project);
  };

  const handleTaskClick = () => {
    if (showProjects) {
      setShowProjects(false);
      setShowTasks(true);
    } else {
      setShowProjects(true);
      setShowTasks(false);
    }
  };

  return (
    <>
      <div className={styles.layout_div}>
        <div className={styles.container}>
          <div className={styles.container_content}>
            <div className={styles.pf_top}>
              <div className={styles.pf_cover}></div>

              <div
                className={styles.pf_edit_div}
                onClick={() => setProfileModal(true)}
              >
                <div className={styles.pf_edit}>
                  <Image
                    src="/menu_edit.png"
                    alt="edit"
                    width={24}
                    height={24}
                    priority={true}
                  />
                </div>
              </div>

              <div className={styles.profile_img_div}>
                <img
                  src={userImgURL || "/defaultProfile2.png"}
                  className={styles.pf_img}
                />
              </div>

              <div className={styles.name_socials}>
                <div className={styles.pf_name}>{user}</div>

                <div className={styles.pf_socials_top}>
                  <Link
                    href={`https://twitter.com/${xUsername}`}
                    target="_blank"
                  >
                    <div>
                      <Image
                        src="/X_table.png"
                        alt="x"
                        width={18}
                        height={18}
                        priority={true}
                      />
                    </div>
                  </Link>

                  <Link
                    href={`https://github.com/${gitUsername}`}
                    target="_blank"
                  >
                    <div className="">
                      <Image
                        src="/git_table.png"
                        alt="github"
                        width={18}
                        height={18}
                        priority={true}
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className={styles.projects_container}>
              <div className={styles.two_btns_div}>
                <div className={styles.two_btns}>
                  <div className={styles.proj_tasks_btn}>
                    <div
                      className={
                        showProjects ? styles.proj_btn_true : styles.proj_btn
                      }
                      onClick={() => handleTaskClick()}
                    >
                      Projects
                    </div>

                    <div
                      className={
                        showTasks ? styles.task_btn_true : styles.task_btn
                      }
                      onClick={() => handleTaskClick()}
                    >
                      Tasks
                    </div>
                  </div>
                </div>
              </div>
              <hr className={styles.ruler} />

              {showProjects ? (
                <>
                  {projectsData.map((project, index) => {
                    return (
                      <div className={styles.project_list} key={index}>
                        <div className={styles.project_showcase}>
                          <div className={styles.name_link}>
                            <Link href={project.web_link} target="_blank">
                              <h2 className={styles.name}>
                                {project.Project_title}
                              </h2>
                            </Link>

                            <Link href={project.web_link} target="_blank">
                              <Image
                                src="/external_link.png"
                                alt="externalLink"
                                width={30}
                                height={30}
                                priority={true}
                                className={styles.link_icon}
                              />
                            </Link>
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
                        </div>
                        <div className={styles.desc_btm}>
                          <div className={styles.desc}>
                            {project.description}
                          </div>
                        </div>
                        <div className={styles.btm_part}>
                          <div>
                            <ul className={styles.btm_content}>
                              <Link href={project.github_link} target="_blank">
                                <li className={styles.git_icon}>
                                  <Image
                                    src="/git_proj.png"
                                    alt="github.png"
                                    height={21}
                                    width={21}
                                    priority={true}
                                  />
                                </li>
                              </Link>
                              <li
                                onClick={() => handleProjectDelete(project.id)}
                                className={styles.del_proj_icon}
                              >
                                <Image
                                  src="/delete_proj.png"
                                  alt="delte"
                                  height={18}
                                  width={18}
                                  priority={true}
                                />
                              </li>
                              <li
                                onClick={() => handleEditProject(project)}
                                className={styles.edit_proj_icon}
                              >
                                <Image
                                  src="/edit_proj.png"
                                  alt="edit_proj"
                                  width={18}
                                  height={18}
                                  priority={true}
                                />
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : null}

              {showTasks ? (
                <>
                  {tasksData &&
                    tasksData.map((tasks, index) => {
                      return (
                        <div className={styles.tasks_list} key={index}>
                          <div className={styles.tasks_showcase}>
                            <div className={styles.date_day}>
                              <ul className={styles.date_day_ul}>
                                <li
                                  className={
                                    tasks.Day === "Sunday"
                                      ? styles.sunday
                                      : styles.day
                                  }
                                >
                                  {tasks.Day.slice(0, 3)}
                                </li>
                                <li
                                  className={
                                    tasks.Day === "Sunday"
                                      ? styles.sun_date
                                      : styles.date
                                  }
                                >
                                  {tasks.Date.split("/")[1]}
                                </li>
                              </ul>
                            </div>

                            <div className={styles.text_btn}>
                              <div className={styles.title_desc_div}>
                                <div className={styles.task_title_div}>
                                  <div className={styles.title_content}>
                                    <div className={styles.title_desc}>
                                      Task Title
                                    </div>
                                    <div>{tasks.Project_Title}</div>
                                  </div>
                                </div>

                                <div className={styles.desc_div}>
                                  <div className={styles.desc_content}>
                                    <div className={styles.title_desc}>
                                      Task Description
                                    </div>
                                    {tasks.Project_Desc.split(" ")
                                      .slice(0, 20)
                                      .join(" ")}
                                    {tasks.Project_Desc.split(" ").length > 20
                                      ? "..."
                                      : ""}{" "}
                                  </div>
                                </div>
                              </div>

                              <div className={styles.visit_btn_div}>
                                <Link href={`/tasks/${userDocId}/${tasks.id}`}>
                                  <button className={styles.visit_btn}>
                                    visit
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Modal
        setOpnAddProjectModal={setOpnAddProjectModal}
        opnAddProjectModal={opnAddProjectModal}
        profileModal={profileModal}
        setProfileModal={setProfileModal}
        opnEditProject={opnEditProject}
        setOpnEditProject={setOpnEditProject}
        setSelectedFile={setSelectedFile}
        selectedFile={selectedFile}
        editProjObj={editProjObj}
      />
    </>
  );
};

export default Profile;
