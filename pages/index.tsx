import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import styles from "@/styles/index.module.scss";
import { Button, Image } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pageContainer">
        <div className={styles.header}>
          <Image src="/logo.png" />
          <h1>Course Horse</h1>
          <p>Your all-in-one online learning platform.</p>
        </div>
        <div className={styles.section}>
          <div>
            <h2>What is Course Horse?</h2>
            <div>
              <p>
                Course Horse is an online learning platform that connects
                learners to courses made by educators.
              </p>
              <p>
                Students can enroll in courses in a variety of topics, from
                burger flipping to multi-variable calculus.
              </p>
              <p>
                Start your learning journey today by creating an account today.
              </p>
            </div>
          </div>
          <div>
            <Image src="/logo.png" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
