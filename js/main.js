import { getScore } from "/Front-end-fastapi/js/main-api.js";

async function fetchScore() {
  try {
    const auth_token = JSON.parse(localStorage.getItem("Authentication"));
    const score = await getScore(auth_token);

    // console.log(score);

    if (
      typeof score.score !== "number" ||
      !localStorage.getItem("Authentication")
    ) {
      location.href = "/Front-end-fastapi/view/login.html";
    }
  } catch (error) {
    console.error("Error fetching score:", error);
    // location.href = "/Front-end-fastapi//view/test.html";
  }
}
fetchScore();
