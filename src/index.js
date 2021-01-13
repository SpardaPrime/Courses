import app from "./app/app";
import carousel from "./carousel/carousel";
import slider from "./carousel/slider";

let blockDev = {
  get: "/sectionDev",
  blockL: "section-dev-id",
  left: "dev-left-btn",
  right: "dev-right-btn",
  row: 3,
};

let blockBusiness = {
  get: "/sectionBus",
  blockL: "section-Business",
  left: "busi-left-btn",
  right: "busi-right-btn",
  row: 3,
};
let blockDesign = {
  get: "/sectionDesign",
  blockL: "section-design",
  left: "design-left-btn",
  right: "design-right-btn",
  row: 3,
};
let blockMusic = {
  get: "/sectionMusic",
  blockL: "section-music",
  left: "music-left-btn",
  right: "music-right-btn",
  row: 3,
};

let blockLatest = {
  get: "/latestAded",
  blockL: "section-latest",
  left: "latest-left-btn",
  right: "latest-right-btn",
  row: 3,
};
if (document.getElementById("footer")) {
  if (document.getElementById("my-account")) {
    document.getElementById("footer").classList.add("down");
  }
  document.documentElement.clientHeight ===
    document.documentElement.scrollHeight &&
    document.getElementById("footer").classList.add("down");
}

if (document.getElementById("catalog-noauth")) {
  document.addEventListener("click", (e) => {
    let targ = e.target.closest("#catalog-noauth");
    if (!targ) {
      document.getElementById("catalog-noauth-div").style.display = "none";
      return;
    }
    document.getElementById("catalog-noauth-div").style.display = "block";
  });

  document
    .getElementById("btn-navbar-mobile")
    .addEventListener("click", function () {
      document
        .getElementById("navbar-mobile")
        .classList.toggle("navbar-mobile-open");
    });
}

app();
carousel();
slider(blockDev);
slider(blockBusiness);
slider(blockDesign);
slider(blockMusic);
slider(blockLatest);
