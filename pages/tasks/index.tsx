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
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import FirebaseApp from "../../utils/firebase";

// packages
import EmojiPicker from "emoji-picker-react";
import { Tooltip } from "react-tooltip";

import { v4 as uuidv4 } from "uuid";

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

const initialTaskData: TaskData = {
  id: "",
  Project_Title: "",
  Project_Desc: "",
  userId: "",
};

type TaskContentData = {
  id: string;
  desc: string;
  status: string;
  title: string;
  col: string;
  row: string;
  taskDocId: string;
};

type Task = {
  id: string;
  status: string;
  title: string;
  desc: string;
};

const Tasks = (props: TasksProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [taskModalContent, setTaskModalContent] = useState<boolean>(false);
  const [ddOpen, setDDOpen] = useState<boolean>(false);
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDesc, setProjectDesc] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [tasksData, setTasksData] = useState<Tasks_Content[]>([]);
  const [taskDocIdData, setTaskDocIdData] = useState(initialTaskData);
  const [taskContentDocData, setTaskContentDocData] = useState<
    TaskContentData[]
  >([]);
  const [userImgURL, setUserImgURL] = useState<string>("");
  const [addEmoji, setAddEmoji] = useState<boolean>(false);
  const [taskDocIds, setTaskDocIds] = useState<string[]>([]);
  const [DocIds, setDocIds] = useState<string[]>([]);

  // draggable functionality based usestate hooks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [customMenuOpen, setCustomMenuOpen] = useState<boolean>(false);

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
            setUserImgURL(data.profile_img);
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
      });
      setTasksData(projectsArray);
    };
    if (userDocId) {
      getTasksData();
    }
  }, [userDocId, ddOpen]);

  useEffect(() => {
    const getTaskDocData = async () => {
      const docRef = doc(db, "tasks", `${props.Id}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data() as TaskData;
        setTaskDocIdData(docData);

        const querySnapshot = await getDocs(
          collection(db, "tasks", `${props.Id}`, "tasks_content")
        );
        const data: TaskContentData[] = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data() as TaskContentData);
        });
        setTaskContentDocData(data);

        data.forEach((task) => {
          setTaskDocIds([...taskDocIds, task.taskDocId]);
        });
      }
    };
    if (props.Id) {
      getTaskDocData();
    }
  }, [props.Id, tasks]);

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
      const currentDate = new Date();
      const dayOfWeek = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const formattedDate = currentDate.toLocaleDateString("en-US");
      await addDoc(collectionRef, {
        Project_Title: projectTitle,
        Project_Desc: projectDesc,
        userId: uid,
        Date: formattedDate,
        Day: dayOfWeek,
      });
    } catch (error) {
      console.error("Error creating collection: ", error);
    }
  };

  const handleAddTasks = async () => {
    handleModal();
    try {
      const tasksRef = collection(db, "tasks");

      const subcollectionRef = collection(
        doc(db, "tasks", `${props.Id}`),
        "tasks_content"
      );

      const taskSnapshot = await getDocs(subcollectionRef);
      const tasksCount = taskSnapshot.docs.length;

      const newTask = {
        id: uuidv4(),
        title: projectTitle,
        desc: projectDesc,
        status: "",
        done: "",
        col: tasksCount % 2 == 0 ? "col1" : "col2",
        taskDocId: "",
      };

      const docRef = await addDoc(subcollectionRef, newTask);

      const tasksCollection = collection(
        db,
        "tasks",
        `${props.Id}`,
        "tasks_content"
      );
      const taskDocRef = doc(tasksCollection, docRef.id);
      const addTaskDocId = {
        taskDocId: docRef.id,
      };
      await setDoc(taskDocRef, addTaskDocId, { merge: true });
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error creating subcollection: ", error);
    }
  };

  const handleUpdateTasks = async () => {
    try {
    } catch (error) {}
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

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    // taskId: string,
    taskDocId: string
  ) => {
    setIsDragging(true);
    setDraggedItem(taskDocId);
    e.dataTransfer.setData("taskId", taskDocId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    targetCol: string
  ) => {
    setIsDragging(false);
    setDraggedItem(null);
    setHoveredIndex(null);
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const updatedTasks = taskContentDocData.map((task) =>
      task.taskDocId === taskId ? { ...task, col: targetCol } : task
    );
    setTaskContentDocData(updatedTasks);

    const tasksCollection = collection(
      db,
      "tasks",
      `${props.Id}`,
      "tasks_content"
    );

    const taskBoxRef = doc(tasksCollection, taskId);
    try {
      await updateDoc(taskBoxRef, { col: targetCol });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
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
                  <Image
                    src="/large_ViewModule.png"
                    alt="boxes"
                    width={30}
                    height={30}
                    priority={true}
                  />
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
                    data-tooltip-id="tabsToolTip"
                    data-tooltip-content="create Task"
                  >
                    <Image
                      src="/tabs.png"
                      alt="add"
                      width={30}
                      height={30}
                      priority={true}
                    />
                  </div>

                  <div className={styles.pf_img}>
                    <img src={userImgURL} />
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
                <p className={styles.desc}>
                  {props.Id
                    ? taskDocIdData.Project_Desc
                    : "please create a task first using the layer icon placed before your profile or choose your created task using dropdown :)"}
                </p>
              </div>
            </div>

            <hr className={styles.ruler} />

            <div className={styles.bottom_content}>
              <div className={styles.grid_box}>
                <div className={styles.box_col}>
                  <div className={styles.two_boxes}>
                    <div
                      className={styles.col1}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "col1")}
                    >
                      {taskContentDocData
                        .filter((item) => item.col === "col1")
                        .map((item, index, array) => (
                          <div key={item.id}>
                            <div
                              key={item.id}
                              className={styles.task_box}
                              draggable
                              onDragStart={(e) =>
                                handleDragStart(e, item.taskDocId)
                              }
                              onDragEnd={handleDragEnd}
                              onDragOver={() => setHoveredIndex(index)}
                              onDragLeave={() => setHoveredIndex(null)}
                            >
                              <div className={styles.tit_desc}>
                                <div>{item.status}</div>
                                <div className={styles.task_title}>
                                  {item.title
                                    ? item.title.length > 30
                                      ? `${item.title.slice(0, 30)}...`
                                      : item.title
                                    : null}
                                </div>
                                <div className={styles.task_desc}>
                                  {item.desc
                                    ? item.desc.length > 300
                                      ? `${item.desc.slice(0, 300)}...`
                                      : item.desc
                                    : null}
                                </div>
                              </div>

                              <div className={styles.task_btn_div}>
                                <div className={styles.thumbs_icon_div}>
                                  <div className={styles.both_icons}>
                                    <button>
                                      <div className={styles.thumb_img}>👍</div>
                                      <span className={styles.thumb_no}></span>
                                    </button>
                                    <button>
                                      <div className={styles.thumb_img}>👎</div>
                                      <span className={styles.thumb_no}></span>
                                    </button>
                                  </div>
                                </div>

                                <div className={styles.three_icon_div}>
                                  <div className={styles.expand_icon}>
                                    <Image
                                      src="/expand.png"
                                      alt="expand"
                                      width={15}
                                      height={15}
                                      priority={true}
                                    />
                                  </div>

                                  <div className={styles.cmnt_icon}>
                                    <Image
                                      src="/comment.png"
                                      alt="comment"
                                      width={15}
                                      height={15}
                                      priority={true}
                                    />
                                  </div>

                                  <div
                                    className={styles.add_icon}
                                    onClick={() => setCustomMenuOpen(true)}
                                  >
                                    <Image
                                      src="/more.png"
                                      alt="more"
                                      width={26}
                                      height={26}
                                      priority={true}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* {index < array.length - 1 && ( */}
                            {hoveredIndex === index && (
                              <div
                                key={`placeholder-${item.id}`}
                                className={styles.box_placeholder}
                              ></div>
                            )}
                          </div>
                        ))}

                      {customMenuOpen ? (
                        <>
                          <div className={styles.custom_menu}>
                            <ul>
                              <li>Edit</li>
                              <li>Delete</li>

                              <div className={styles.bg_box}></div>
                            </ul>
                          </div>
                        </>
                      ) : null}
                    </div>

                    <div
                      className={styles.col2}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "col2")}
                    >
                      {taskContentDocData
                        .filter((item) => item.col === "col2")
                        .map((item, index) => (
                          <div key={item.id}>
                            <div
                              className={styles.task_box}
                              draggable
                              onDragStart={(e) =>
                                handleDragStart(e, item.taskDocId)
                              }
                              onDragEnd={handleDragEnd}
                              onDragOver={() => setHoveredIndex(index)}
                              onDragLeave={() => setHoveredIndex(null)}
                            >
                              <div className={styles.tit_desc}>
                                <div>{item.status}</div>
                                <div className={styles.task_title}>
                                  {item.title
                                    ? item.title.length > 30
                                      ? `${item.title.slice(0, 30)}...`
                                      : item.title
                                    : null}
                                </div>
                                <div className={styles.task_desc}>
                                  {item.desc
                                    ? item.desc.length > 300
                                      ? `${item.desc.slice(0, 300)}...`
                                      : item.desc
                                    : null}
                                </div>
                              </div>

                              <div className={styles.task_btn_div}>
                                <div className={styles.thumbs_icon_div}>
                                  <div className={styles.both_icons}>
                                    <button>
                                      <div className={styles.thumb_img}>👍</div>
                                      <span className={styles.thumb_no}></span>
                                    </button>
                                    <button>
                                      <div className={styles.thumb_img}>👎</div>
                                      <span className={styles.thumb_no}></span>
                                    </button>
                                  </div>
                                </div>

                                <div className={styles.three_icon_div}>
                                  <div className={styles.expand_icon}>
                                    <Image
                                      src="/expand.png"
                                      alt="expand"
                                      width={15}
                                      height={15}
                                      priority={true}
                                    />
                                  </div>

                                  <div className={styles.cmnt_icon}>
                                    <Image
                                      src="/comment.png"
                                      alt="comment"
                                      width={15}
                                      height={15}
                                      priority={true}
                                    />
                                  </div>

                                  <div className={styles.add_icon}>
                                    <Image
                                      src="/more.png"
                                      alt="more"
                                      width={26}
                                      height={26}
                                      priority={true}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {hoveredIndex === index && (
                              <div
                                key={`placeholder-${item.id}`}
                                className={styles.box_placeholder}
                              ></div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div
                  className={styles.box_col2}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "col3")}
                >
                  {taskContentDocData
                    .filter((item) => item.col === "col3")
                    .map((item, index) => (
                      <div key={item.id}>
                        <div
                          className={styles.task_box}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, item.taskDocId)
                          }
                          onDragEnd={handleDragEnd}
                          onDragOver={() => setHoveredIndex(index)}
                          onDragLeave={() => setHoveredIndex(null)}
                        >
                          <div className={styles.tit_desc}>
                            <div>{item.status}</div>
                            <div className={styles.task_title}>
                              {item.title
                                ? item.title.length > 30
                                  ? `${item.title.slice(0, 30)}...`
                                  : item.title
                                : null}
                            </div>
                            <div className={styles.task_desc}>
                              {item.desc
                                ? item.desc.length > 300
                                  ? `${item.desc.slice(0, 300)}...`
                                  : item.desc
                                : null}
                            </div>
                          </div>

                          <div className={styles.task_btn_done_div}>
                            <div className={styles.three_icon_div}>
                              <div className={styles.expand_icon}>
                                <Image
                                  src="/expand.png"
                                  alt="expand"
                                  width={15}
                                  height={15}
                                  priority={true}
                                />
                              </div>

                              <div className={styles.add_icon}>
                                <Image
                                  src="/more.png"
                                  alt="more"
                                  width={26}
                                  height={26}
                                  priority={true}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {hoveredIndex === index && (
                          <div
                            key={`placeholder-${item.id}`}
                            className={styles.box_placeholder}
                          ></div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {props.Id && (
        <div className={styles.fixed_add_btn}>
          <div className={styles.short_width_add}>
            <button
              className={styles.add_btn}
              onClick={() => setTaskModalContent(true)}
            >
              <Image
                src="/plus.png"
                alt="plus"
                width={30}
                height={30}
                priority={true}
              />
              Create Brick
            </button>
          </div>
        </div>
      )}

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
                  <div>{taskModalContent ? "Brick Title" : "Task Title"}</div>
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
                      ? "Brick Description"
                      : "Task Description"}
                  </div>
                  <textarea
                    className={styles.textarea}
                    onChange={handleChange("ProjectDesc")}
                    value={projectDesc}
                  />
                </div>

                {taskModalContent ? <div>Brick Status</div> : null}
              </div>

              <div className={styles.btn_div}>
                <button
                  className={styles.btn}
                  onClick={taskModalContent ? handleAddTasks : handleCreate}
                >
                  {taskModalContent ? "Create" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <Tooltip id="tabsToolTip" place="bottom" />

      {addEmoji ? (
        <>
          <div className={styles.emoji_picker}>
            <EmojiPicker />
          </div>
        </>
      ) : null}
    </>
  );
};

export default Tasks;
