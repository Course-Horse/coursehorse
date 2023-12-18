import { useRouter } from "next/router";
import Head from "next/head";
import { Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

import headerStyle from "@/styles/header.module.scss";
import styles from "@/styles/course.module.scss";
import NavBar from "@/components/navbar/navbar";

function LessonPreview({
  courseId,
  num,
  data,
}: {
  courseId: string;
  num: number;
  data: any;
}) {
  return (
    <div>
      <h3>
        Lesson {num}: {data.title}
      </h3>
      <p>{data.description}</p>
      <div>
        <Button href={`/courses/${courseId}/${num}`}>
          Go to Lesson Content
        </Button>
        {data.quiz !== null ? (
          <Button variant="secondary" href={`/courses/${courseId}/${num}/quiz`}>
            Go to Lesson Quiz
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default function Course({ username }: { username: any }) {
  const router = useRouter();
  const { courseId } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (courseId) {
      axios
        .get(`/api/courses/${courseId}`)
        .then((res) => {
          console.log(res);
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Course | Course Horse</title>
        <meta name="description" content="View a course on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <>
            <div className={headerStyle.header}>
              <img src={data.coursePicture} />
              <div>
                <h1>{data.title}</h1>
                <p>{data.description}</p>
              </div>
            </div>
            <div className={styles.lessonList}>
              <h2>Lessons</h2>
              <div>
                {data.lessons.map((lesson, index) => {
                  return (
                    <LessonPreview
                      key={index}
                      courseId={courseId}
                      num={index}
                      data={lesson}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

import auth from "@/auth/";

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
