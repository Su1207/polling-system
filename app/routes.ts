import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/teacher", "routes/createPoll.tsx"),
  route("/student", "routes/studentRegister.tsx"),
  route("/submitAnswer", "routes/submitAnswer.tsx"),
  route("/teacherPoll", "routes/teacherPoll.tsx"),
  route("/pastPollData", "routes/pastPollData.tsx"),
] satisfies RouteConfig;
