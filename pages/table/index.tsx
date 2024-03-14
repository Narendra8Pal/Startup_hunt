import React, { useState, useEffect } from "react";
import styles from "@/styles/table.module.css";
import Image from "next/image";

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
          <div className={styles.bg_box}>is this working or notd</div>

          <div className={styles.tasks_list}>
            <div className={styles.list_content}>


              {tasksData &&
                tasksData.map((tasks, index) => (
                  <div className={styles.box} key={index}>
                    <div className={styles.box_content}>

                      <div className={styles.date_day}>
                        <ul className={styles.date_day_ul}>
                          <li className={styles.day}>
                            {tasks.Day.slice(0, 3)}
                          </li>
                          <li className={styles.date}>
                            {tasks.Date.split("/")[1]}
                          </li>
                        </ul>
                      </div>

                      <div>
                        {usersData &&
                          usersData.map((user, index) => (
                            <div key={index}>
                              <div>{user.username}</div>

                              <div>
                                <Image
                                  alt="x"
                                  src="/X_table.png"
                                  width={15}
                                  height={15}
                                  priority={true}
                                />
                              </div>

                              <div>
                                <Image
                                  alt="git"
                                  src="/git_table.png"
                                  width={15}
                                  height={15}
                                  priority={true}
                                />
                              </div>
                            </div>
                          ))}
                      </div>

                      <div className={styles.project_info}>
                        <div>
                          <div>
                            <div className={styles.title_desc}>
                              Task Title
                            </div>
                            <div>{tasks.Project_Title}</div>
                          </div>

                          <div>
                            <div className={styles.title_desc}>
                              Task Description
                            </div>
                            <div>{tasks.Project_Desc}</div>
                          </div>
                        </div>
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
