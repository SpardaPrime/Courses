const carousel = async () => {
  if (!document.querySelector(".index-container-carts")) return;

  const coursesCount = async () => {
    const res = await fetch("/course");
    return await res.json();
  };
  const corseCount = await coursesCount();
  const block = document.querySelector(".index-container-carts");
  const countBlock = document.querySelector(".index-count-page");
  let blocHeight = block.scrollHeight;
  let step = blocHeight / corseCount.length;
  let index = 1;
  const maxIdnex = corseCount.length;
  countBlock.textContent = `${index}/${maxIdnex}`;

  const elements = document
    .querySelector(".index-container-carts")
    .querySelectorAll(".index-cart");
  elements.forEach((item) => item.classList.add("opacity0"));
  elements[0].classList.add("opacity1");

  let timer = setTimeout(function t() {
    dowm();
    timer = setTimeout(t, 3000);
  }, 3000);

  document
    .querySelector("#carousel-pause > i")
    .addEventListener("click", (e) => {
      clearTimeout(timer);
      document.querySelector("#carousel-pause").style.display = "none";
      document.querySelector("#carousel-play").style.display = "block";
    });

  document
    .querySelector("#carousel-play > i")
    .addEventListener("click", (e) => {
      timer = setTimeout(function t() {
        dowm();
        timer = setTimeout(t, 3000);
      }, 3000);
      document.querySelector("#carousel-play").style.display = "none";
      document.querySelector("#carousel-pause").style.display = "block";
    });

  const resize = () => {
    blocHeight = block.scrollHeight;
    step = Math.floor(blocHeight / corseCount.length);
    elements.forEach((item) => (item.style.height = step + "px"));
    elements[index - 1].classList.add("opacity1");

    block.scrollTo(0, (index - 1) * step);
    countBlock.textContent = `${index}/${maxIdnex}`;
  };

  window.addEventListener("resize", resize);

  const style = (index) => {
    elements.forEach((item) => item.classList.remove("opacity1"));
    elements[index - 1].classList.add("opacity1");
  };

  const up = () => {
    if (index === 1) {
      index = maxIdnex;
      countBlock.textContent = `${index}/${maxIdnex}`;
      style(index);
      block.scrollTo(0, step * index);
      return;
    }

    index--;
    countBlock.textContent = `${index}/${maxIdnex}`;
    style(index);
    block.scrollBy(0, -step);
  };
  const dowm = () => {
    if (index === maxIdnex) {
      index = 1;
      countBlock.textContent = `${index}/${maxIdnex}`;
      style(index);
      block.scrollTo(0, 0);
      return;
    }
    index++;
    countBlock.textContent = `${index}/${maxIdnex}`;
    style(index);
    block.scrollBy({ left: 0, top: step });
  };

  document.getElementById("carousel-btn-up").addEventListener("click", up);

  document.getElementById("carousel-btn-down").addEventListener("click", dowm);
};

export default carousel;
