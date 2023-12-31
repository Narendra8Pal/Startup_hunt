import Styles from "@/styles/showcase.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className={Styles.orange}>
        <div className={Styles.desc}>
          <p>Your project could turn out to be your next startup.</p>
          <div className={Styles.btn}>
            <button onClick={() => router.push("/auth")}>Sign Up</button>
          </div>
        </div>

        <img src="/Group 10.png" alt="group" className={Styles.vector} />
      </div>
    </>
  );
}
