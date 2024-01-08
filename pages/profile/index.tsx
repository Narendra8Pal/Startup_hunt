//next.js, style,files
import React, { useState, useEffect } from "react";
import Sidebar from "@/utils/sidebar";
import styles from "@/styles/profile.module.css";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/utils/modal";
//redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import { setUser } from "@/store/userName";
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
import useEmblaCarousel from "embla-carousel-react";

type ImageState = {
  selectedImage: string | null;
};

type Project = {
  id: string;
  Project_title: string;
  description: string;
  github_link: string;
  userId: string;
  web_link: string;
};

const Profile = () => {
  const [opnAddProjectModal, setOpnAddProjectModal] = useState<boolean>(false);
  const [profileModal, setProfileModal] = useState<boolean>(false);
  const [opnEditProject, setOpnEditProject] = useState<boolean>(false);
  const [xUsername, setXUsername] = useState<string>("");
  const [gitUsername, setGitUsername] = useState<string>("");
  const [imageState, setImageState] = useState<ImageState>({
    selectedImage: null,
  });
  const [uid, setUid] = useState<string>("");
  const [projectsData, setProjectsData] = useState<Project[]>([]);

  const db = getFirestore(FirebaseApp);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userName.user);
  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

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
        setUid(uid);
      }
    });
  }, [userDocId]);

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
  }, [profileModal, userDocId]);

  useEffect(() => {
    const getProjectsData = async () => {
      const q = query(collection(db, "projects"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const projectsArray: Project[] = [];
      querySnapshot.forEach((doc) => {
        const projectData = { id: doc.id, ...doc.data() } as Project;
        projectsArray.push(projectData);
        console.log(doc.id);
      });
      setProjectsData(projectsArray);
    };

    if (uid) {
      getProjectsData();
    }
  }, [opnAddProjectModal, userDocId, uid]);

  const handleProject = () => {};

  const addProject = () => {};

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

  return (
    <>
      <Sidebar />

      <div className={styles.layout_div}>
        <div className={styles.container}>
          <div className={styles.container_content}>
            <div className={styles.edit_btn_div}>
              <div
                className={styles.edit_btn_icon}
                onClick={() => setProfileModal(true)}
              >
                <Image
                  src="/edit.png"
                  alt="edit"
                  width={24}
                  height={24}
                  priority={true}
                />
                <button className={styles.edit_btn}>Edit Profile</button>
              </div>
            </div>
            <div className={styles.pp_username}>
              <div className={styles.show_pp}>
                <img
                  src={imageState.selectedImage || "/defaultProfile3.png"}
                  className={styles.show_img}
                />
              </div>

              <div>
                <h2 className={styles.username}>{user}</h2>
              </div>
              <div className={styles.socials}>
                <Link href={`https://twitter.com/${xUsername}`} target="_blank">
                  <div className={styles.social1}>
                    <Image
                      src="/twitter.png"
                      alt="x"
                      width={30}
                      height={30}
                      priority={true}
                    />
                  </div>
                </Link>

                <Link
                  href={`https://github.com/${gitUsername}`}
                  target="_blank"
                >
                  <div className={styles.social2}>
                    <Image
                      src="/github.png"
                      alt="github"
                      width={30}
                      height={30}
                      priority={true}
                    />
                  </div>
                </Link>
              </div>
            </div>

            <div className={styles.projects_container}>
              <div className={styles.title_btn}>
                <h2 className={styles.text}>My Projects</h2>
                <button
                  className={styles.add_btn}
                  onClick={() => setOpnAddProjectModal(true)}
                >
                  Add Project
                </button>
              </div>
              <hr className={styles.ruler} />

              {projectsData.map((project, index) => (
                <div className={styles.project_list} key={index}>
                  <div className={styles.project_showcase}>
                    <div
                      className={styles.name_link}
                      onClick={() => handleProject()}
                    >
                      <h2 className={styles.name}>{project.Project_title}</h2>
                      <Image
                        src="/external_link.png"
                        alt="externalLink"
                        width={30}
                        height={30}
                        priority={true}
                        className={styles.link_icon}
                      />
                    </div>

                    <div className={styles.carousel_container}>
                      <div className={styles.embla} ref={emblaRef}>
                        <div className={styles.embla__container}>
                          <div className={styles.embla__slide}>Slide 1</div>
                          <div className={styles.embla__slide}>Slide 2</div>
                          <div className={styles.embla__slide}>Slide 3</div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.desc}>{project.description}</div>

                    <div className={styles.btm_part}>
                      <div>
                        <ul className={styles.btm_content}>
                          <li onClick={() => setOpnEditProject(true)}>Edit</li>
                          <li onClick={() => handleProjectDelete(project.id)}>
                            Delete
                          </li>
                          <Link href={project.github_link}>
                            <li>GitHub</li>
                          </Link>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
        setImageState={setImageState}
        imageState={imageState}
      />
    </>
  );
};

export default Profile;
