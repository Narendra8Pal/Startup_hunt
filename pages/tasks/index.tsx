import React, { useState, useRef, useEffect, ChangeEvent } from "react";
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
  deleteDoc,
  setDoc,
  serverTimestamp,
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
  taskDocId: string;
  thumbUp: number;
  thumbDn: number;
  thumbUpClicked: boolean;
  thumbDnClicked: boolean;
  bgColor: string;
};

type Task = {
  id: string;
  status: string;
  title: string;
  desc: string;
  taskDocId: string;
  thumbUp: number;
  thumbDn: number;
  thumbUpClicked: boolean;
  thumbDnClicked: boolean;
  bgColor: string;
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
  const [titleCountExc, setTitleCountExc] = useState<boolean>();
  const [wordCountExceeded, setWordCountExceeded] = useState<boolean>(false);

  const [expandModalOpen, setExpandModalOpen] = useState<boolean>(false);
  const [expandTitle, setExpandTitle] = useState<string>("");
  const [expandDesc, setExpandDesc] = useState<string>("");
  const [replyTaskId, setReplyTaskId] = useState<string>("");
  const [textarea, setTextarea] = useState<string>("");

  // draggable functionality based usestate hooks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [customMenuOpen, setCustomMenuOpen] = useState<boolean>(false);
  const [col2MenuOpen, setCol2MenuOpen] = useState<boolean>(false);
  const [col3MenuOpen, setCol3MenuOpen] = useState<boolean>(false);
  const [customMenuPosition, setCustomMenuPosition] = useState({ x: 0, y: 0 });
  const [editMenu, setEditMenu] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDesc, setEditDesc] = useState<string>("");
  const [editStatusSelected, setEditStatusSelected] = useState<string>("");
  const [editTaskDocId, setEditTaskDocId] = useState<string>("");

  //menu bg
  const [bgBox, setBgBox] = useState<boolean>(false);
  const [bgBoxColor, setBgBoxColor] = useState<string>("");
  const [exBgColor, setExBgColor] = useState<string>("");

  const [statusSelected, setStatusSelected] = useState<string>("");
  const [showIconsToOwner, setShowIconsToOwner] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.userName.user);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const db = getFirestore(FirebaseApp);
  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );
  const showDocIdIcon = useSelector(
    (state: RootState) => state.showDocIdIcon.showDocIdIcon
  );

  const router = useRouter();

  const customMenuRef = useRef<HTMLDivElement>(null);

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
    const getOwnerDocId = () => {
      getDoc(doc(db, "users", `${userDocId}`));
    };
  }, []);

  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, "tasks", `${props.Id}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { userId } = docSnap.data();
        if (uid === userId) {
          setShowIconsToOwner(true);
        }
      }
    };
    getOwner();
  }, [props.Id, uid]);

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
    setEditMenu(false);
    setProjectTitle("");
    setProjectDesc("");
    setEditTitle("");
    setEditDesc("");
    setWordCountExceeded(false);
    setTitleCountExc(false);
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
    if (!projectTitle.trim() || !projectDesc.trim()) {
      alert("Please enter a title and description");
      return;
    }
    handleModal();
    try {
      const collectionRef = collection(db, "tasks");
      const currentDate = new Date();
      const dayOfWeek = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const formattedDate = currentDate.toLocaleDateString("en-US");
      const docRef = await addDoc(collectionRef, {
        Project_Title: projectTitle,
        Project_Desc: projectDesc,
        userId: uid,
        Date: formattedDate,
        Day: dayOfWeek,
      });
      const docId = docRef.id;
      handlePrjClick(docId);
    } catch (error) {
      console.error("Error creating collection: ", error);
    }
  };

  const handleAddBrick = async () => {
    if (!projectTitle.trim() || !projectDesc.trim()) {
      alert("Please enter a title and description");
      return;
    }
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
        status: statusSelected === "none" ? "" : statusSelected,
        col: tasksCount % 2 == 0 ? "col1" : "col2",
        taskDocId: "",
        thumbUp: 0,
        thumbDn: 0,
        thumbUpClicked: false,
        thumbDnClicked: false,
        bgColor: "#ffffff",
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

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (editMenu) {
      setEditStatusSelected(event.target.value);
    } else {
      setStatusSelected(event.target.value);
    }
  };

  useEffect(() => {
    const updateBgBrick = async () => {
      try {
        const subcollectionRef = collection(
          db,
          "tasks",
          `${props.Id}`,
          "tasks_content"
        );

        const updatedTaskBoxBg = {
          bgColor: bgBoxColor,
        };

        const taskRef = doc(subcollectionRef, editTaskDocId);
        await updateDoc(taskRef, updatedTaskBoxBg);

        const updatedTasks = tasks.map((task) =>
          task.taskDocId === editTaskDocId
            ? { ...task, ...updatedTaskBoxBg }
            : task
        );
        setTasks(updatedTasks);
      } catch (error) {
        console.error("Error updating taskBox color: ", error);
      }
      setBgBox(false);
    };
    if (bgBox) {
      updateBgBrick();
    }
  }, [bgBoxColor, bgBox]);

  const updateBrick = async () => {
    if (!editTitle.trim() || !editDesc.trim()) {
      alert("Please enter a title and description");
      return;
    }
    handleModal();
    try {
      const subcollectionRef = collection(
        db,
        "tasks",
        `${props.Id}`,
        "tasks_content"
      );

      const taskSnapshot = await getDocs(subcollectionRef);
      const tasksCount = taskSnapshot.docs.length;

      const updatedTaskData = {
        title: editTitle,
        desc: editDesc,
        status: editStatusSelected === "none" ? "" : editStatusSelected,
      };

      const taskRef = doc(subcollectionRef, editTaskDocId);
      await updateDoc(taskRef, updatedTaskData);

      const updatedTasks = tasks.map((task) =>
        task.taskDocId === editTaskDocId
          ? { ...task, ...updatedTaskData }
          : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating subcollection: ", error);
    }
  };

  const handleEditArg = (
    id: string,
    title: string,
    desc: string,
    taskDocId: string,
    status: string
  ) => {
    setEditTitle(title);
    setEditDesc(desc);
    setEditTaskDocId(taskDocId);
    setEditStatusSelected(status);
  };

  const handleEditMouse = (
    id: string,
    title: string,
    desc: string,
    taskDocId: string,
    status: string
  ) => {
    handleEditArg(id, title, desc, taskDocId, status);
  };

  const handleEditClick = () => {
    handleFalseMenu();
    setEditMenu(true);
    setTaskModalContent(true);
  };

  const handleBgBox = (color: string) => {
    handleFalseMenu();
    setBgBox(true);
    setBgBoxColor(color);
  };

  const handleFalseMenu = () => {
    setCustomMenuOpen(false);
    setCol2MenuOpen(false);
    setCol3MenuOpen(false);
  };

  const handleBrickDelete = async () => {
    handleFalseMenu();
    try {
      const subcollectionRef = collection(
        db,
        "tasks",
        `${props.Id}`,
        "tasks_content"
      );

      const taskRef = doc(subcollectionRef, editTaskDocId);
      await deleteDoc(taskRef);

      const updatedTasks = tasks.filter(
        (task) => task.taskDocId !== editTaskDocId
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleChange =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      switch (key) {
        case "ProjectTitle":
          const title = e.target.value.split(/\s+/);
          if (title.length <= 7) {
            setProjectTitle(e.target.value);
            setTitleCountExc(false);
          } else {
            setTitleCountExc(true);
          }
          break;
        case "ProjectDesc":
          const words = e.target.value.split(/\s+/);
          if (words.length <= 80) {
            setProjectDesc(e.target.value);
            setWordCountExceeded(false);
          } else {
            setWordCountExceeded(true);
          }
          break;
        case "EditTitle":
          const editText = e.target.value.split(/\s+/);
          if (editText.length <= 7) {
            setEditTitle(e.target.value);
            setTitleCountExc(false);
          } else {
            setTitleCountExc(true);
          }
          break;
        case "EditDesc":
          const editDesc = e.target.value.split(/\s+/);
          if (editDesc.length <= 80) {
            setEditDesc(e.target.value);
            setWordCountExceeded(false);
          } else {
            setWordCountExceeded(true);
          }
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
    e.dataTransfer.setData("taskId", taskDocId);
  };

  const handleDragEnd = () => {};

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFalseMenu();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    targetCol: string
  ) => {
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

  const handleExpandView = (
    title: string,
    desc: string,
    id: string,
    bgColor: string
  ) => {
    setExpandModalOpen(true);
    setExpandTitle(title);
    setExpandDesc(desc);
    setReplyTaskId(id);
    setExBgColor(bgColor);
  };

  // will do it late on bro firebase need to know about tasks_content beofre that it need to know about tasks collection
  const handleMsg = async () => {
    // const commentsCollection = collection(db, "tasks", replyTaskId, "comments");
    // const newCommentRef = doc(commentsCollection, uid);
    // const textCollectionRef = collection(newCommentRef, "text");
    // console.log(replyTaskId, "reply task id bro");
    // const newComment = {
    //   profile_img: userImgURL,
    //   username: user,
    // };
    // try {
    //   await setDoc(newCommentRef, newComment);
    //   await addDoc(textCollectionRef, {
    //     comment: textarea,
    //     timestamp: serverTimestamp(),
    //   });
    // } catch (error) {
    //   console.error("Error adding comment:", error);
    // }
    // setTextarea("");
  };

  const emojiHit = async (taskId: string, emojiType: string) => {
    const subcollectionRef = collection(
      db,
      "tasks",
      `${props.Id}`,
      "tasks_content"
    );

    const taskRef = doc(subcollectionRef, taskId);
    const taskDoc = await getDoc(taskRef);
    const taskData = taskDoc.data();

    if (taskData) {
      let updatedCount: number;
      let updatedClickedField;
      if (emojiType === "thumbUp") {
        updatedCount = taskData.thumbUpClicked
          ? (taskData.thumbUp || 0) - 1
          : (taskData.thumbUp || 0) + 1;
        updatedClickedField = { thumbUpClicked: !taskData.thumbUpClicked };

        await updateDoc(taskRef, {
          thumbUp: emojiType === "thumbUp" ? updatedCount : taskData.thumbUp,
          ...updatedClickedField,
        });
      } else if (emojiType === "thumbDn") {
        updatedCount = taskData.thumbDnClicked
          ? (taskData.thumbDn || 0) - 1
          : (taskData.thumbDn || 0) + 1;
        updatedClickedField = { thumbDnClicked: !taskData.thumbDnClicked };

        await updateDoc(taskRef, {
          thumbDn: updatedCount,
          ...updatedClickedField,
        });
      }

      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            thumbUp: emojiType === "thumbUp" ? updatedCount : task.thumbUp,
            thumbDn: emojiType === "thumbDn" ? updatedCount : task.thumbDn,
            thumbUpClicked:
              emojiType === "thumbUp"
                ? !taskData.thumbUpClicked
                : task.thumbUpClicked,
            thumbDnClicked:
              emojiType === "thumbDn"
                ? !taskData.thumbDnClicked
                : task.thumbDnClicked,
          };
        } else {
          return task;
        }
      });
      setTasks(updatedTasks);
    } else {
      console.error("taskData is undefined");
    }
  };

  const handleScrollPosition = (rect: any) => {
    const scrollX = document.documentElement.scrollLeft;
    const scrollY = document.documentElement.scrollTop;
    setCustomMenuPosition({ x: rect.left + scrollX, y: rect.bottom + scrollY });
  };

  const handleAddIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    handleScrollPosition(rect);
    setCustomMenuOpen(true);
    setCol2MenuOpen(false);
    setCol3MenuOpen(false);
  };

  const handleCol2Menu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    handleScrollPosition(rect);
    setCol2MenuOpen(true);
    setCustomMenuOpen(false);
    setCol3MenuOpen(false);
  };
  const handleCol3Menu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    handleScrollPosition(rect);
    setCol3MenuOpen(true);
    setCustomMenuOpen(false);
    setCol2MenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        customMenuRef.current &&
        !customMenuRef.current.contains(e.target as Node)
      ) {
        handleFalseMenu();
      }
    };

    if (customMenuOpen || col2MenuOpen || col3MenuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [customMenuOpen, col2MenuOpen, col3MenuOpen]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content_container}>
          <div className={styles.content_div}>
            <div>
              <div className={styles.switch_btn}>
                <div
                  className={
                    showIconsToOwner
                      ? styles.dropdown
                      : styles.no_dropdown || showDocIdIcon
                      ? styles.dropdown
                      : styles.no_dropdown
                  }
                  onClick={
                    showIconsToOwner
                      ? () => setDDOpen(!ddOpen)
                      : undefined || showDocIdIcon
                      ? () => setDDOpen(!ddOpen)
                      : undefined
                  }
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

                  {showIconsToOwner ? (
                    <Image
                      src="/down_btn.png"
                      alt={ddOpen ? "up_btn" : "down_btn"}
                      height={20}
                      width={20}
                      className={ddOpen ? styles.up_btn : ""}
                    />
                  ) : null}

                  {showDocIdIcon ? (
                    <Image
                      src="/down_btn.png"
                      alt={ddOpen ? "up_btn" : "down_btn"}
                      height={20}
                      width={20}
                      className={ddOpen ? styles.up_btn : ""}
                    />
                  ) : null}
                </div>

                <div className={styles.btn_div}>
                  {showIconsToOwner ? (
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
                  ) : null}

                  {showDocIdIcon ? (
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
                  ) : null}

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
                    : "please create a task first using the layer icon placed before your profile image or choose your created task using dropdown :)"}
                </p>
              </div>
            </div>

            <hr className={styles.ruler} />

            <div className={styles.bottom_content}>
              <div className={styles.grid_box}>
                <div className={styles.box_col}>
                  <div
                    className={
                      taskContentDocData.length === 0
                        ? styles.two_boxes
                        : styles.two_boxes_min_h
                    }
                  >
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
                              style={{
                                backgroundColor: item.bgColor,
                              }}
                              draggable
                              onDragStart={(e) =>
                                handleDragStart(e, item.taskDocId)
                              }
                              onDragEnd={handleDragEnd}
                              onDragOver={() => setHoveredIndex(index)}
                              onDragLeave={() => setHoveredIndex(null)}
                            >
                              <div className={styles.tit_desc}>
                                <div className={styles.show_label_div}>
                                  <div
                                    className={
                                      item.status === "building"
                                        ? styles.build_label
                                        : item.status === "thinking"
                                        ? styles.think_label
                                        : item.status === "idea"
                                        ? styles.idea_label
                                        : item.status === ""
                                        ? ""
                                        : ""
                                    }
                                  >
                                    <div
                                      className={
                                        item.status === ""
                                          ? ""
                                          : styles.dot_label
                                      }
                                    ></div>
                                    {item.status}
                                  </div>
                                </div>
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
                                    <button className={styles.thumb_up}>
                                      <div
                                        className={styles.thumb_img}
                                        onClick={() =>
                                          emojiHit(item.taskDocId, "thumbUp")
                                        }
                                      >
                                        👍
                                      </div>
                                      <span className={styles.thumb_no}>
                                        {item.thumbUp}
                                      </span>
                                    </button>
                                    <button className={styles.thumb_dn}>
                                      <div
                                        className={styles.thumb_img}
                                        onClick={() =>
                                          emojiHit(item.taskDocId, "thumbDn")
                                        }
                                      >
                                        👎
                                      </div>
                                      <span className={styles.thumb_no}>
                                        {item.thumbDn}
                                      </span>
                                    </button>
                                  </div>
                                </div>

                                <div className={styles.three_icon_div}>
                                  <div
                                    className={styles.expand_icon}
                                    onClick={() =>
                                      handleExpandView(
                                        item.title,
                                        item.desc,
                                        item.taskDocId,
                                        item.bgColor
                                      )
                                    }
                                  >
                                    <Image
                                      src="/expand.png"
                                      alt="expand"
                                      width={15}
                                      height={15}
                                      priority={true}
                                    />
                                  </div>

                                  <div
                                    className={styles.cmnt_icon}
                                    onClick={() =>
                                      handleExpandView(
                                        item.title,
                                        item.desc,
                                        item.taskDocId,
                                        item.bgColor
                                      )
                                    }
                                  >
                                    <Image
                                      src="/comment.png"
                                      alt="comment"
                                      width={15}
                                      height={15}
                                      priority={true}
                                    />
                                  </div>

                                  {showIconsToOwner ? (
                                    <div
                                      className={styles.add_icon}
                                      onClick={(e) => handleAddIconClick(e)}
                                      onMouseEnter={() =>
                                        handleEditMouse(
                                          item.id,
                                          item.title,
                                          item.desc,
                                          item.taskDocId,
                                          item.status
                                        )
                                      }
                                    >
                                      <Image
                                        src="/more.png"
                                        alt="more"
                                        width={26}
                                        height={26}
                                        priority={true}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            {/* {index < array.length - 1 && ( */}
                            {/* will add placeholder later on */}
                            {/* {hoveredIndex === index && (
                              <div
                                key={`placeholder-${item.id}`}
                                className={styles.box_placeholder}
                              ></div>
                            )} */}

                            {customMenuOpen && (
                              <div
                                className={styles.custom_menu}
                                style={{
                                  top: customMenuPosition.y,
                                  left: customMenuPosition.x,
                                }}
                                ref={customMenuRef}
                              >
                                <ul className={styles.menu_li}>
                                  <div
                                    className={styles.menu_edit}
                                    onClick={() => handleEditClick()}
                                  >
                                    <div className={styles.menu_edit_img}>
                                      <Image
                                        alt="edit"
                                        src="/menu_edit.png"
                                        width={24}
                                        height={24}
                                        priority={true}
                                      />
                                    </div>
                                    <li className={styles.menu_li_txt}>Edit</li>
                                  </div>

                                  <div
                                    className={styles.menu_delete}
                                    onClick={() => handleBrickDelete()}
                                  >
                                    <div className={styles.menu_delete_img}>
                                      <Image
                                        alt="del"
                                        src="/menu_delete_black.png"
                                        width={24}
                                        height={24}
                                        priority={true}
                                      />
                                    </div>
                                    <li className={styles.menu_li_txt}>
                                      Delete
                                    </li>
                                  </div>

                                  <div className={styles.bg_box}>
                                    <div className={styles.menu_grid}>
                                      <div
                                        className={styles.bg0}
                                        onClick={() => handleBgBox("#ffffff")}
                                      ></div>
                                      <div
                                        className={styles.bg1}
                                        onClick={() => handleBgBox("#d7e3fc")}
                                      ></div>
                                      <div
                                        className={styles.bg2}
                                        onClick={() => handleBgBox("#fff6ea")}
                                      ></div>
                                      <div
                                        className={styles.bg3}
                                        onClick={() => handleBgBox("#efd7cf")}
                                      ></div>
                                      <div
                                        className={styles.bg4}
                                        onClick={() => handleBgBox("#fbe0e0")}
                                      ></div>
                                    </div>
                                  </div>
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
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
                              style={{
                                backgroundColor: item.bgColor,
                              }}
                              draggable
                              onDragStart={(e) =>
                                handleDragStart(e, item.taskDocId)
                              }
                              onDragEnd={handleDragEnd}
                              onDragOver={() => setHoveredIndex(index)}
                              onDragLeave={() => setHoveredIndex(null)}
                            >
                              <div className={styles.tit_desc}>
                                <div className={styles.show_label_div}>
                                  <div
                                    className={
                                      item.status === "building"
                                        ? styles.build_label
                                        : item.status === "thinking"
                                        ? styles.think_label
                                        : item.status === "idea"
                                        ? styles.idea_label
                                        : item.status === ""
                                        ? ""
                                        : ""
                                    }
                                  >
                                    <div
                                      className={
                                        item.status === ""
                                          ? ""
                                          : styles.dot_label
                                      }
                                    ></div>
                                    {item.status}
                                  </div>
                                </div>

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
                                    <button className={styles.thumb_up}>
                                      <div
                                        className={styles.thumb_img}
                                        onClick={() =>
                                          emojiHit(item.taskDocId, "thumbUp")
                                        }
                                      >
                                        👍
                                      </div>
                                      <span className={styles.thumb_no}>
                                        {item.thumbUp}
                                      </span>
                                    </button>
                                    <button className={styles.thumb_dn}>
                                      <div
                                        className={styles.thumb_img}
                                        onClick={() =>
                                          emojiHit(item.taskDocId, "thumbDn")
                                        }
                                      >
                                        👎
                                      </div>
                                      <span className={styles.thumb_no}>
                                        {item.thumbDn}
                                      </span>
                                    </button>
                                  </div>
                                </div>

                                <div className={styles.three_icon_div}>
                                  <div
                                    className={styles.expand_icon}
                                    onClick={() =>
                                      handleExpandView(
                                        item.title,
                                        item.desc,
                                        item.taskDocId,
                                        item.bgColor
                                      )
                                    }
                                  >
                                    <Image
                                      src="/expand.png"
                                      alt="expand"
                                      width={15}
                                      height={15}
                                      priority={true}
                                    />
                                  </div>

                                  <div
                                    className={styles.cmnt_icon}
                                    onClick={() =>
                                      handleExpandView(
                                        item.title,
                                        item.desc,
                                        item.taskDocId,
                                        item.bgColor
                                      )
                                    }
                                  >
                                    <Image
                                      src="/comment.png"
                                      alt="comment"
                                      width={15}
                                      height={15}
                                      priority={true}
                                    />
                                  </div>

                                  {showIconsToOwner ? (
                                    <div
                                      className={styles.add_icon}
                                      onClick={(e) => handleCol2Menu(e)}
                                      onMouseEnter={() =>
                                        handleEditMouse(
                                          item.id,
                                          item.title,
                                          item.desc,
                                          item.taskDocId,
                                          item.status
                                        )
                                      }
                                    >
                                      <Image
                                        src="/more.png"
                                        alt="more"
                                        width={26}
                                        height={26}
                                        priority={true}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            {/* {hoveredIndex === index && (
                              <div
                                key={`placeholder-${item.id}`}
                                className={styles.box_placeholder}
                              ></div>
                            )} */}

                            {col2MenuOpen ? (
                              <>
                                <div
                                  className={styles.custom_menu}
                                  style={{
                                    top: customMenuPosition.y,
                                    left: customMenuPosition.x,
                                  }}
                                  ref={customMenuRef}
                                >
                                  <ul className={styles.menu_li}>
                                    <div
                                      className={styles.menu_edit}
                                      onClick={() => handleEditClick()}
                                    >
                                      <div className={styles.menu_edit_img}>
                                        <Image
                                          alt="edit"
                                          src="/menu_edit.png"
                                          width={24}
                                          height={24}
                                          priority={true}
                                        />
                                      </div>
                                      <li className={styles.menu_li_txt}>
                                        Edit
                                      </li>
                                    </div>

                                    <div
                                      className={styles.menu_delete}
                                      onClick={() => handleBrickDelete()}
                                    >
                                      <div className={styles.menu_delete_img}>
                                        <Image
                                          alt="del"
                                          src="/menu_delete_black.png"
                                          width={24}
                                          height={24}
                                          priority={true}
                                        />
                                      </div>
                                      <li className={styles.menu_li_txt}>
                                        Delete
                                      </li>
                                    </div>

                                    <div className={styles.bg_box}>
                                      <div className={styles.menu_grid}>
                                        <div
                                          className={styles.bg0}
                                          onClick={() => handleBgBox("#ffffff")}
                                        ></div>
                                        <div
                                          className={styles.bg1}
                                          onClick={() => handleBgBox("#d7e3fc")}
                                        ></div>
                                        <div
                                          className={styles.bg2}
                                          onClick={() => handleBgBox("#fff6ea")}
                                        ></div>
                                        <div
                                          className={styles.bg3}
                                          onClick={() => handleBgBox("#efd7cf")}
                                        ></div>
                                        <div
                                          className={styles.bg4}
                                          onClick={() => handleBgBox("#fbe0e0")}
                                        ></div>
                                      </div>
                                    </div>
                                  </ul>
                                </div>
                              </>
                            ) : null}
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
                          style={{
                            backgroundColor: item.bgColor,
                          }}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, item.taskDocId)
                          }
                          onDragEnd={handleDragEnd}
                          onDragOver={() => setHoveredIndex(index)}
                          onDragLeave={() => setHoveredIndex(null)}
                        >
                          <div className={styles.tit_desc}>
                            <div className={styles.show_label_div}>
                              <div
                                className={
                                  item.status === "building"
                                    ? styles.build_label
                                    : item.status === "thinking"
                                    ? styles.think_label
                                    : item.status === "idea"
                                    ? styles.idea_label
                                    : item.status === ""
                                    ? ""
                                    : ""
                                }
                              >
                                <div
                                  className={
                                    item.status === "" ? "" : styles.dot_label
                                  }
                                ></div>
                                {item.status}
                              </div>
                            </div>
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
                              <div
                                className={styles.expand_icon}
                                onClick={() =>
                                  handleExpandView(
                                    item.title,
                                    item.desc,
                                    item.id,
                                    item.bgColor
                                  )
                                }
                              >
                                <Image
                                  src="/expand.png"
                                  alt="expand"
                                  width={15}
                                  height={15}
                                  priority={true}
                                />
                              </div>

                              {showIconsToOwner ? (
                                <div
                                  className={styles.add_icon}
                                  onClick={(e) => handleCol3Menu(e)}
                                  onMouseEnter={() =>
                                    handleEditMouse(
                                      item.id,
                                      item.title,
                                      item.desc,
                                      item.taskDocId,
                                      item.status
                                    )
                                  }
                                >
                                  <Image
                                    src="/more.png"
                                    alt="more"
                                    width={26}
                                    height={26}
                                    priority={true}
                                  />
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* {hoveredIndex === index && (
                          <div
                            key={`placeholder-${item.id}`}
                            className={styles.box_placeholder}
                          ></div>
                        )} */}

                        {col3MenuOpen ? (
                          <>
                            <div
                              className={styles.custom_menu}
                              style={{
                                top: customMenuPosition.y,
                                left: customMenuPosition.x,
                              }}
                              ref={customMenuRef}
                            >
                              <ul className={styles.menu_li}>
                                <div
                                  className={styles.menu_edit}
                                  onClick={() => handleEditClick()}
                                >
                                  <div className={styles.menu_edit_img}>
                                    <Image
                                      alt="edit"
                                      src="/menu_edit.png"
                                      width={24}
                                      height={24}
                                      priority={true}
                                    />
                                  </div>
                                  <li className={styles.menu_li_txt}>Edit</li>
                                </div>

                                <div
                                  className={styles.menu_delete}
                                  onClick={() => handleBrickDelete()}
                                >
                                  <div className={styles.menu_delete_img}>
                                    <Image
                                      alt="del"
                                      src="/menu_delete_black.png"
                                      width={24}
                                      height={24}
                                      priority={true}
                                    />
                                  </div>
                                  <li className={styles.menu_li_txt}>Delete</li>
                                </div>

                                <div className={styles.bg_box}>
                                  <div className={styles.menu_grid}>
                                    <div
                                      className={styles.bg0}
                                      onClick={() => handleBgBox("#ffffff")}
                                    ></div>
                                    <div
                                      className={styles.bg1}
                                      onClick={() => handleBgBox("#d7e3fc")}
                                    ></div>
                                    <div
                                      className={styles.bg2}
                                      onClick={() => handleBgBox("#fff6ea")}
                                    ></div>
                                    <div
                                      className={styles.bg3}
                                      onClick={() => handleBgBox("#efd7cf")}
                                    ></div>
                                    <div
                                      className={styles.bg4}
                                      onClick={() => handleBgBox("#fbe0e0")}
                                    ></div>
                                  </div>
                                </div>
                              </ul>
                            </div>
                          </>
                        ) : null}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {props.Id && showIconsToOwner && (
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
                    className={`${styles.input} ${
                      titleCountExc ? `${styles.red_border}` : ""
                    }  `}
                    onChange={
                      editMenu
                        ? handleChange("EditTitle")
                        : handleChange("ProjectTitle")
                    }
                    value={editMenu ? editTitle : projectTitle}
                  />
                  {titleCountExc && (
                    <p className={styles.red_text}>Word count exceeded</p>
                  )}
                </div>

                <div>
                  <div>
                    {taskModalContent
                      ? "Brick Description"
                      : "Task Description"}
                  </div>
                  <textarea
                    className={`${styles.textarea} ${
                      wordCountExceeded ? `${styles.red_border}` : ""
                    }  `}
                    onChange={
                      editMenu
                        ? handleChange("EditDesc")
                        : handleChange("ProjectDesc")
                    }
                    value={editMenu ? editDesc : projectDesc}
                  />
                  {wordCountExceeded && (
                    <p className={styles.red_text}>Word count exceeded</p>
                  )}
                </div>

                {taskModalContent ? <div>Brick Status</div> : null}

                {taskModalContent ? (
                  <div className={styles.status_label}>
                    <div className={styles.label_div}>
                      <label>
                        <input
                          type="radio"
                          name="status"
                          value="building"
                          checked={
                            editMenu
                              ? editStatusSelected === "building"
                              : statusSelected === "building"
                          }
                          className={styles.radio_btn}
                          onChange={handleStatusChange}
                        />
                      </label>
                      <div className={styles.build_label}>building</div>
                    </div>

                    <div className={styles.label_div}>
                      <label>
                        <input
                          type="radio"
                          name="status"
                          value="thinking"
                          checked={
                            editMenu
                              ? editStatusSelected === "thinking"
                              : statusSelected === "thinking"
                          }
                          className={styles.radio_btn}
                          onChange={handleStatusChange}
                        />
                      </label>
                      <div className={styles.think_label}>thinking</div>
                    </div>

                    <div className={styles.label_div}>
                      <label>
                        <input
                          type="radio"
                          name="status"
                          value="idea"
                          checked={
                            editMenu
                              ? editStatusSelected === "idea"
                              : statusSelected === "idea"
                          }
                          className={styles.radio_btn}
                          onChange={handleStatusChange}
                        />
                      </label>

                      <div className={styles.idea_label}>idea</div>
                    </div>
                  </div>
                ) : null}

                {taskModalContent && (
                  <div className={styles.label_div}>
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value="none"
                        checked={
                          editMenu
                            ? editStatusSelected === "none"
                            : statusSelected === "none"
                        }
                        className={styles.radio_btn}
                        onChange={handleStatusChange}
                      />
                    </label>
                    <div className={styles.none_label}>none</div>
                  </div>
                )}
              </div>

              <div className={styles.btn_div}>
                {editMenu ? (
                  <button className={styles.btn} onClick={updateBrick}>
                    Edit
                  </button>
                ) : (
                  <button
                    className={styles.btn}
                    onClick={taskModalContent ? handleAddBrick : handleCreate}
                  >
                    {taskModalContent ? "Create" : "Create"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {expandModalOpen ? (
        <>
          <div className={styles.modal_div}></div>
          <div
            className={styles.add_modal_bg}
            onClick={() => setExpandModalOpen(false)}
          >
            <div
              className={styles.expand_modal}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor:
                  exBgColor === "#ffffff" ? "#fff0d4" : exBgColor,
              }}
            >
              <div className={styles.modal_container}>
                <div className={styles.ex_modal_content}>
                  <div className={styles.left_content}>
                    <div className={styles.title_desc}>
                      <div className={styles.ex_title}>
                        <div className={styles.ex_txt_title}>Title</div>
                        {expandTitle}
                      </div>

                      <div>
                        <div className={styles.ex_txt_desc}>Description</div>
                        {expandDesc}
                      </div>
                    </div>
                  </div>

                  <div className={styles.right_content}>
                    <div className={styles.show_reply}></div>

                    <div className={styles.reply_input_div}>
                      <textarea
                        placeholder="type your reply here..."
                        className={styles.reply_input}
                        onChange={(e) => setTextarea(e.target.value)}
                        value={textarea}
                      />
                      <div
                        className={styles.send_btn}
                        onClick={() => handleMsg()}
                      >
                        <Image
                          alt="send"
                          src="/Sent.png"
                          width={20}
                          height={20}
                          priority={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
