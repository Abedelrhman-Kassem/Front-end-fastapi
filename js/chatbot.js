const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
let learnNew = false;

const BOT_IMG = "/Front-end-fastapi/images/bot.png";
const PERSON_IMG = "/Front-end-fastapi/images/user.jpeg";
const BOT_NAME = "BOT";
let PERSON_NAME;

async function getusername(auth_token) {
  try {
    const response = await fetch(
      `https://backe-end-fastpi.onrender.com/get-user?auth_token=${auth_token}`
    );

    if (!response.ok) {
      const res = await response.text();
      const errorMessage = JSON.parse(res).detail;
      // localStorage.clear();
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    PERSON_NAME = responseData.name.split(" ")[0];
  } catch (error) {
    PERSON_NAME = "User";
    // location.href = "./login.html";
  }
}

const auth_token = JSON.parse(localStorage.getItem("Authentication"));
getusername(auth_token);

msgerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const msgText = msgerInput.value.trim();
  if (!msgText) return;

  if (learnNew) {
    const divs = document.getElementsByClassName("right-msg");
    const question =
      divs[divs.length - 1].lastElementChild.lastElementChild.innerText;

    await getBotMessages({ question, answer: msgText });
  } else {
    await getBotMessages({ question: msgText, answer: "" });
  }

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);

  msgerInput.value = "";
});

async function getBotMessages(data) {
  try {
    const response = await fetch(
      `https://backe-end-fastpi.onrender.com/chatbot`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const res = await response.text();
      const errorMessage = JSON.parse(res).detail;
      learnNew = true;
      throw new Error(errorMessage);
    }

    const responseData = await response.json();

    setTimeout(() => {
      appendMessage(BOT_NAME, BOT_IMG, "left", responseData);
    }, 900);

    learnNew = false;
  } catch (error) {
    setTimeout(() => {
      appendMessage(BOT_NAME, BOT_IMG, "left", error.message);
    }, 900);
  }
}

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}
