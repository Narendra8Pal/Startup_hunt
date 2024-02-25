import React, { useState, useRef, useEffect } from "react";
import styles from "@/styles/tasks.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

//redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";

//firebase
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import FirebaseApp from "../../utils/firebase";

type Tasks_Content = {
  id: string;
  Project_Title: string;
  Project_Desc: string;
};

type TasksProps = {
  Id?: string | string[] | undefined;
};

type TaskData = {
  id: string;
  Project_Title: string;
  Project_Desc: string;
  userId: string;
};

const Tasks = (props: TasksProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [taskModalContent, setTaskModalContent] = useState<boolean>(false);
  const [ddOpen, setDDOpen] = useState<boolean>(false);
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDesc, setProjectDesc] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [tasksData, setTasksData] = useState<Tasks_Content[]>([]);
  const [taskDocIdData, setTaskDocIdData] = useState<TaskData>({
    id: "",
    Project_Title: "",
    Project_Desc: "",
    userId: "",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const db = getFirestore(FirebaseApp);
  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );

  const router = useRouter();

  useEffect(() => {
    const getUserData = () => {
      getDoc(doc(db, "users", `${userDocId}`))
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUid(data.userId);
            // setCmntUsrImg(data.profile_img);
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
  }, [userDocId]);

  useEffect(() => {
    const getTasksData = async () => {
      const q = query(collection(db, "tasks"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const projectsArray: Tasks_Content[] = [];
      querySnapshot.forEach((doc) => {
        const projectData = { id: doc.id, ...doc.data() } as Tasks_Content;
        projectsArray.push(projectData);
        console.log(projectsArray, "projectData bro is here");
      });
      setTasksData(projectsArray);
    };
    if (userDocId) {
      getTasksData();
    }
  }, [userDocId]);

  useEffect(() => {
    const getTaskDocData = async () => {
      const docRef = doc(db, "tasks", `${props.Id}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data(), "task doc data here ");
        const docData = docSnap.data() as TaskData;
        setTaskDocIdData(docData);
      }
    };
    if (props.Id) {
      getTaskDocData();
    }
  }, [props.Id]);

  const handleModal = () => {
    setOpenModal(false);
    setTaskModalContent(false);
    setProjectTitle("");
    setProjectDesc("");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDDOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleCreate = async () => {
    handleModal();
    try {
      const collectionRef = collection(db, "tasks");
      await addDoc(collectionRef, {
        Project_Title: projectTitle,
        Project_Desc: projectDesc,
        userId: uid,
      });
      console.log("Collection created successfully!");
    } catch (error) {
      console.error("Error creating collection: ", error);
    }
  };

  const handleAddTasks = async () => {
    try {
      const subcollectionRef = collection(
        doc(db, "tasks", taskId),
        "tasks_content"
      );
      await addDoc(subcollectionRef, {
        title: "",
        desc: "",
        status: "",
      });

      console.log("Subcollection created successfully!");
    } catch (error) {
      console.error("Error creating subcollection: ", error);
    }
  };

  const handleChange =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      switch (key) {
        case "ProjectTitle":
          setProjectTitle(e.target.value);
          break;
        case "ProjectDesc":
          setProjectDesc(e.target.value);
          break;
      }
    };

  const handlePrjClick = (id: string) => {
    router.push(`/tasks/${userDocId}/${id}`);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content_container}>
          <div className={styles.content_div}>
            <div>
              <div className={styles.switch_btn}>
                <div
                  className={styles.dropdown}
                  onClick={() => setDDOpen(!ddOpen)}
                  ref={dropdownRef}
                >
                  <p>{taskDocIdData.Project_Title}</p>

                  {ddOpen ? (
                    <Image
                      src="/down_btn.png"
                      alt="up_btn"
                      height={20}
                      width={20}
                      className={styles.up_btn}
                    />
                  ) : (
                    <Image
                      src="/down_btn.png"
                      alt="down_btn"
                      height={20}
                      width={20}
                    />
                  )}
                </div>

                <div className={styles.btn_div}>
                  <div
                    className={styles.add_icon}
                    onClick={() => setOpenModal(true)}
                  >
                    <Image
                      src="/add.png"
                      alt="add"
                      width={30}
                      height={30}
                      priority={true}
                    />
                  </div>
                </div>

                {ddOpen && (
                  <>
                    <div className={styles.drop_box}>
                      <ul className={styles.box_content}>
                        {tasksData &&
                          tasksData.map((tasks, index) => (
                            <div key={index}>
                              <li onClick={() => handlePrjClick(tasks.id)}>
                                {tasks.Project_Title}
                              </li>
                            </div>
                          ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.top_content}>
              <div className={styles.name_desc}>
                <h2 className={styles.title}>{taskDocIdData.Project_Title}</h2>
                <p className={styles.desc}>{taskDocIdData.Project_Desc}</p>
              </div>
            </div>

            <hr className={styles.ruler} />

            <div className={styles.bottom_content}>
              <div className={styles.btn_div}>
                <button
                  className={styles.btn}
                  onClick={() => setTaskModalContent(true)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal || taskModalContent ? (
        <>
          <div className={styles.modal_div}></div>
          <div className={styles.add_modal_bg} onClick={handleModal}>
            <div
              className={styles.add_profile_modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modal_content}>
                <div>
                  <div>{taskModalContent ? "Task Title" : "Project Title"}</div>
                  <input
                    type="text"
                    className={styles.input}
                    onChange={handleChange("ProjectTitle")}
                    value={projectTitle}
                  />
                </div>

                <div>
                  <div>
                    {taskModalContent
                      ? "Task Description"
                      : "Project Description"}
                  </div>
                  <textarea
                    className={styles.textarea}
                    onChange={handleChange("ProjectDesc")}
                    value={projectDesc}
                  />
                </div>

                {taskModalContent ? <div>Task Status</div> : null}
              </div>

              <div className={styles.btn_div}>
                <button className={styles.btn} onClick={handleCreate}>
                  {taskModalContent ? "Create Task" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Tasks;
