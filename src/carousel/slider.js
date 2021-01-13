export default async ({ get, blockL, left, right, row }) => {
  if (!document.querySelector(".section-dev")) return;
  const res = await fetch(get);
  const lengthCourse = await res.json();

  const block = document.getElementById(blockL);
  const cards = block.querySelectorAll(".section-dev-block");
  const bloing = block.querySelectorAll(".section-dev-img");
  let btnLeft = document.getElementById(left);
  let btnRight = document.getElementById(right);

  let size = Math.round(block.offsetWidth / row);

  cards.forEach((item) => (item.style.width = size + "px"));
  bloing.forEach((item) => (item.style.width = size + "px"));

  let base = 0;
  let step = cards[0].offsetWidth;
  let end = size * lengthCourse - row * step;

  const resize = () => {
    size = Math.round(block.offsetWidth / row);
    cards.forEach((item) => (item.style.width = size + "px"));
    bloing.forEach((item) => (item.style.width = size + "px"));
    base = 0;
    step = cards[0].offsetWidth;
    end = step * lengthCourse - row * step;
    block.scrollTo(0, 0);
  };
  window.addEventListener("resize", (e) => {
    resize();
    if (base == 0) {
      btnLeft.style.display = "none";
    }

    if (size * lengthCourse == size * row) {
      btnRight.style.display = "none";
    } else {
      btnRight.style.display = "block";
    }
  });

  if (base == 0) {
    btnLeft.style.display = "none";
  }

  if (size * lengthCourse == size * row) {
    btnRight.style.display = "none";
  }

  btnLeft.addEventListener("click", () => {
    base -= step;
    if (base <= 0) {
      block.scrollTo(base, 0);
      btnLeft.style.display = "none";
    } else {
      block.scrollTo(base, 0);
      btnRight.style.display = "block";
    }
  });

  btnRight.addEventListener("click", () => {
    base += step;

    if (base >= end) {
      block.scrollTo(base, 0);
      btnRight.style.display = "none";
    } else {
      block.scrollTo(base, 0);
      btnLeft.style.display = "block";
    }
  });
};
