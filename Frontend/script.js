/* ==========================================
   SMART JOB DRIVE QUEUE MANAGEMENT SYSTEM
========================================== */
console.log("NEW SCRIPT VERSION 123");

/* ==========================================
   VARIABLES
========================================== */

let currentToken = 19;

let nextToken = 20;

let totalCandidates = 25;

let completedCandidates = 1;

let studentToken = null;


/*
    DEMO ADMIN PASSWORD

    IMPORTANT:
    This is only for the frontend prototype.

    Later, when we add Python + MySQL,
    authentication will be handled securely
    by the backend.
*/

const ADMIN_PASSWORD = "admin123";


/* ==========================================
   DOM ELEMENTS
========================================== */

const registrationForm =
    document.getElementById("registrationForm");

console.log("Registration form:", registrationForm);

const tokenResult =
    document.getElementById("tokenResult");

const generatedToken =
    document.getElementById("generatedToken");

const studentTokenDisplay =
    document.getElementById("studentToken");

const currentTokenDisplay =
    document.getElementById("currentToken");

const candidatesAheadDisplay =
    document.getElementById("candidatesAhead");

const waitingTimeDisplay =
    document.getElementById("waitingTime");

const studentStatus =
    document.getElementById("studentStatus");

const queueProgress =
    document.getElementById("queueProgress");

const progressText =
    document.getElementById("progressText");

const nextCandidateBtn =
    document.getElementById("nextCandidateBtn");

const adminLoginForm =
    document.getElementById("adminLoginForm");

const adminLoginSection =
    document.getElementById("admin-login");

const hrDashboard =
    document.getElementById("hr-dashboard");

const adminPasswordInput =
    document.getElementById("adminPassword");

const loginError =
    document.getElementById("loginError");


/* ==========================================
   REGISTER STUDENT
========================================== */
/* ==========================================
   REGISTER STUDENT - DJANGO API
========================================== */

registrationForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();
        console.log("Register button clicked");
        console.log("🔥 REGISTER SUBMIT EVENT FIRED");


        /* Get user details */

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const college =
            document.getElementById("college").value.trim();

        const position =
            document.getElementById("position").value;


        /* Basic validation */

        if (
            name === "" ||
            email === "" ||
            phone === "" ||
            college === "" ||
            position === ""
        ) {

            alert("Please fill in all the fields.");

            return;
        }


        /* Send candidate data to Django */

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/api/register/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        college: college,
                        position: position
                    })
                }
            );


            /* Get Django response */

            const data = await response.json();
            console.log("DJANGO RESPONSE:", data);


            /* Check if registration was successful */

            if (!response.ok) {

                console.error(data);

                alert(
                    "Registration failed. Please check your details."
                );

                return;
            }


            /* Get token from Django */

            studentToken =
                data.candidate.token_number;

            console.log("STUDENT TOKEN:", studentToken);


            generatedToken.textContent =
                studentToken;

            studentTokenDisplay.textContent =
                studentToken;


            /* Show token result */

            tokenResult.classList.remove(
                "hidden"
            );

            console.log("TOKEN RESULT SHOWN:", studentToken);


            /* Reset form */

            registrationForm.reset();


            /* Update queue */

            updateQueue();


            /* Scroll to token */

            setTimeout(function () {

                tokenResult.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 100);


            /* Success message */

            console.log(
                "Candidate registered:",
                data
            );

        } catch (error) {

            console.error(
                "Error connecting to Django:",
                error
            );

            alert(
                "Could not connect to the Django server."
            );

        }

    }
);



/* ==========================================
   UPDATE QUEUE - DJANGO API
========================================== */

