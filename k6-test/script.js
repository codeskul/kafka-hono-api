import http from "k6/http";
import { check, sleep } from "k6";
export const options = {
  vus: 500,
  duration: "30s",
};
export default function () {
  const res = http.post(
    "http://localhost:3000/create-post",
    JSON.stringify({
      title: "Test Post",
      content: "Test Content",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
  sleep(1);
}
