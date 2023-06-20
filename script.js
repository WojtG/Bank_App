"use strict";

// Data

const account1 = {
  owner: "John Stones",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-27T17:01:17.194Z",
    "2023-05-20T21:36:17.929Z",
    "2023-05-23T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pl-PL",
};

const account2 = {
  owner: "Anthony Da Silva",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2021-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2022-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "en-US",
};

const account3 = {
  owner: "Kevin De Bruyne",
  movements: [7000, 4100, -220, -530, -2910, -2000, 6500, -40],
  interestRate: 1.3,
  pin: 3333,

  movementsDates: [
    "2021-04-11T13:15:33.035Z",
    "2023-04-18T09:48:16.867Z",
    "2023-05-05T06:04:23.907Z",
    "2023-05-15T14:18:46.235Z",
    "2023-05-20T16:33:06.386Z",
    "2023-05-28T14:43:26.374Z",
    "2023-06-01T18:49:59.371Z",
    "2023-06-02T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "en-GB",
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const appNav = document.querySelector(".app__nav");

const allModals = document.querySelectorAll(".modal");
const modalSignUp = document.querySelector(".modal--sign-up");
const modalLogin = document.querySelector(".modal--login");
const overlay = document.querySelector(".overlay");
const btnsCloseModal = document.querySelectorAll(".btn--close-modal");
const btnsOpenModalSignUp = document.querySelectorAll(
  ".btn--show-modal-signup"
);
const btnOpenModalLogin = document.querySelector(".btn--show-modal-login");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");
const navlinksEl = document.querySelector(".nav__links");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const navEl = document.querySelector(".nav");
const headerEl = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");
const lazyImages = document.querySelectorAll("img[data-src]");
const btnLogin = document.querySelector(".login__btn");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const landingPage = document.querySelector(".landing-page");
const btnLogout = document.querySelector(".btn--logout");
const btnSignUp = document.querySelector(".btn--signup");
const inputsSignUpModal = document.querySelectorAll(".modal--sign-up input");

/////////////////////////////////////////////////

// Functions

const formatMovmentDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) {
    return "Today";
  }

  if (daysPassed === 1) {
    return "Yesterday";
  }

  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  }
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovmentDate(date, acc.locale);

    const formmatedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formmatedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formmatedBalance = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
  labelBalance.textContent = formmatedBalance;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);

  //Creates date
  const currDate = new Date();

  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(currDate);
};

const createAccount = function () {
  const variable = {
    accountNumber: {
      owner: `${firstName} ${lastName}`,
      movements: [],
      interestRate: 1.1,
      pin,
      movementsDates: [],
      currency: "EUR",
      locale: navigator.language,
    },
  };

  accounts.push(variable.accountNumber);
  createUsernames(accounts);
};

const LogginOut = function () {
  containerApp.classList.add("hidden");
  btnLogout.classList.add("hidden");
  labelWelcome.classList.add("hidden");
  labelWelcome.textContent = "";
  landingPage.classList.remove("hidden");
  appNav.style.padding = "0";
  currentAccount = "";
};

const startLogOutTimer = function () {
  const tick = function () {
    const minutes = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const seconds = `${Math.trunc(time % 60)}`.padStart(2, 0);

    //print the remaining time to user interface
    labelTimer.textContent = `${minutes}:${seconds}`;

    //when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      LogginOut();
    }

    time--;
  };

  //set the timer to 2 minutes
  let time = 120;

  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//handling modals

//TODO: change the logic of opening and closing modals
const openModal = function (e) {
  e.preventDefault();
  this.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  overlay.classList.add("hidden");
  allModals.forEach((modal) => modal.classList.add("hidden"));
};

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const links = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    links.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

//sticky nav effect

const stickyNav = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) navEl.classList.add("sticky");
  else navEl.classList.remove("sticky");
};

//
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${getComputedStyle(navEl).height}`,
});

headerObserver.observe(headerEl);

//revealing sections

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy loading Images

const replaceImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function (e) {
    this.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(replaceImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

lazyImages.forEach((img) => imgObserver.observe(img));

//cookie message component

const message = document.createElement("div");
message.classList.add("cookie-message");

message.innerHTML =
  '<p>We use technical and analytics cookies to ensure that we give you the best experience on our website</p> <button class="btn btn--close-cookie "> Got it! </button>';

document.querySelector(".header").append(message);

///////////////////////////////////////
// Event handlers

let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }!`;
    labelWelcome.classList.remove("hidden");
    btnLogout.classList.remove("hidden");
    appNav.style.padding = "2em";
    containerApp.classList.remove("hidden");
    landingPage.classList.add("hidden");
    modalLogin.classList.add("hidden");
    overlay.classList.add("hidden");
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // check if timer exist
    if (timer) {
      clearInterval(timer);
    }
    //start the timer
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  // const amount = Number(inputLoanAmount.value);

  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2000);

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    inputLoanAmount.value = "";
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    LogginOut();
  }

  //reset input fields
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

