// ============================================================
// BLOODAID - COMPLETE FRONTEND JAVASCRIPT
// Spring Boot Backend + Profile Dashboard
// ============================================================

const API_BASE_URL = "/api";


// ============================================================
// DOM READY
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // ELEMENTS
    // ========================================================

    // ---------------- MOBILE ----------------

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");

    const mobileProfileLink =
        document.getElementById("mobileProfileLink");


    // ---------------- AUTH ----------------

    const loginBtn =
        document.getElementById("loginBtn");

    const loginModal =
        document.getElementById("loginModal");

    const closeLoginModal =
        document.getElementById("closeLoginModal");

    const loginSection =
        document.getElementById("loginSection");

    const signupSection =
        document.getElementById("signupSection");

    const showSignupBtn =
        document.getElementById("showSignupBtn");

    const showLoginBtn =
        document.getElementById("showLoginBtn");

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");


    // ---------------- PROFILE ----------------

    const profileModal =
        document.getElementById("profileModal");

    const closeProfileModal =
        document.getElementById("closeProfileModal");

    const profileAvatar =
        document.getElementById("profileAvatar");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profilePhone =
        document.getElementById("profilePhone");

    const profileBloodGroup =
        document.getElementById("profileBloodGroup");

    const profileCity =
        document.getElementById("profileCity");

    const profileAge =
        document.getElementById("profileAge");

    const profileLogoutBtn =
        document.getElementById("profileLogoutBtn");


    // ---------------- PROFILE DASHBOARD ----------------

    const needBloodBtn =
        document.getElementById("needBloodBtn");

    const myRequestBtn =
        document.getElementById("myRequestBtn");

    const myResponsesBtn =
        document.getElementById("myResponsesBtn");

    const findDonorFromProfile =
        document.getElementById("findDonorFromProfile");

    const myRequestSummary =
        document.getElementById("myRequestSummary");

    const responseCountText =
        document.getElementById("responseCountText");


    // ---------------- BLOOD REQUEST ----------------

    const bloodRequestModal =
        document.getElementById("bloodRequestModal");

    const closeBloodRequestModal =
        document.getElementById("closeBloodRequestModal");

    const bloodRequestForm =
        document.getElementById("bloodRequestForm");


    // ---------------- MY REQUEST ----------------

    const myRequestModal =
        document.getElementById("myRequestModal");

    const closeMyRequestModal =
        document.getElementById("closeMyRequestModal");

    const myRequestDetails =
        document.getElementById("myRequestDetails");


    // ---------------- DONOR RESPONSES ----------------

    const myResponsesModal =
        document.getElementById("myResponsesModal");

    const closeMyResponsesModal =
        document.getElementById("closeMyResponsesModal");

    const profileResponsesList =
        document.getElementById("profileResponsesList");


    // ---------------- SEARCH ----------------

    const searchBloodBtn =
        document.getElementById("searchBloodBtn");

    const searchResults =
        document.getElementById("searchResults");


    // ---------------- DONOR ----------------

    const donorForm =
        document.getElementById("donorForm");


    // ---------------- TOAST ----------------

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");

    const closeToast =
        document.getElementById("closeToast");


    // ---------------- REQUESTS ----------------

    const viewAllRequests =
        document.getElementById("viewAllRequests");


    // ========================================================
    // TOAST
    // ========================================================

    let toastTimer = null;


    function showToast(title, message) {

        if (!toast) {

            alert(`${title}\n${message}`);

            return;
        }


        if (toastTitle) {

            toastTitle.textContent = title;
        }


        if (toastMessage) {

            toastMessage.textContent = message;
        }


        toast.classList.add("show");


        clearTimeout(toastTimer);


        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 4000);
    }


    // ========================================================
    // RESPONSE DATA
    // ========================================================

    async function getResponseData(response) {

        const contentType =
            response.headers.get("content-type") || "";


        if (
            contentType.includes("application/json")
        ) {

            return await response
                .json()
                .catch(() => null);
        }


        return await response
            .text()
            .catch(() => "");
    }


    // ========================================================
    // ERROR MESSAGE
    // ========================================================

    function getErrorMessage(result, fallback) {

        if (!result) {

            return fallback;
        }


        if (
            typeof result === "string" &&
            result.trim()
        ) {

            return result;
        }


        if (result.message) {

            return result.message;
        }


        if (result.error) {

            return result.error;
        }


        return fallback;
    }


    // ========================================================
    // ESCAPE HTML
    // ========================================================

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";
        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ========================================================
    // GET LOGGED IN USER
    // ========================================================

    function getLoggedInUser() {

        const storedUser =
            localStorage.getItem("bloodaidUser");


        if (!storedUser) {

            return null;
        }


        try {

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Invalid stored BloodAid user:",
                error
            );


            localStorage.removeItem(
                "bloodaidUser"
            );


            return null;
        }
    }


    // ========================================================
    // CLOSE LOGIN MODAL
    // ========================================================

    function closeLogin() {

        if (!loginModal) {

            return;
        }


        loginModal.classList.remove("active");

        loginModal.classList.remove("show");

        document.body.classList.remove(
            "modal-open"
        );


        setTimeout(() => {

            loginModal.style.display = "";

        }, 250);
    }


    // ========================================================
    // OPEN LOGIN MODAL
    // ========================================================

    function openLogin() {

        if (!loginModal) {

            return;
        }


        if (loginSection) {

            loginSection.style.display =
                "block";
        }


        if (signupSection) {

            signupSection.style.display =
                "none";
        }


        loginModal.style.display =
            "flex";


        document.body.classList.add(
            "modal-open"
        );


        requestAnimationFrame(() => {

            loginModal.classList.add(
                "active"
            );

        });
    }


    // ========================================================
    // PROFILE STORAGE
    // ========================================================

    function getBloodRequest() {

        const user =
            getLoggedInUser();


        if (!user || !user.email) {

            return null;
        }


        const key =
            `bloodaidBloodRequest_${user.email}`;


        const saved =
            localStorage.getItem(key);


        if (!saved) {

            return null;
        }


        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Invalid blood request:",
                error
            );


            localStorage.removeItem(key);

            return null;
        }
    }


    function saveBloodRequest(request) {

        const user =
            getLoggedInUser();


        if (!user || !user.email) {

            return;
        }


        const key =
            `bloodaidBloodRequest_${user.email}`;


        localStorage.setItem(
            key,
            JSON.stringify(request)
        );
    }


    function getDonorResponses() {

        const user =
            getLoggedInUser();


        if (!user || !user.email) {

            return [];
        }


        const key =
            `bloodaidResponses_${user.email}`;


        const saved =
            localStorage.getItem(key);


        if (!saved) {

            return [];
        }


        try {

            const data =
                JSON.parse(saved);


            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(
                "Invalid donor responses:",
                error
            );


            localStorage.removeItem(key);

            return [];
        }
    }


    function saveDonorResponse(donor) {

        const user =
            getLoggedInUser();


        if (!user || !user.email) {

            return false;
        }


        const key =
            `bloodaidResponses_${user.email}`;


        const responses =
            getDonorResponses();


        const alreadyExists =
            responses.some(response => {

                return (
                    response.phone === donor.phone &&
                    response.name === donor.name
                );

            });


        if (alreadyExists) {

            return false;
        }


        responses.unshift({

            name:
                donor.name || "Donor",

            phone:
                donor.phone || "",

            bloodGroup:
                donor.bloodGroup || "-",

            city:
                donor.city || "-",

            age:
                donor.age || "-",

            status:
                "Response Sent",

            date:
                new Date().toLocaleString(
                    "en-IN"
                )

        });


        localStorage.setItem(
            key,
            JSON.stringify(responses)
        );


        return true;
    }


    // ========================================================
    // PROFILE SUMMARY
    // ========================================================

    async function fetchMyBloodRequests() {
        const user = getLoggedInUser();
        if (!user || !user.id) return [];

        const response = await fetch(
            `${API_BASE_URL}/requests/user/${encodeURIComponent(user.id)}`,
            { headers: { "Accept": "application/json" } }
        );
        const result = await getResponseData(response);
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Could not load your blood requests."));
        }
        if (Array.isArray(result)) return result;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    async function fetchMyRequestResponses() {
        const user = getLoggedInUser();
        if (!user || !user.id) return [];

        const response = await fetch(
            `${API_BASE_URL}/requests/responses/user/${encodeURIComponent(user.id)}`,
            { headers: { "Accept": "application/json" } }
        );
        const result = await getResponseData(response);
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Could not load your sent responses."));
        }
        if (Array.isArray(result)) return result;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    async function fetchResponsesForRequest(requestId) {
        const response = await fetch(
            `${API_BASE_URL}/requests/${encodeURIComponent(requestId)}/responses`,
            { headers: { "Accept": "application/json" } }
        );
        const result = await getResponseData(response);
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Could not load responses for this request."));
        }
        if (Array.isArray(result)) return result;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    async function updateProfileSummary() {
        const user = getLoggedInUser();
        if (myRequestSummary) myRequestSummary.textContent = "Loading requests...";
        if (responseCountText) responseCountText.textContent = "Loading responses...";

        if (!user || !user.id) {
            if (myRequestSummary) myRequestSummary.textContent = "No active request";
            if (responseCountText) responseCountText.textContent = "No responses yet";
            return;
        }

        try {
            const requests = await fetchMyBloodRequests();
            if (myRequestSummary) {
                if (!requests.length) {
                    myRequestSummary.textContent = "No active request";
                } else if (requests.length === 1) {
                    myRequestSummary.textContent = `${requests[0].bloodGroup || "Blood"} • ${requests[0].city || "Location"}`;
                } else {
                    const latest = requests[0];
                    myRequestSummary.textContent = `${requests.length} blood requests • Latest: ${latest.bloodGroup || "Blood"} • ${latest.city || "Location"}`;
                }
            }
        } catch (error) {
            console.error("Load profile blood requests error:", error);
            if (myRequestSummary) myRequestSummary.textContent = "Unable to load requests";
        }

        try {
            const responses = await fetchMyRequestResponses();
            if (responseCountText) {
                responseCountText.textContent = responses.length === 0
                    ? "No responses yet"
                    : `${responses.length} response${responses.length === 1 ? "" : "s"} sent`;
            }
        } catch (error) {
            console.error("Load profile response count error:", error);
            if (responseCountText) responseCountText.textContent = "Unable to load responses";
        }
    }


    // ========================================================
    // OPEN PROFILE
    // ========================================================

    function openProfile() {

        const user =
            getLoggedInUser();


        if (!user) {

            showToast(
                "Login Required",
                "Please login to view your profile."
            );


            openLogin();

            return;
        }


        const name =
            user.name || "User";

        const email =
            user.email || "-";

        const phone =
            user.phone || "-";

        const bloodGroup =
            user.bloodGroup || "-";

        const city =
            user.city || "-";

        const age =
            user.age !== undefined &&
            user.age !== null
                ? user.age
                : "-";


        if (profileName) {

            profileName.textContent =
                name;
        }


        if (profileEmail) {

            profileEmail.textContent =
                email;
        }


        if (profilePhone) {

            profilePhone.textContent =
                phone;
        }


        if (profileBloodGroup) {

            profileBloodGroup.textContent =
                bloodGroup;
        }


        if (profileCity) {

            profileCity.textContent =
                city;
        }


        if (profileAge) {

            profileAge.textContent =
                age;
        }


        if (profileAvatar) {

            profileAvatar.textContent =
                name
                    .trim()
                    .charAt(0)
                    .toUpperCase() || "U";
        }


        updateProfileSummary();


        if (profileModal) {

            profileModal.style.display =
                "flex";


            document.body.classList.add(
                "modal-open"
            );


            requestAnimationFrame(() => {

                profileModal.classList.add(
                    "active"
                );

            });
        }
    }


    // ========================================================
    // CLOSE PROFILE
    // ========================================================

    function closeProfile() {

        if (!profileModal) {

            return;
        }


        profileModal.classList.remove(
            "active"
        );


        document.body.classList.remove(
            "modal-open"
        );


        setTimeout(() => {

            profileModal.style.display = "";

        }, 250);
    }


    // ========================================================
    // UPDATE LOGIN BUTTON
    // ========================================================

    function updateLoginButton() {
        const user = getLoggedInUser();

        if (loginBtn) {
            loginBtn.innerHTML = user
                ? `<i class="fa-regular fa-user" aria-hidden="true"></i> My Profile`
                : `<i class="fa-regular fa-user" aria-hidden="true"></i> Login`;
        }

        if (mobileProfileLink) {
            const icon = user ? "fa-user" : "fa-right-to-bracket";
            const label = user ? "My Profile" : "Login";
            mobileProfileLink.innerHTML = `
                <i class="fa-regular ${icon}" aria-hidden="true"></i>
                <span>${label}</span>
            `;
            mobileProfileLink.setAttribute(
                "aria-label",
                user ? "Open My Profile" : "Login to BloodAid"
            );
        }
    }


    // ========================================================
    // MOBILE MENU
    // ========================================================

    if (menuToggle && navMenu) {

        menuToggle.addEventListener(
            "click",
            () => {

                navMenu.classList.toggle(
                    "active"
                );


                menuToggle.classList.toggle(
                    "active"
                );
                menuToggle.setAttribute(
                    "aria-expanded",
                    navMenu.classList.contains("active") ? "true" : "false"
                );

            }
        );


        navMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navMenu.classList.remove(
                            "active"
                        );


                        menuToggle.classList.remove(
                            "active"
                        );
                        menuToggle.setAttribute("aria-expanded", "false");

                    }
                );

            });
    }


    // Mobile Login / My Profile shortcut.
    if (mobileProfileLink) {
        mobileProfileLink.addEventListener("click", event => {
            event.preventDefault();

            if (navMenu) navMenu.classList.remove("active");
            if (menuToggle) {
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }

            if (getLoggedInUser()) {
                openProfile();
            } else {
                openLogin();
            }
        });
    }

    if (menuToggle) {
        menuToggle.setAttribute(
            "aria-expanded",
            navMenu?.classList.contains("active") ? "true" : "false"
        );
    }

    // ========================================================
    // ACTIVE NAVIGATION
    // ========================================================

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    const navItems =
        document.querySelectorAll(
            ".nav-menu a"
        );


    function updateActiveNav() {

        let currentSection = "";


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 160;


            if (
                window.scrollY >=
                sectionTop
            ) {

                currentSection =
                    section.getAttribute(
                        "id"
                    );
            }
        });


        navItems.forEach(item => {

            item.classList.remove(
                "active"
            );


            const href =
                item.getAttribute(
                    "href"
                );


            if (
                href ===
                `#${currentSection}`
            ) {

                item.classList.add(
                    "active"
                );
            }
        });
    }


    window.addEventListener(
        "scroll",
        updateActiveNav
    );


    updateActiveNav();


    // ========================================================
    // COUNTERS
    // ========================================================

    const counters =
        document.querySelectorAll(
            ".counter"
        );


    if (counters.length > 0) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;
                            }


                            const counter =
                                entry.target;


                            const target =
                                parseInt(
                                    counter.dataset.target ||
                                    "0",
                                    10
                                );


                            let current = 0;


                            const increment =
                                Math.max(
                                    1,
                                    Math.ceil(
                                        target / 80
                                    )
                                );


                            const timer =
                                setInterval(
                                    () => {

                                        current +=
                                            increment;


                                        if (
                                            current >=
                                            target
                                        ) {

                                            current =
                                                target;


                                            clearInterval(
                                                timer
                                            );
                                        }


                                        counter.textContent =
                                            current.toLocaleString();

                                    },
                                    25
                                );


                            observer.unobserve(
                                counter
                            );

                        }
                    );

                },
                {
                    threshold: 0.5
                }
            );


        counters.forEach(
            counter => {

                observer.observe(
                    counter
                );

            }
        );
    }


    // ========================================================
    // LOGIN / PROFILE BUTTON
    // ========================================================

    if (loginBtn) {

        loginBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const user =
                    getLoggedInUser();


                if (user) {

                    openProfile();

                } else {

                    openLogin();
                }

            }
        );
    }


    // ========================================================
    // CLOSE LOGIN
    // ========================================================

    if (closeLoginModal) {

        closeLoginModal.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeLogin();

            }
        );
    }


    // ========================================================
    // CLICK OUTSIDE LOGIN
    // ========================================================

    if (loginModal) {

        loginModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    loginModal
                ) {

                    closeLogin();
                }

            }
        );
    }


    // ========================================================
    // LOGIN -> SIGNUP
    // ========================================================

    if (showSignupBtn) {

        showSignupBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (loginSection) {

                    loginSection.style.display =
                        "none";
                }


                if (signupSection) {

                    signupSection.style.display =
                        "block";
                }

            }
        );
    }


    // ========================================================
    // SIGNUP -> LOGIN
    // ========================================================

    if (showLoginBtn) {

        showLoginBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (signupSection) {

                    signupSection.style.display =
                        "none";
                }


                if (loginSection) {

                    loginSection.style.display =
                        "block";
                }

            }
        );
    }


    // ========================================================
    // SIGNUP
    // ========================================================

    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const name =
                    document
                        .getElementById(
                            "signupName"
                        )
                        ?.value
                        .trim();


                const email =
                    document
                        .getElementById(
                            "signupEmail"
                        )
                        ?.value
                        .trim()
                        .toLowerCase();


                const phone =
                    document
                        .getElementById(
                            "signupPhone"
                        )
                        ?.value
                        .trim();


                const password =
                    document
                        .getElementById(
                            "signupPassword"
                        )
                        ?.value;


                const city =
                    document
                        .getElementById(
                            "signupCity"
                        )
                        ?.value
                        .trim();


                const age =
                    document
                        .getElementById(
                            "signupAge"
                        )
                        ?.value;


                const bloodGroup =
                    document
                        .getElementById(
                            "signupBloodGroup"
                        )
                        ?.value;


                if (
                    !name ||
                    !email ||
                    !phone ||
                    !password ||
                    !city ||
                    !age ||
                    !bloodGroup
                ) {

                    showToast(
                        "Missing Details",
                        "Please fill in all signup fields."
                    );


                    return;
                }


                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(email)
                ) {

                    showToast(
                        "Invalid Email",
                        "Please enter a valid email address."
                    );


                    return;
                }


                const ageNumber =
                    parseInt(
                        age,
                        10
                    );


                if (
                    ageNumber < 18 ||
                    ageNumber > 65
                ) {

                    showToast(
                        "Invalid Age",
                        "Age must be between 18 and 65."
                    );


                    return;
                }


                if (
                    !/^\d{10}$/.test(phone)
                ) {

                    showToast(
                        "Invalid Phone",
                        "Please enter a valid 10-digit mobile number."
                    );


                    return;
                }


                if (
                    password.length < 6
                ) {

                    showToast(
                        "Weak Password",
                        "Password must contain at least 6 characters."
                    );


                    return;
                }


                const signupData = {

                    name:
                        name,

                    email:
                        email,

                    phone:
                        phone,

                    password:
                        password,

                    city:
                        city,

                    bloodGroup:
                        bloodGroup,

                    age:
                        ageNumber
                };


                try {

                    const response =
                        await fetch(
                            `${API_BASE_URL}/auth/signup`,
                            {

                                method:
                                    "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        signupData
                                    )
                            }
                        );


                    const result =
                        await getResponseData(
                            response
                        );


                    if (!response.ok) {

                        showToast(
                            "Signup Failed",
                            getErrorMessage(
                                result,
                                "Unable to create your account."
                            )
                        );


                        return;
                    }


                    showToast(
                        "Signup Successful",
                        "Account created successfully. Please login."
                    );


                    signupForm.reset();


                    if (signupSection) {

                        signupSection.style.display =
                            "none";
                    }


                    if (loginSection) {

                        loginSection.style.display =
                            "block";
                    }

                } catch (error) {

                    console.error(
                        "Signup Error:",
                        error
                    );


                    showToast(
                        "Server Error",
                        "Unable to connect to BloodAid backend. Make sure Spring Boot is running."
                    );
                }
            }
        );
    }


    // ========================================================
    // LOGIN
    // ========================================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const email =
                    document
                        .getElementById(
                            "loginEmail"
                        )
                        ?.value
                        .trim()
                        .toLowerCase();


                const password =
                    document
                        .getElementById(
                            "loginPassword"
                        )
                        ?.value;


                if (!email || !password) {

                    showToast(
                        "Missing Details",
                        "Please enter your email and password."
                    );


                    return;
                }


                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(email)
                ) {

                    showToast(
                        "Invalid Email",
                        "Please enter a valid email address."
                    );


                    return;
                }


                try {

                    const response =
                        await fetch(
                            `${API_BASE_URL}/auth/login`,
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        email:
                                            email,

                                        password:
                                            password
                                    })
                            }
                        );


                    const result =
                        await getResponseData(
                            response
                        );


                    console.log(
                        "Login Status:",
                        response.status
                    );


                    console.log(
                        "Login Response:",
                        result
                    );


                    if (!response.ok) {

                        showToast(
                            "Login Failed",
                            getErrorMessage(
                                result,
                                "Invalid email or password."
                            )
                        );


                        return;
                    }


                    if (
                        !result ||
                        typeof result !==
                            "object"
                    ) {

                        showToast(
                            "Login Failed",
                            "Invalid response received from server."
                        );


                        return;
                    }


                    localStorage.setItem(
                        "bloodaidUser",
                        JSON.stringify(
                            result
                        )
                    );


                    updateLoginButton();

                    // Re-render request ownership immediately after login.
                    // Without this, buttons can show the previous account's state
                    // until the user refreshes the page.
                    renderBloodRequests();

                    showToast(
                        "Login Successful",
                        `Welcome back, ${result.name || "User"}!`
                    );


                    loginForm.reset();


                    setTimeout(
                        () => {

                            closeLogin();

                        },
                        1200
                    );

                } catch (error) {

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );


                    showToast(
                        "Server Error",
                        "Unable to connect to BloodAid backend. Make sure Spring Boot is running on port 8080."
                    );
                }
            }
        );
    }


    // ========================================================
    // PROFILE CLOSE
    // ========================================================

    if (closeProfileModal) {

        closeProfileModal.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeProfile();

            }
        );
    }


    // ========================================================
    // CLICK OUTSIDE PROFILE
    // ========================================================

    if (profileModal) {

        profileModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    profileModal
                ) {

                    closeProfile();
                }

            }
        );
    }


    // ========================================================
    // PROFILE LOGOUT
    // ========================================================

    if (profileLogoutBtn) {

        profileLogoutBtn.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "bloodaidUser"
                );


                updateLoginButton();

                // Update Respond / Your Request buttons immediately on logout.
                renderBloodRequests();

                closeProfile();

                showToast(
                    "Logged Out",
                    "You have been successfully logged out."
                );

            }
        );
    }


    // ========================================================
    // GLOBAL LOGOUT FUNCTION
    // ========================================================

    window.logoutBloodAid =
        function () {

            localStorage.removeItem(
                "bloodaidUser"
            );


            updateLoginButton();

            // Update request buttons immediately when global logout is used.
            renderBloodRequests();

            closeProfile();

            showToast(
                "Logged Out",
                "You have been successfully logged out."
            );

        };

            // ========================================================
    // BLOOD REQUEST MODAL
    // ========================================================

    function openBloodRequestModal() {

        const user =
            getLoggedInUser();


        if (!user) {

            showToast(
                "Login Required",
                "Please login first to create a blood request."
            );


            closeProfile();
            openLogin();

            return;
        }


        if (bloodRequestModal) {

            bloodRequestModal.style.display =
                "flex";


            document.body.classList.add(
                "modal-open"
            );


            requestAnimationFrame(() => {

                bloodRequestModal.classList.add(
                    "active"
                );

            });
        }
    }


    function closeBloodRequest() {

        if (!bloodRequestModal) {

            return;
        }


        bloodRequestModal.classList.remove(
            "active"
        );


        setTimeout(() => {

            bloodRequestModal.style.display =
                "";

        }, 250);


        document.body.classList.remove(
            "modal-open"
        );
    }


    // ========================================================
    // OPEN MY REQUEST
    // ========================================================

    async function openMyRequest() {
        const user = getLoggedInUser();
        if (!user || !user.id) {
            showToast("Login Required", "Please login to view your blood requests.");
            openLogin();
            return;
        }
        if (!myRequestModal || !myRequestDetails) return;

        myRequestModal.style.display = "flex";
        document.body.classList.add("modal-open");
        requestAnimationFrame(() => myRequestModal.classList.add("active"));
        myRequestDetails.innerHTML = `
            <div class="my-request-card empty">
                <div class="empty-icon"><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i></div>
                <h3>Loading your blood requests...</h3>
                <p>Fetching requests and donor responses from the database.</p>
            </div>`;

        try {
            const requests = await fetchMyBloodRequests();
            if (!requests.length) {
                myRequestDetails.innerHTML = `
                    <div class="my-request-card empty">
                        <div class="empty-icon">🩸</div>
                        <h3>No Blood Requests</h3>
                        <p>You have not created a blood request yet.</p>
                        <button type="button" class="btn btn-primary" id="createRequestFromEmpty">Create Blood Request</button>
                    </div>`;
                document.getElementById("createRequestFromEmpty")?.addEventListener("click", () => {
                    closeMyRequest();
                    openBloodRequestModal();
                });
                return;
            }

            const requestCards = await Promise.all(requests.map(async request => {
                const requestId = request.id;
                let responses = [];
                let responseLoadError = false;
                try {
                    responses = await fetchResponsesForRequest(requestId);
                } catch (error) {
                    responseLoadError = true;
                    console.error(`Could not load responses for request ${requestId}:`, error);
                }

                const createdAt = request.createdAt || request.created_at;
                const createdText = createdAt ? new Date(createdAt).toLocaleString("en-IN") : "—";
                const requiredDate = request.requiredDate || request.required_date || "—";
                const responseMarkup = responseLoadError
                    ? `<p class="request-message">Could not load donor responses. Please close and reopen this section to retry.</p>`
                    : responses.length
                        ? `<div class="request-message"><strong>Donor Responses (${responses.length})</strong><div class="request-response-list">${responses.map(response => {
                            const responseDate = response.createdAt || response.created_at;
                            const responseDateText = responseDate ? new Date(responseDate).toLocaleString("en-IN") : "";
                            return `<div class="request-response-item" style="padding:10px 0;border-top:1px solid #eee;">
                                <strong>${escapeHTML(response.donorName || response.donor_name || "Donor")}</strong>
                                <span style="margin-left:8px;">${escapeHTML(response.status || "Interested")}</span>
                                <div>${escapeHTML(response.bloodGroup || response.blood_group || "Blood group not provided")} · ${escapeHTML(response.city || "City not provided")}${response.phone ? ` · ${escapeHTML(response.phone)}` : ""}</div>
                                ${responseDateText ? `<small>${escapeHTML(responseDateText)}</small>` : ""}
                            </div>`;
                        }).join("")}</div></div>`
                        : `<div class="request-message"><strong>Donor Responses (0)</strong><p>No one has responded to this request yet.</p></div>`;

                return `<article class="my-request-card">
                    <div class="request-card-header">
                        <div><span class="request-label">Blood Request #${escapeHTML(String(requestId))}</span><h3>${escapeHTML(request.bloodGroup || "—")}</h3></div>
                        <span class="request-status">${escapeHTML(request.status || "Active")}</span>
                    </div>
                    <div class="request-info-grid">
                        <div class="request-info-item"><span>Units</span><strong>${escapeHTML(request.units ?? "—")}</strong></div>
                        <div class="request-info-item"><span>City</span><strong>${escapeHTML(request.city || "—")}</strong></div>
                        <div class="request-info-item"><span>Hospital</span><strong>${escapeHTML(request.hospital || "—")}</strong></div>
                        <div class="request-info-item"><span>Required Date</span><strong>${escapeHTML(requiredDate)}</strong></div>
                        <div class="request-info-item"><span>Urgency</span><strong>${escapeHTML(request.urgency || "—")}</strong></div>
                        <div class="request-info-item"><span>Created</span><strong>${escapeHTML(createdText)}</strong></div>
                    </div>
                    ${request.message ? `<div class="request-message"><span>Message</span><p>${escapeHTML(request.message)}</p></div>` : ""}
                    ${responseMarkup}
                </article>`;
            }));
            myRequestDetails.innerHTML = requestCards.join("");
        } catch (error) {
            console.error("Load My Blood Requests error:", error);
            myRequestDetails.innerHTML = `
                <div class="my-request-card empty error-state">
                    <div class="empty-icon"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i></div>
                    <h3>Could not load your requests</h3>
                    <p>${escapeHTML(error.message || "Check the backend connection and try again.")}</p>
                    <button type="button" class="btn btn-outline" id="retryMyRequests">Try Again</button>
                </div>`;
            document.getElementById("retryMyRequests")?.addEventListener("click", openMyRequest);
        }
    }


    function closeMyRequest() {

        if (!myRequestModal) {

            return;
        }


        myRequestModal.classList.remove(
            "active"
        );


        document.body.classList.remove(
            "modal-open"
        );


        setTimeout(() => {

            myRequestModal.style.display =
                "";

        }, 250);
    }


    // ========================================================
    // MY DONOR RESPONSES (responses submitted to blood requests)
    // ========================================================

    async function renderProfileResponses() {
        if (!profileResponsesList) return;

        profileResponsesList.innerHTML = `
            <div class="profile-response-card empty">
                <div class="empty-icon"><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i></div>
                <h3>Loading responses</h3>
                <p>Checking your saved responses...</p>
            </div>`;

        try {
            const responses = await fetchMyRequestResponses();

            if (responses.length === 0) {
                profileResponsesList.innerHTML = `
                    <div class="profile-response-card empty">
                        <div class="empty-icon">🤝</div>
                        <h3>No Responses Yet</h3>
                        <p>When you respond to someone else's blood request, it will appear here.</p>
                    </div>`;
                return;
            }

            profileResponsesList.innerHTML = responses.map(response => {
                const requestId = response.requestId ?? response.request_id ?? "—";
                const status = response.status || "Interested";
                const createdAt = response.createdAt || response.created_at;
                let dateText = "";
                if (createdAt) {
                    const parsedDate = new Date(createdAt);
                    dateText = Number.isNaN(parsedDate.getTime())
                        ? String(createdAt)
                        : parsedDate.toLocaleString("en-IN");
                }
                return `
                    <div class="profile-response-card">
                        <div class="response-avatar"><i class="fa-solid fa-hand-holding-heart" aria-hidden="true"></i></div>
                        <div class="response-main">
                            <div class="response-top">
                                <h3>Blood Request #${escapeHTML(String(requestId))}</h3>
                                <span class="response-status-badge">${escapeHTML(status)}</span>
                            </div>
                            <div class="response-details">
                                <span><i class="fa-solid fa-user" aria-hidden="true"></i> ${escapeHTML(response.donorName || response.donor_name || "Your response")}</span>
                            </div>
                            ${dateText ? `<small>${escapeHTML(dateText)}</small>` : ""}
                        </div>
                    </div>`;
            }).join("");
        } catch (error) {
            console.error("Load My Donor Responses error:", error);
            profileResponsesList.innerHTML = `
                <div class="profile-response-card empty error-state">
                    <div class="empty-icon"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i></div>
                    <h3>Could not load responses</h3>
                    <p>${escapeHTML(error.message || "Check that the backend is running and try again.")}</p>
                    <button type="button" class="btn btn-outline" id="retryProfileResponses">Try Again</button>
                </div>`;
            document.getElementById("retryProfileResponses")?.addEventListener("click", renderProfileResponses);
        }
    }


    function openMyResponses() {

        const user =
            getLoggedInUser();


        if (!user) {

            showToast(
                "Login Required",
                "Please login to view your donor responses."
            );


            openLogin();

            return;
        }


        renderProfileResponses();


        if (!myResponsesModal) {

            return;
        }


        myResponsesModal.style.display =
            "flex";


        document.body.classList.add(
            "modal-open"
        );


        requestAnimationFrame(() => {

            myResponsesModal.classList.add(
                "active"
            );

        });
    }


    function closeMyResponses() {

        if (!myResponsesModal) {

            return;
        }


        myResponsesModal.classList.remove(
            "active"
        );


        document.body.classList.remove(
            "modal-open"
        );


        setTimeout(() => {

            myResponsesModal.style.display =
                "";

        }, 250);
    }


    // ========================================================
    // PROFILE ACTION BUTTONS
    // ========================================================

    if (needBloodBtn) {

        needBloodBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeProfile();

                setTimeout(() => {

                    openBloodRequestModal();

                }, 250);

            }
        );
    }


    if (myRequestBtn) {

        myRequestBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeProfile();

                setTimeout(() => {

                    openMyRequest();

                }, 250);

            }
        );
    }


    if (myResponsesBtn) {

        myResponsesBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeProfile();

                setTimeout(() => {

                    openMyResponses();

                }, 250);

            }
        );
    }


    if (findDonorFromProfile) {

        findDonorFromProfile.addEventListener(
            "click",
            event => {

                event.preventDefault();


                closeProfile();


                setTimeout(() => {

                    const searchSection =
                        document.getElementById(
                            "find-blood"
                        ) ||
                        document.getElementById(
                            "search"
                        );


                    if (searchSection) {

                        searchSection.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "start"
                        });

                    }

                }, 300);

            }
        );
    }


    // ========================================================
    // CLOSE BLOOD REQUEST MODAL
    // ========================================================

    if (closeBloodRequestModal) {

        closeBloodRequestModal.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeBloodRequest();

            }
        );
    }


    if (bloodRequestModal) {

        bloodRequestModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    bloodRequestModal
                ) {

                    closeBloodRequest();

                }

            }
        );
    }


    // ========================================================
    // CLOSE MY REQUEST MODAL
    // ========================================================

    if (closeMyRequestModal) {

        closeMyRequestModal.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeMyRequest();

            }
        );
    }


    if (myRequestModal) {

        myRequestModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    myRequestModal
                ) {

                    closeMyRequest();

                }

            }
        );
    }


    // ========================================================
    // CLOSE MY RESPONSES MODAL
    // ========================================================

    if (closeMyResponsesModal) {

        closeMyResponsesModal.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeMyResponses();

            }
        );
    }


    if (myResponsesModal) {

        myResponsesModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    myResponsesModal
                ) {

                    closeMyResponses();

                }

            }
        );
    }


    // ========================================================
    // CREATE BLOOD REQUEST (persist to MySQL through the API)
    // ========================================================

    if (bloodRequestForm) {
        bloodRequestForm.addEventListener("submit", async event => {
            event.preventDefault();
            const user = getLoggedInUser();
            if (!user || !user.id) {
                showToast("Login Required", "Please login again before creating a blood request.");
                openLogin();
                return;
            }

            const payload = {
                userId: Number(user.id),
                bloodGroup: document.getElementById("requestBloodGroup")?.value.trim(),
                units: Number(document.getElementById("requestUnits")?.value),
                city: document.getElementById("requestCity")?.value.trim(),
                hospital: document.getElementById("requestHospital")?.value.trim() || null,
                requiredDate: document.getElementById("requestDate")?.value || null,
                urgency: document.getElementById("requestUrgency")?.value,
                message: document.getElementById("requestMessage")?.value.trim() || ""
            };

            if (!payload.bloodGroup || !Number.isInteger(payload.units) || payload.units < 1 || !payload.city || !payload.urgency) {
                showToast("Missing Details", "Please fill in blood group, units, city and urgency.");
                return;
            }

            const submitButton = bloodRequestForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton?.innerHTML;
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
            }

            try {
                const response = await fetch(`${API_BASE_URL}/requests`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify(payload)
                });
                const result = await getResponseData(response);
                if (!response.ok) throw new Error(getErrorMessage(result, "Unable to create blood request."));

                bloodRequestForm.reset();
                closeBloodRequest();
                await loadBloodRequests();
                await updateProfileSummary();
                showToast("Blood Request Created", "Your request has been saved to the database.");
            } catch (error) {
                console.error("Create blood request error:", error);
                showToast("Request Failed", error.message || "Could not save your request. Check that the backend is running.");
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText || '<i class="fa-solid fa-paper-plane"></i> Create Blood Request';
                }
            }
        });
    }


    // ========================================================
    // DONOR REGISTRATION
    // ========================================================

    if (donorForm) {

        donorForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const user =
                    getLoggedInUser();


                if (!user) {

                    showToast(
                        "Login Required",
                        "Please login before registering as a donor."
                    );


                    openLogin();

                    return;
                }


                const formData =
                    new FormData(
                        donorForm
                    );


                const donorData = {

                    name:
                        formData.get(
                            "name"
                        ) ||
                        document
                            .getElementById(
                                "donorName"
                            )
                            ?.value
                            .trim(),

                    email:
                        formData.get(
                            "email"
                        ) ||
                        user.email,

                    phone:
                        formData.get(
                            "phone"
                        ) ||
                        document
                            .getElementById(
                                "donorPhone"
                            )
                            ?.value
                            .trim(),

                    bloodGroup:
                        formData.get(
                            "bloodGroup"
                        ) ||
                        document
                            .getElementById(
                                "donorBloodGroup"
                            )
                            ?.value,

                    city:
                        formData.get(
                            "city"
                        ) ||
                        document
                            .getElementById(
                                "donorCity"
                            )
                            ?.value
                            .trim(),

                    age:
                        formData.get(
                            "age"
                        ) ||
                        document
                            .getElementById(
                                "donorAge"
                            )
                            ?.value,

                    available:
                        true
                };


                if (
                    !donorData.name ||
                    !donorData.phone ||
                    !donorData.bloodGroup ||
                    !donorData.city
                ) {

                    showToast(
                        "Missing Details",
                        "Please fill all donor registration fields."
                    );


                    return;
                }


                try {

                    const response =
                        await fetch(
                            `${API_BASE_URL}/donors`,
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        donorData
                                    )
                            }
                        );


                    const result =
                        await getResponseData(
                            response
                        );


                    if (!response.ok) {

                        showToast(
                            "Registration Failed",
                            getErrorMessage(
                                result,
                                "Unable to register as donor."
                            )
                        );


                        return;
                    }


                    showToast(
                        "Donor Registered",
                        "Thank you for becoming a blood donor!"
                    );


                    donorForm.reset();

                } catch (error) {

                    console.error(
                        "Donor registration error:",
                        error
                    );


                    showToast(
                        "Server Error",
                        "Unable to connect to BloodAid backend."
                    );
                }
            }
        );
    }


    // ========================================================
