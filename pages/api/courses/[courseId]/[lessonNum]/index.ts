import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { courseData, lessonData } from "@/data";
import { mongo, validator } from "@/data/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = await auth.getSession({ req, res });
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to interact with courses." });

  let courseId = req.query.courseId as string;
  try {
    courseId = mongo.checkId(courseId);
  } catch (e) {
    return res.status(400).json({ error: "Invalid course ID." });
  }

  let course;
  try {
    course = await courseData.getCourse(courseId);
  } catch (e) {
    return res.status(404).json({ error: "Course not found." });
  }

  let lessonNum = req.query.lessonNum as string;
  lessonNum = Number(lessonNum);
  try {
    lessonNum = validator.checkInt(lessonNum, "lessonNum");
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  let result;
  const method = req.method;
  switch (method) {
    // GET SINGLE LESSON
    case "GET":
      result = await lessonData.getLesson(course.lessons[lessonNum].toString());
      result.courseTitle = course.title;
      result.coursePicture = course.coursePicture;
      return res.status(200).json(result);

    // UPDATE LESSON
    case "POST":
      return res.status(500).json({ TODO: `IMPLEMENT ME` });

    // DELETE LESSON
    case "DELETE":
      return res.status(500).json({ TODO: `IMPLEMENT ME` });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