btnSignUp.addEventListener("click", function (e) {
  e.preventDefault();
  const accountNumber = `account${accounts.length + 1}`;
  const firstName = document.getElementById("fname").value;
  const lastName = document.getElementById("sname").value;
  const pin = +document.getElementById("password-signup").value;
  const confirmPin = +document.getElementById("password-confirm").value;
  //creating new account
  if (confirmPin === pin) {
    const variable = {
      accountNumber: {
        owner: `${firstName} ${lastName}`,
        movements: [],
        interestRate: 1.1,
        pin,
        movementsDates: [],
        currency: "EUR",
        locale: navigator.language,
      },
    };
    accounts.push(variable.accountNumber);
    createUsernames(accounts);
    closeModal();
    inputsSignUpModal.forEach((input) => (input.value = ""));
  }
});

btnLogout.addEventListener("click", LogginOut);

btnsOpenModalSignUp.forEach((btn) =>
  btn.addEventListener("click", openModal.bind(modalSignUp))
);

btnOpenModalLogin.addEventListener("click", openModal.bind(modalLogin));

btnsCloseModal.forEach((btn) => btn.addEventListener("click", closeModal));

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    //TODO: add more specific condition
    closeModal();
  }
});

//"Learn more" btn with smooth scrolling

btnScrollTo.addEventListener("click", function () {
  // window.scrollTo({
  //   top: section1.getBoundingClientRect().top + window.pageYOffset,
  //   left: section1.getBoundingClientRect().left + window.pageXOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: "smooth" });
});

//Page navigation

navlinksEl.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains("nav__link") &&
    e.target.getAttribute("href") !== "#"
  ) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//Tabbed component

tabsContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const btnClicked = e.target.closest(".operations__tab");

  if (!btnClicked) return;

  //tabs

  tabs.forEach((tab) => {
    tab.classList.remove("operations__tab--active");
  });

  btnClicked.classList.add("operations__tab--active");

  const contentEl = document.querySelector(
    `.operations__content--${btnClicked.dataset.tab}`
  );

  // tabs content

  tabsContent.forEach((contentDiv) => {
    contentDiv.classList.remove("operations__content--active");
  });

  contentEl.classList.add("operations__content--active");
});

//Menu fade animation

// navEl.addEventListener('mouseover', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const links = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     links.forEach(link => (link.style.opacity = '0.5'));
//     logo.style.opacity = '0.5';
//     link.style.opacity = '1';
//   }
// });

// navEl.addEventListener('mouseout', function (e) {
//   const link = e.target;
//   const links = link.closest('.nav').querySelectorAll('.nav__link');
//   links.forEach(link => (link.style.opacity = '1'));
//   logo.style.opacity = '1';
// });

navEl.addEventListener("mouseover", handleHover.bind("0.5"));

navEl.addEventListener("mouseout", handleHover.bind("1"));

//Slider

const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnSlideLeft = document.querySelector(".slider__btn--left");
  const btnSlideRight = document.querySelector(".slider__btn--right");
  const dotsContainer = document.querySelector(".dots");

  let currSlide = 0;
  const maxSlide = slides.length;

  //functions

  const createDots = function () {
    slides.forEach((_, i) => {
      const htmlTemplate = `<button class="dots__dot" data-slide="${i}"></button>`;
      dotsContainer.insertAdjacentHTML("beforeend", htmlTemplate);
    });
  };

  const activateDot = function (slide) {
    dotsContainer
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  //sliding logic
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const previousSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  //event handlers

  const initialization = function () {
    goToSlide(0); //slides will line up next to each other when the page is loaded
    createDots(); //dot btns will be created when the page is loaded
    activateDot(0);
  };

  btnSlideRight.addEventListener("click", nextSlide);
  btnSlideLeft.addEventListener("click", previousSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") previousSlide();
    else if (e.key === "ArrowRight") nextSlide();
  });

  dotsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      currSlide = +e.target.dataset.slide;
      goToSlide(currSlide);
      activateDot(currSlide);
    }
  });

  initialization();
};
slider();

document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
  });
