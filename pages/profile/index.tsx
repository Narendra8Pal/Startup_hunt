import React from "react";
import Sidebar from "@/utils/sidebar";
import styles from "@/styles/profile.module.css";
import Image from "next/image";

const Profile: React.FC = () => {
  const handleProject = () => {};

  return (
    <>
      <Sidebar />

      <div className={styles.layout_div}>
        <div className={styles.container}>
          <div className={styles.container_content}>
            <div className={styles.pp_username}>
              <div className={styles.show_pp}>
                <img src="" />
              </div>

              <div>
                <h2 className={styles.username}>Narendra Pal</h2>
              </div>
              <div className={styles.socials}>
                <div className={styles.social1}>
                  <Image
                    src="/twitter.png"
                    alt="x"
                    width={30}
                    height={30}
                    priority={true}
                  />
                </div>

                <div className={styles.social2}>
                  <Image
                    src="/github.png"
                    alt="github"
                    width={30}
                    height={30}
                    priority={true}
                  />
                </div>
              </div>
            </div>

            <div className={styles.projects_container}>
              <div className={styles.title_btn}>
                <h2 className={styles.text}>My Projects</h2>
                <button className={styles.add_btn}>Add Project</button>
              </div>
              <hr className={styles.ruler} />

              <div className={styles.project_list}>
                <div className={styles.project_showcase}>
                  <div
                    className={styles.name_link}
                    onClick={() => handleProject()}
                  >
                    <h2 className={styles.name}>Nosidian</h2>
                    <Image
                      src="/external_link.png"
                      alt="externalLink"
                      width={30}
                      height={30}
                      priority={true}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className={styles.carousel_container}>
                           
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