async function updateQueue() {

    if (studentToken === null) {
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/queue/"
        );

        const candidates = await response.json();

        if (!response.ok) {

            console.error(
                "Could not fetch queue:",
                candidates
            );

            return;
        }


        /* Find the current serving candidate */

        const servingCandidate =
            candidates.find(
                candidate =>
                    candidate.status === "Serving"
            );


        /* Find the student's candidate */

        const student =
            candidates.find(
                candidate =>
                    candidate.token_number === studentToken
            );


        /* Update current token */

        if (servingCandidate) {

            currentToken =
                servingCandidate.token_number;

        } else {

            currentToken = 0;

        }


        currentTokenDisplay.textContent =
            currentToken;


        document.getElementById(
            "heroCurrentToken"
        ).textContent =
            currentToken;


        document.getElementById(
            "hrCurrentToken"
        ).textContent =
            currentToken;


        /* If student's candidate exists */

        if (student) {

            studentStatus.textContent =
                "● " + student.status;


            /* Waiting */

            if (student.status === "Waiting") {

                studentStatus.classList.remove(
                    "turn"
                );

                studentStatus.classList.add(
                    "waiting"
                );

            }


            /* Serving */

            else if (student.status === "Serving") {

                studentStatus.textContent =
                    "● Your Turn";

                studentStatus.classList.remove(
                    "waiting"
                );

                studentStatus.classList.add(
                    "turn"
                );

            }


            /* Completed */

            else if (student.status === "Completed") {

                studentStatus.textContent =
                    "● Completed";

                studentStatus.classList.remove(
                    "waiting",
                    "turn"
                );

            }


            /* Skipped */

            else if (student.status === "Skipped") {

                studentStatus.textContent =
                    "● Skipped";

                studentStatus.classList.remove(
                    "waiting",
                    "turn"
                );

            }

        }


        /* Calculate candidates ahead */

        const candidatesAhead =
            candidates.filter(
                candidate =>
                    candidate.token_number < studentToken &&
                    (
                        candidate.status === "Waiting" ||
                        candidate.status === "Serving"
                    )
            ).length;


        candidatesAheadDisplay.textContent =
            candidatesAhead;


        /* Estimated waiting time */

        const estimatedMinutes =
            candidatesAhead * 5;


        if (student && student.status === "Serving") {

            waitingTimeDisplay.textContent =
                "Your Turn";

        }

        else if (
            student &&
            student.status === "Completed"
        ) {

            waitingTimeDisplay.textContent =
                "Completed";

        }

        else if (
            student &&
            student.status === "Skipped"
        ) {

            waitingTimeDisplay.textContent =
                "Skipped";

        }

        else {

            waitingTimeDisplay.textContent =
                estimatedMinutes + " min";

        }


        /* Queue progress */

        let progress =
            (
                (studentToken - candidatesAhead) /
                studentToken
            ) * 100;


        progress =
            Math.min(
                Math.max(progress, 0),
                100
            );


        queueProgress.style.width =
            progress + "%";


        /* Progress text */

        if (student && student.status === "Serving") {

            progressText.textContent =
                "Your turn";

        }

        else if (student && student.status === "Completed") {

            progressText.textContent =
                "Interview completed";

        }

        else if (student && student.status === "Skipped") {

            progressText.textContent =
                "Candidate skipped";

        }

        else {

            progressText.textContent =
                candidatesAhead +
                " candidates ahead";

        }


    } catch (error) {

        console.error(
            "Error fetching queue:",
            error
        );

    }

}


/* ==========================================
   CALL NEXT CANDIDATE
========================================== */

nextCandidateBtn.addEventListener(
    "click",
    async function () {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/api/next/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );


            const data = await response.json();

            console.log(
                "NEXT CANDIDATE RESPONSE:",
                data
            );


            if (!response.ok) {

                console.error(
                    "Could not call next candidate:",
                    data
                );

                alert(
                    data.error ||
                    "Could not call the next candidate."
                );

                return;
            }


            /* Get candidate information */

            const candidate =
                data.candidate;


            /* Update current token */

            currentToken =
                candidate.token_number;


            updateCurrentToken();


            /* Update hero token */

            document.getElementById(
                "heroCurrentToken"
            ).textContent =
                currentToken;


            /* Refresh student queue */

            updateQueue();


            /* Refresh HR statistics */

            updateHRStats();


            /* Refresh candidate table */

            updateCandidateTable();


            /* Confirmation */

            alert(
                "Token " +
                candidate.token_number +
                " is now being called."
            );


        } catch (error) {

            console.error(
                "Error calling next candidate:",
                error
            );

            alert(
                "Could not connect to the Django server."
            );

        }

    }
);


/* ==========================================
   UPDATE CURRENT TOKEN
========================================== */

async function updateCurrentToken() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/current/"
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Could not fetch current candidate:",
                data
            );

            return;
        }

        currentToken =
            data.token_number;

        currentTokenDisplay.textContent =
            currentToken;

        document.getElementById(
            "hrCurrentToken"
        ).textContent =
            currentToken;

        document.getElementById(
            "heroCurrentToken"
        ).textContent =
            currentToken;

        console.log(
            "CURRENT SERVING TOKEN:",
            currentToken
        );

    } catch (error) {

        console.error(
            "Error fetching current candidate:",
            error
        );

    }

}


/* ==========================================
   UPDATE HR STATISTICS
========================================== */

async function updateHRStats() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/stats/"
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Could not fetch HR stats:", data);
            return;
        }

        document.getElementById(
            "totalCandidates"
        ).textContent = data.total_candidates;

        document.getElementById(
            "waitingCandidates"
        ).textContent = data.waiting;

        document.getElementById(
            "completedCandidates"
        ).textContent = data.completed;

        document.getElementById(
            "hrCurrentToken"
        ).textContent = currentToken;

        console.log("HR STATS:", data);

    } catch (error) {

        console.error(
            "Error fetching HR statistics:",
            error
        );

    }

}

/* ==========================================
   UPDATE CANDIDATE TABLE - DJANGO API
========================================== */

