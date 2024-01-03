import React, { useState, useEffect } from "react";
import Sidebar from "@/utils/sidebar";
import styles from "@/styles/profile.module.css";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Modal from '@/utils/modal'

const Profile: React.FC = () => {
  const [opnAddProjectModal, setOpnAddProjectModal] = useState<boolean>(false);
  const [profileModal, setProfileModal] = useState<boolean>(false)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes());
    }
  }, [emblaApi]);

  const handleProject = () => {};


  const addProject = () => {};

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
                <img src="" />
              </div>

              <div>
                <h2 className={styles.username}>Narendra Pal</h2>
              </div>
              <div className={styles.socials}>
                <Link href="">
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

                <Link href="">
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

                  <div className={styles.desc}>
                    Remember, this CSS will only affect browsers that support
                    the WebKit or Firefox scrollbar customization. For a more
                    cross-browser solution, you might want to consider using a
                    JavaScript library like Perfect Scrollbar or Simplebar.
                  </div>

                  <div className={styles.btm_part}>
                    <div>
                      <ul className={styles.btm_content}>
                        <li>Edit</li>
                        <li>Delete</li>
                        <li>GitHub</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

{opnAddProjectModal && (
  <Modal
  // setOpnAddProjectModal={setOpnAddProjectModal}
/>
  )}
      

      {profileModal && (
        <>

        </>
      )}



    </>
  );
};

export default Profile;
