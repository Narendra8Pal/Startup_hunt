import React, { useState, useEffect } from "react";
import styles from "@/styles/table.module.css";
import Image from "next/image";
import Link from "next/link";

//firebase
import { collection, doc, getDocs, getDoc, query } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import FirebaseApp from "../../utils/firebase";

//redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";

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

const Table = () => {
  const [tasksData, setTasksData] = useState<Tasks_Content[]>([]);
  const [allUserIds, setAllUserIds] = useState<string[]>([]);
  const [usersData, setUsersData] = useState<User_Info[]>([]);

  const db = getFirestore(FirebaseApp);

  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );

  useEffect(() => {
    const getTasksData = async () => {
      const q = query(collection(db, "tasks"));
      const querySnapshot = await getDocs(q);
      const projectsArray: Tasks_Content[] = [];
      querySnapshot.forEach((doc) => {
        const projectData = { id: doc.id, ...doc.data() } as Tasks_Content;
        projectsArray.push(projectData);
      });
      setTasksData(projectsArray);
      const userIds = projectsArray.map((project) => project.userId);
      setAllUserIds(userIds);
    };
    getTasksData();
  }, []);

  useEffect(() => {
    const getUsersData = async () => {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const UserArray: User_Info[] = [];
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() } as User_Info;
        if (allUserIds.includes(data.userId)) {
          UserArray.push(data);
        }
      });
      setUsersData(UserArray);
    };
    getUsersData();
  }, [allUserIds]);

  return (
    <div className={styles.container}>
      <div className={styles.content_container}>
        <div className={styles.content_div}>
          <div className={styles.heading}>View Tasks</div>
          <div className={styles.bg_box}>
            View all the tasks created by the user and give them feedback by
            visiting the task.
          </div>

          <div className={styles.tasks_list}>
            <div className={styles.list_content}>
              {tasksData &&
                tasksData.map((tasks, index) => (
                  <div className={styles.box} key={index}>
                    <div className={styles.box_content}>
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

                      <div className={styles.name_social_div}>
                        {usersData &&
                          usersData
                            .filter((data) => data.userId === tasks.userId)
                            .map((user, index) => (
                              <div key={index} className={styles.name_social}>
                                <div className={styles.username}>
                                  {user.username}
                                </div>

                                <div className={styles.social_icons}>
                                  <div className={styles.icon}>
                                    <Link
                                      href={`https://twitter.com/${user.twitterUsername}`}
                                      target="_blank"
                                    >
                                      <Image
                                        alt="x"
                                        src="/X_table.png"
                                        width={17}
                                        height={17}
                                        priority={true}
                                      />
                                    </Link>
                                  </div>

                                  <div className={styles.icon}>
                                    <Link
                                      href={`https://github.com/${user.githubUsername}`}
                                      target="_blank"
                                    >
                                      <Image
                                        alt="git"
                                        src="/git_table.png"
                                        width={17}
                                        height={17}
                                        priority={true}
                                      />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                      </div>

                      <div className={styles.title_div}>
                        <div className={styles.title_content}>
                          <div className={styles.title_desc}>Task Title</div>
                          <div>{tasks.Project_Title}</div>
                        </div>
                      </div>

                      <div className={styles.desc_div}>
                        <div className={styles.desc_content}>
                          <div className={styles.title_desc}>
                            Task Description
                          </div>
                          {tasks.Project_Desc.split(" ").slice(0, 20).join(" ")}
                          {tasks.Project_Desc.split(" ").length > 20
                            ? "..."
                            : ""}{" "}
                        </div>
                      </div>

                      <div className={styles.visit_btn_div}>
                        <Link href={`/tasks/${userDocId}/${tasks.id}`}>
                          <button className={styles.visit_btn}>visit</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