async function updateCandidateTable() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/queue/"
        );

        const candidates = await response.json();

        if (!response.ok) {

            console.error(
                "Could not fetch candidate queue:",
                candidates
            );

            return;
        }


        const table =
            document.getElementById("candidateTable");


        /* Clear existing rows */

        table.innerHTML = "";


        /* Create rows from Django data */

        candidates.forEach(function (candidate) {

            const row =
                document.createElement("tr");


            let statusText =
                candidate.status;

            let statusClass =
                "waiting-status";


            /* Serving candidate */

            if (candidate.status === "Serving") {

                statusText = "Interviewing";

                statusClass = "interviewing";

            }


            /* Completed candidate */

            else if (candidate.status === "Completed") {

                statusText = "Completed";

                statusClass = "interviewing";

            }


            /* Skipped candidate */

            else if (candidate.status === "Skipped") {

                statusText = "Skipped";

                statusClass = "waiting-status";

            }


            /* Complete button */

            let actionButton = "";


            if (candidate.status === "Serving") {

                actionButton = `
                    <button
                        class="complete-btn"
                        onclick="completeCandidate(${candidate.token_number})"
                    >
                        Complete
                    </button>
                `;

            }


            row.innerHTML = `
                <td>
                    <strong>${candidate.token_number}</strong>
                </td>

                <td>
                    ${candidate.name}
                </td>

                <td>
                    ${candidate.position}
                </td>

                <td>
                    <span class="table-status ${statusClass}">
                        ${statusText}
                    </span>
                </td>

                <td>
                    ${actionButton}
                </td>
            `;


            table.appendChild(row);

        });


        console.log(
            "CANDIDATE TABLE UPDATED:",
            candidates
        );


    } catch (error) {

        console.error(
            "Error fetching candidate table:",
            error
        );

    }

}

/* ==========================================
   COMPLETE CANDIDATE
========================================== */

async function completeCandidate(tokenNumber) {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/complete/" +
            tokenNumber +
            "/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        const data = await response.json();


        console.log(
            "COMPLETE CANDIDATE RESPONSE:",
            data
        );


        if (!response.ok) {

            alert(
                data.message ||
                "Could not complete candidate."
            );

            return;
        }


        alert(
            "Token " +
            tokenNumber +
            " completed successfully."
        );


        /* Refresh dashboard data */

        updateCandidateTable();

        updateHRStats();

        updateCurrentToken();

        updateQueue();


    } catch (error) {

        console.error(
            "Error completing candidate:",
            error
        );

        alert(
            "Could not connect to the Django server."
        );

    }

}







/* ==========================================
   OPEN ADMIN LOGIN
========================================== */

function openAdminLogin() {

    /*
        Hide dashboard if it was previously open.
    */

    hrDashboard.classList.add(
        "hidden"
    );


    /*
        Show login section.
    */

    adminLoginSection.classList.remove(
        "hidden"
    );


    /*
        Clear previous password.
    */

    adminPasswordInput.value = "";


    loginError.textContent = "";

    loginError.classList.remove(
        "show"
    );


    /*
        Scroll to login.
    */

    setTimeout(function () {

        adminLoginSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* ==========================================
   ADMIN LOGIN
========================================== */

adminLoginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const enteredPassword =
            adminPasswordInput.value;


        /*
            Check password.
        */

        if (
            enteredPassword ===
            ADMIN_PASSWORD
        ) {

            /*
                Login successful.
            */

            loginError.textContent = "";

            loginError.classList.remove(
                "show"
            );


            /*
                Hide login.
            */

            adminLoginSection.classList.add(
                "hidden"
            );


            /*
                Show dashboard.
            */

            hrDashboard.classList.remove(
                "hidden"
            );


            /*
                Scroll to dashboard.
            */

            setTimeout(function () {

                hrDashboard.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 100);


        } else {

            /*
                Wrong password.
            */

            loginError.textContent =
                "❌ Incorrect password. Please try again.";

            loginError.classList.add(
                "show"
            );


            adminPasswordInput.value = "";

            adminPasswordInput.focus();

        }

    }
);


/* ==========================================
   LOGOUT ADMIN
========================================== */

function logoutAdmin() {

    /*
        Hide dashboard.
    */

    hrDashboard.classList.add(
        "hidden"
    );


    /*
        Show login page.
    */

    adminLoginSection.classList.remove(
        "hidden"
    );


    /*
        Clear password.
    */

    adminPasswordInput.value = "";


    loginError.textContent = "";

    loginError.classList.remove(
        "show"
    );


    /*
        Scroll back to login.
    */

    setTimeout(function () {

        adminLoginSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* ==========================================
   BACK TO WEBSITE
========================================== */

function goBackToHome() {

    adminLoginSection.classList.add(
        "hidden"
    );


    window.location.hash = "home";


    document.getElementById(
        "home"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* ==========================================
   NAVIGATION
========================================== */

function scrollToRegister() {

    document.getElementById(
        "register"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


function scrollToQueue() {

    document.getElementById(
        "queue"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* ==========================================
   INITIAL SETUP
========================================== */


setTimeout(updateCurrentToken, 500);

updateHRStats();

setTimeout(updateCandidateTable, 500);