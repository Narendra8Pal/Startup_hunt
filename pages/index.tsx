import Styles from "@/styles/showcase.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className={Styles.orange}>
        <div>
          <Image
            src="/Group.svg"
            alt="logo"
            width={123}
            height={123}
            priority={true}
            className={Styles.vector}
            draggable={false}
          />
        </div>

        <div className={Styles.desc}>
          <h1 className={Styles.heading}>
            <span className={Styles.text_span}>Unlock</span>
            <span className={Styles.thin_span}>
              {" "}
              opportunities by sharing
            </span>{" "}
            <span className={Styles.text_span}>together</span>
          </h1>
          <p className={Styles.para}>
            We believe your project has the potential to become your next big
            startup adventure.
          </p>
          {/* <p>Your project could turn out to be your next startup.</p> */}

          <div className={Styles.btn_div} onClick={() => router.push("/auth")}>
            <button className={Styles.btn}>Sign Up</button>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="font-semibold">Scroll down for more</p>
        <div className="animate-bounce mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      <div className={Styles.features_bg}>
        <div className={Styles.feature_showcase}>
          <div className={Styles.explore_showcase}>
            <div className={Styles.img_text}>
              <div className={Styles.img_bg}>
                <div className={Styles.explore_img_div}>
                  <Image
                    alt="explore"
                    src="/Compass.png"
                    height={38}
                    width={38}
                    priority={true}
                    className={Styles.explore_img}
                  />
                </div>
              </div>

              <div className={Styles.box_txt}>
                <div className={Styles.feature_name}>Explore</div>
                <div>
                  Explore diverse projects, share them, comment, and engage with
                  owners. Share your opinions, offer insights, and receive
                  feedback for your own projects in return.
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.explore_showcase}>
            <div className={Styles.img_text}>
              <div className={Styles.img_bg}>
                <div className={Styles.explore_img_div}>
                  <Image
                    alt="table"
                    src="/Grid.png"
                    height={38}
                    width={38}
                    priority={true}
                  />
                </div>
              </div>

              <div className={Styles.box_txt}>
                <div className={Styles.feature_name}>Table</div>
                <div>
                  Effortlessly view all tasks in a streamlined table format,
                  making it easy to find and reply to new tasks. Quickly check
                  their creation dates for better organization and management.
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.explore_showcase}>
            <div className={Styles.img_text}>
              <div className={Styles.img_bg}>
                <div className={Styles.explore_img_div}>
                  <Image
                    alt="tasks"
                    src="/View Module.png"
                    height={38}
                    width={38}
                    priority={true}
                  />
                </div>
              </div>

              <div className={Styles.box_txt}>
                <div className={Styles.feature_name}>Tasks</div>
                <div>
                  Browse tasks created by builders, enhance productivity with
                  bricks, prioritize tasks with emojis, and blend tasks with
                  beautiful color views. Reply to each task to show every
                  opinion matters for their product&apos;s success.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={Styles.shot_show}>
        <div className={Styles.shot_show_inside}>
          <div className={Styles.shot_img_text}>
            <div className={Styles.shot_img_div}>
              {/* <img src="/tasks_feature1.png" className={Styles.img} /> */}
            </div>

            <div className={Styles.shot_text}>
              <div className={Styles.shot_head}>Add colors to tasks</div>
              Add vibrant colors, reply to and expand the bricks created inside
              tasks for a more engaging and interactive experience.Drag and drop
              to priortize your tasks with our own kanban board!.
            </div>
          </div>

          <div className={Styles.shot_img_text}>
            <div className={Styles.shot_text}>
              <div className={Styles.shot_head}>Create your projects</div>
              Create and edit your projects, easily add or remove images, and
              enjoy an exceptional design that helps you preview your images
              with ease.
            </div>
            <div className={Styles.shot_img_div}>
              {/* <img src="/profile_modal.png" className={Styles.img} /> */}
            </div>
          </div>

          <div className={Styles.shot_img_text}>
            <div className={Styles.shot_img_div}>
              {/* <img src="/share2.png" className={Styles.img} /> */}
            </div>

            <div className={Styles.shot_text}>
              <div className={Styles.shot_head}>Share your projects</div>
              Share your projects by copying the link to your clipboard or
              easily share them on platforms like X.
            </div>
          </div>
        </div>
      </div>

      <footer className={Styles.footer}>
        <div className={Styles.footer_inside}>
          <div>crafted by</div>{" "}
          <Link
            href="https://github.com/NarxPal"
            target="_blank"
            className={Styles.link}
          >
            {" "}
            Narendra Pal
          </Link>
        </div>
      </footer>
    </>
  );
}
