import React, { useState, useEffect } from "react";
import styles from "@/styles/sidebar.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

//files
import Modal from "@/utils/modal";

//redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import { setUser } from "@/store/userName";

const Sidebar = () => {
  const router = useRouter();

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1);

  const [opnAddProjectModal, setOpnAddProjectModal] = useState<boolean>(false);
  const [opnEditProject, setOpnEditProject] = useState<boolean>(false);

  const userDocId = useSelector(
    (state: RootState) => state.usersDocId.usersDocId
  );

  useEffect(() => {
    const pathname = router.asPath;
    const sidebarOptions = [
      { label: "Explore", route: `/explore/${userDocId}` },
      { label: "Table", route: `/table/${userDocId}` },
      { label: "Tasks & Feedback", route: `/tasks/${userDocId}` },
      { label: "Profile", route: `/profile/${userDocId}` },
    ];
    const selectedOption = sidebarOptions.findIndex((option) =>
      pathname.startsWith(option.route)
    );
    setSelectedOptionIndex(selectedOption);
  }, []);

  const handleOptionClick = (index: number, route: string) => {
    setSelectedOptionIndex(index);
    router.push(route);
  };

  const sidebarOptions = [
    { label: "Explore", icon: "/Compass.png", route: `/explore/${userDocId}` },
    { label: "Table", icon: "/Grid.png", route: `/table/${userDocId}` },
    {
      label: "Tasks & Feedback",
      icon: "/View Module.png",
      route: `/tasks/${userDocId}`,
    },
    { label: "Profile", icon: "/Profile.png", route: `/profile/${userDocId}` },
  ];

  return (
    <>
      <div className={styles.left_pane}>
        <div className={styles.left_pane_inside}>
          <div className={styles.pane_items}>
            <ul className={styles.ul_items}>
              {sidebarOptions.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.icons_items} ${
                    selectedOptionIndex === index
                      ? styles.selected_icons_items
                      : ""
                  }`}
                  onClick={() => handleOptionClick(index, option.route)}
                >
                  <Image
                    src={option.icon}
                    alt={option.label}
                    height={38}
                    width={38}
                    priority={true}
                  />
                  <li>{option.label}</li>
                </div>
              ))}
            </ul>
          </div>

          <div
            className={styles.btn_div}
            onClick={() => setOpnAddProjectModal(true)}
          >
            <button>Add</button>
          </div>
        </div>
      </div>

      <Modal
        setOpnAddProjectModal={setOpnAddProjectModal}
        opnAddProjectModal={opnAddProjectModal}
        opnEditProject={opnEditProject}
        setOpnEditProject={setOpnEditProject}
      />
    </>
  );
};

export default Sidebar;