// SEARCH BLOOD
// ========================================================

if (searchBloodBtn) {

    searchBloodBtn.addEventListener(
        "click",
        async event => {

            event.preventDefault();

            // IMPORTANT:
            // These are the actual IDs from your HTML
            const bloodGroupInput =
                document.getElementById("bloodGroup");

            const locationInput =
                document.getElementById("location");


            const bloodGroup =
                bloodGroupInput
                    ? bloodGroupInput.value.trim()
                    : "";


            const city =
                locationInput
                    ? locationInput.value.trim()
                    : "";


            console.log(
                "Blood Group:",
                bloodGroup
            );

            console.log(
                "Location:",
                city
            );


            // ====================================================
            // VALIDATION
            // ====================================================

            if (!bloodGroup) {

                showToast(
                    "Select Blood Group",
                    "Please select a blood group to search."
                );

                return;
            }


            // ====================================================
            // LOADING
            // ====================================================

            if (searchResults) {

                searchResults.innerHTML = `

                    <div class="search-loading">

                        <div class="spinner"></div>

                        <p>
                            Finding matching donors...
                        </p>

                    </div>

                `;
            }


            try {

                // ====================================================
                // API URL
                // ====================================================

                let url =
                    `${API_BASE_URL}/donors/search?bloodGroup=${encodeURIComponent(
                        bloodGroup
                    )}`;


                // Add city only if entered
                if (city) {

                    url +=
                        `&city=${encodeURIComponent(
                            city
                        )}`;
                }


                console.log(
                    "Searching donors:",
                    url
                );


                // ====================================================
                // API REQUEST
                // ====================================================

                const response =
                    await fetch(
                        url,
                        {

                            method:
                                "GET",

                            headers: {

                                "Accept":
                                    "application/json"

                            }

                        }
                    );


                const result =
                    await getResponseData(
                        response
                    );


                console.log(
                    "Search response:",
                    result
                );


                // ====================================================
                // ERROR
                // ====================================================

                if (!response.ok) {

                    throw new Error(
                        getErrorMessage(
                            result,
                            "Unable to search donors."
                        )
                    );

                }


                // ====================================================
                // GET DONOR ARRAY
                // ====================================================

                const donors =
                    Array.isArray(result)
                        ? result
                        : (
                            Array.isArray(
                                result?.data
                            )
                                ? result.data
                                : []
                        );


                // ====================================================
                // DISPLAY RESULTS
                // ====================================================

                renderDonorResults(
                    donors
                );

            } catch (error) {

                console.error(
                    "Blood search error:",
                    error
                );


                if (searchResults) {

                    searchResults.innerHTML = `

                        <div class="search-empty">

                            <div class="empty-icon">
                                🩸
                            </div>

                            <h3>
                                Unable to Find Donors
                            </h3>

                            <p>
                                ${escapeHTML(
                                    error.message ||
                                    "Please try again."
                                )}
                            </p>

                        </div>

                    `;

                }


                showToast(
                    "Search Error",
                    error.message ||
                    "Unable to search donors."
                );

            }

        }
    );

}


    // ========================================================
    // RENDER DONOR RESULTS
    // ========================================================

    function renderDonorResults(
        donors
    ) {

        if (!searchResults) {

            return;
        }


        if (
            !Array.isArray(donors) ||
            donors.length === 0
        ) {

            searchResults.innerHTML = `

                <div class="search-empty">

                    <div class="empty-icon">
                        🩸
                    </div>

                    <h3>
                        No Donors Found
                    </h3>

                    <p>
                        We couldn't find a matching donor.
                        Try another city or blood group.
                    </p>

                </div>
            `;


            return;
        }


        searchResults.innerHTML =
            donors.map(
                (donor, index) => {

                    const name =
                        donor.name ||
                        donor.fullName ||
                        "Blood Donor";


                    const phone =
                        donor.phone ||
                        donor.mobile ||
                        "";


                    const donorBloodGroup =
                        donor.bloodGroup ||
                        donor.blood_group ||
                        "-";


                    const donorCity =
                        donor.city ||
                        "-";


                    const donorAge =
                        donor.age ||
                        "-";


                    return `

                        <div
                            class="donor-result-card"
                            data-donor-index="${index}"
                        >

                            <div class="donor-result-avatar">

                                ${
                                    escapeHTML(
                                        name
                                            .charAt(0)
                                            .toUpperCase()
                                    )
                                }

                            </div>


                            <div class="donor-result-info">

                                <h3>
                                    ${escapeHTML(
                                        name
                                    )}
                                </h3>


                                <div class="donor-meta">

                                    <span>
                                        🩸
                                        ${escapeHTML(
                                            donorBloodGroup
                                        )}
                                    </span>

                                    <span>
                                        📍
                                        ${escapeHTML(
                                            donorCity
                                        )}
                                    </span>

                                    <span>
                                        👤
                                        ${escapeHTML(
                                            donorAge
                                        )}
                                    </span>

                                </div>


                                ${
                                    phone
                                        ? `
                                            <div class="donor-phone">
                                                📞
                                                ${escapeHTML(
                                                    phone
                                                )}
                                            </div>
                                        `
                                        : ""
                                }

                            </div>


                            <button
                                type="button"
                                class="respond-btn"
                                data-name="${escapeHTML(
                                    name
                                )}"
                                data-phone="${escapeHTML(
                                    phone
                                )}"
                                data-blood-group="${escapeHTML(
                                    donorBloodGroup
                                )}"
                                data-city="${escapeHTML(
                                    donorCity
                                )}"
                                data-age="${escapeHTML(
                                    donorAge
                                )}"
                            >
                                Contact Donor
                            </button>

                        </div>
                    `;
                }
            )
            .join("");


        attachRespondButtons();
    }


    // ========================================================
    // RESPOND / CONTACT DONOR
    // ========================================================

    function attachRespondButtons() {

        const respondButtons =
            document.querySelectorAll(
                ".respond-btn"
            );


        respondButtons.forEach(
            button => {

                const donor = {

                    name:
                        button.dataset.name ||
                        "Donor",

                    phone:
                        button.dataset.phone ||
                        "",

                    bloodGroup:
                        button.dataset.bloodGroup ||
                        "-",

                    city:
                        button.dataset.city ||
                        "-",

                    age:
                        button.dataset.age ||
                        "-"
                };


                const existingResponses =
                    getDonorResponses();


                const alreadyResponded =
                    existingResponses.some(
                        response => {

                            return (
                                response.phone ===
                                    donor.phone &&
                                response.name ===
                                    donor.name
                            );

                        }
                    );


                if (
                    alreadyResponded
                ) {

                    button.textContent =
                        "✓ Response Sent";


                    button.classList.add(
                        "responded"
                    );


                    button.disabled =
                        true;
                }


                button.addEventListener(
                    "click",
                    () => {

                        const user =
                            getLoggedInUser();


                        if (!user) {

                            showToast(
                                "Login Required",
                                "Please login to contact a donor."
                            );


                            openLogin();

                            return;
                        }


                        const saved =
                            saveDonorResponse(
                                donor
                            );


                        if (!saved) {

                            showToast(
                                "Already Contacted",
                                "You have already responded to this donor."
                            );


                            button.textContent =
                                "✓ Response Sent";


                            button.classList.add(
                                "responded"
                            );


                            button.disabled =
                                true;


                            return;
                        }


                        button.textContent =
                            "✓ Response Sent";


                        button.classList.add(
                            "responded"
                        );


                        button.disabled =
                            true;


                        updateProfileSummary();


                        showToast(
                            "Response Sent",
                            `${donor.name} has been added to your donor responses.`
                        );

                    }
                );

            }
        );
    }


    // ========================================================
    // LIVE BLOOD REQUESTS + VIEW ALL + RESPOND
    // ========================================================

    const bloodRequestGrid = document.getElementById("bloodRequestGrid");
    let allBloodRequests = [];
    let showingAllRequests = false;

    function requestTimeLabel(value) {
        if (!value) return "Recently";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Recently";
        const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    function renderBloodRequests() {
        if (!bloodRequestGrid) return;
        const visibleRequests = showingAllRequests ? allBloodRequests : allBloodRequests.slice(0, 3);

        if (!allBloodRequests.length) {
            bloodRequestGrid.innerHTML = `
                <div class="requests-state">
                    <i class="fa-regular fa-clipboard" aria-hidden="true"></i>
                    <h3>No active blood requests</h3>
                    <p>When someone creates a blood request, it will appear here.</p>
                </div>`;
            if (viewAllRequests) viewAllRequests.hidden = true;
            return;
        }

        if (viewAllRequests) {
            viewAllRequests.hidden = allBloodRequests.length <= 3;
            viewAllRequests.setAttribute("aria-expanded", String(showingAllRequests));
            viewAllRequests.innerHTML = showingAllRequests
                ? 'Show Less <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>'
                : 'View All <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
        }

        bloodRequestGrid.innerHTML = visibleRequests.map(request => {
            const id = Number(request.id);
            const group = escapeHTML(request.bloodGroup || request.blood_group || "—");
            const city = escapeHTML(request.city || "Location not provided");
            const hospital = escapeHTML(request.hospital || "Patient blood requirement");
            const units = Number(request.units || 1);
            const urgency = String(request.urgency || "Needed");
            const urgent = urgency.toLowerCase() === "urgent";
            const ownerId = Number(request.userId ?? request.user_id);
            const currentUser = getLoggedInUser();
            const isOwnRequest = currentUser && Number(currentUser.id) === ownerId;
            const createdAt = request.createdAt || request.created_at;
            const locationText = city;
            return `
                <article class="request-card" data-request-id="${id}">
                    <div class="request-top">
                        <span class="urgent-badge ${urgent ? "" : "normal"}">${urgent ? "URGENT" : escapeHTML(urgency.toUpperCase())}</span>
                        <span class="request-time">${escapeHTML(requestTimeLabel(createdAt))}</span>
                    </div>
                    <div class="patient-info">
                        <div class="blood-type-large">${group}</div>
                        <div class="request-main-copy">
                            <h3>Blood Required</h3>
                            <p>${hospital}</p>
                        </div>
                    </div>
                    <div class="request-details">
                        <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${locationText}</span>
                        <span><i class="fa-solid fa-droplet" aria-hidden="true"></i> ${units} Unit${units === 1 ? "" : "s"}</span>
                    </div>
                    ${request.message ? `<p class="request-message">${escapeHTML(request.message)}</p>` : ""}
                    <button type="button" class="btn btn-primary request-respond-btn" data-request-id="${id}" ${isOwnRequest ? "disabled" : ""}>
                        ${isOwnRequest ? "Your Request" : "Respond"} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </button>
                </article>`;
        }).join("");
    }

    async function loadBloodRequests() {
        if (!bloodRequestGrid) return;
        bloodRequestGrid.innerHTML = `
            <div class="requests-state"><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i><p>Loading blood requests...</p></div>`;
        try {
            const response = await fetch(`${API_BASE_URL}/requests`, { headers: { "Accept": "application/json" } });
            const result = await getResponseData(response);
            if (!response.ok) throw new Error(getErrorMessage(result, "Could not load blood requests."));
            allBloodRequests = Array.isArray(result) ? result : (Array.isArray(result?.data) ? result.data : []);
            allBloodRequests = allBloodRequests.filter(item => String(item.status || "Active").toLowerCase() === "active");
            renderBloodRequests();
        } catch (error) {
            console.error("Load blood requests error:", error);
            bloodRequestGrid.innerHTML = `
                <div class="requests-state error-state">
                    <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                    <h3>Couldn't load blood requests</h3>
                    <p>${escapeHTML(error.message || "Make sure the Next.js server and MySQL database are running.")}</p>
                    <button type="button" class="btn btn-outline" id="retryBloodRequests">Try Again</button>
                </div>`;
            document.getElementById("retryBloodRequests")?.addEventListener("click", loadBloodRequests);
        }
    }

    if (viewAllRequests) {
        viewAllRequests.addEventListener("click", event => {
            event.preventDefault();
            showingAllRequests = !showingAllRequests;
            renderBloodRequests();
        });
    }

    if (bloodRequestGrid) {
        bloodRequestGrid.addEventListener("click", async event => {
            const button = event.target.closest(".request-respond-btn");
            if (!button) return;
            const user = getLoggedInUser();
            if (!user || !user.id) {
                showToast("Login Required", "Please login before responding to a blood request.");
                openLogin();
                return;
            }
            const requestId = Number(button.dataset.requestId);
            if (!requestId) return;
            button.disabled = true;
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            try {
                const response = await fetch(`${API_BASE_URL}/requests/${requestId}/respond`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({ userId: Number(user.id) })
                });
                const result = await getResponseData(response);
                if (!response.ok) throw new Error(getErrorMessage(result, "Could not send your response."));
                showToast("Response Sent", "Your response has been saved. The requester can see it in their profile.");
                button.innerHTML = 'Response Sent <i class="fa-solid fa-check" aria-hidden="true"></i>';
                button.classList.add("responded");
            } catch (error) {
                console.error("Respond to blood request error:", error);
                showToast("Response Failed", error.message || "Could not send response.");
                button.disabled = false;
                button.innerHTML = originalHTML;
            }
        });
    }

    // Keep request ownership/buttons in sync when auth changes in another tab.
    window.addEventListener("storage", event => {
        if (event.key === "bloodaidUser") {
            updateLoginButton();
            renderBloodRequests();
            updateProfileSummary();
        }
    });

    // Load actual requests from MySQL when the page opens.
    loadBloodRequests();


    // ========================================================
    // CLOSE TOAST
    // ========================================================

    if (closeToast) {

        closeToast.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (toast) {

                    toast.classList.remove(
                        "show"
                    );
                }

            }
        );
    }


    // ========================================================
    // ESCAPE KEY - CLOSE ALL MODALS
    // ========================================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;
            }


            closeLogin();

            closeProfile();

            closeBloodRequest();

            closeMyRequest();

            closeMyResponses();

        }
    );


    // ========================================================
    // INITIAL LOGIN STATE
    // ========================================================

    updateLoginButton();


    updateProfileSummary();


    // ========================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================================

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            anchor => {

                anchor.addEventListener(
                    "click",
                    event => {

                        const targetId =
                            anchor
                                .getAttribute(
                                    "href"
                                );


                        if (
                            !targetId ||
                            targetId === "#"
                        ) {

                            return;
                        }


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (!target) {

                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "start"
                        });

                    }
                );

            }
        );


    // ========================================================
    // PROFILE DATA AUTO REFRESH
    // ========================================================

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key &&
                (
                    event.key.startsWith(
                        "bloodaidBloodRequest_"
                    ) ||
                    event.key.startsWith(
                        "bloodaidResponses_"
                    )
                )
            ) {

                updateProfileSummary();


                if (
                    myResponsesModal &&
                    myResponsesModal.classList.contains(
                        "active"
                    )
                ) {

                    renderProfileResponses();

                }

            }

        }
    );


    // ========================================================
    // DEBUG / READY
    // ========================================================

    console.log(
        "BloodAid JavaScript initialized successfully."
    );


    console.log(
        "Logged in user:",
        getLoggedInUser()
    );

});