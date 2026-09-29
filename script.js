/* =================================
   STAFFFLOW ADMIN PORTAL
   ================================= */


// =================================
// DATA
// =================================

let employees = JSON.parse(
    localStorage.getItem("employees")
) || [
    {
        id: 1,
        name: "Rahul Kumar",
        department: "Development",
        email: "rahul@example.com"
    },
    {
        id: 2,
        name: "Priya Sharma",
        department: "Design",
        email: "priya@example.com"
    },
    {
        id: 3,
        name: "Arun Raj",
        department: "Testing",
        email: "arun@example.com"
    },
    {
        id: 4,
        name: "Sneha Rao",
        department: "HR",
        email: "sneha@example.com"
    }
];


let attendance = JSON.parse(
    localStorage.getItem("attendance")
) || [
    {
        employeeId: 1,
        status: "Present",
        login: "09:05 AM"
    },
    {
        employeeId: 2,
        status: "Late",
        login: "09:42 AM"
    },
    {
        employeeId: 3,
        status: "Present",
        login: "08:58 AM"
    },
    {
        employeeId: 4,
        status: "Absent",
        login: "-"
    }
];


let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [
    {
        id: 1,
        title: "Website UI Design",
        employeeId: 2,
        priority: "High",
        progress: 80,
        status: "In Progress",
        deadline: "2026-10-02"
    },
    {
        id: 2,
        title: "API Development",
        employeeId: 1,
        priority: "Medium",
        progress: 60,
        status: "In Progress",
        deadline: "2026-10-05"
    },
    {
        id: 3,
        title: "Database Testing",
        employeeId: 3,
        priority: "High",
        progress: 30,
        status: "Pending",
        deadline: "2026-10-07"
    }
];


// =================================
// SAVE DATA
// =================================

function saveData() {

    localStorage.setItem(
        "employees",
        JSON.stringify(employees)
    );

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// =================================
// DATE
// =================================

function showDate() {

    const date = new Date();

    document.getElementById("currentDate").textContent =
        date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}


// =================================
// DASHBOARD
// =================================

function updateDashboard() {

    const total = employees.length;

    const present = attendance.filter(
        item => item.status === "Present"
    ).length;

    const absent = attendance.filter(
        item => item.status === "Absent"
    ).length;

    const late = attendance.filter(
        item => item.status === "Late"
    ).length;

    const pending = tasks.filter(
        task => task.status === "Pending"
    ).length;


    document.getElementById(
        "totalEmployees"
    ).textContent = total;


    document.getElementById(
        "presentToday"
    ).textContent = present;


    document.getElementById(
        "absentToday"
    ).textContent = absent;


    document.getElementById(
        "pendingTasks"
    ).textContent = pending;


    document.getElementById(
        "summaryPresent"
    ).textContent = present;


    document.getElementById(
        "summaryLate"
    ).textContent = late;


    document.getElementById(
        "summaryAbsent"
    ).textContent = absent;


    const rate =
        total === 0
            ? 0
            : Math.round((present / total) * 100);


    document.getElementById(
        "attendanceRate"
    ).textContent = rate + "%";
}


// =================================
// EMPLOYEE TABLE
// =================================

function renderEmployees() {

    const table =
        document.getElementById("employeeTable");

    const search =
        document.getElementById("employeeSearch")
            .value.toLowerCase();

    const department =
        document.getElementById("departmentFilter")
            .value;


    table.innerHTML = "";


    const filteredEmployees =
        employees.filter(employee => {

            const matchesSearch =
                employee.name
                    .toLowerCase()
                    .includes(search) ||
                employee.email
                    .toLowerCase()
                    .includes(search);

            const matchesDepartment =
                department === "all" ||
                employee.department === department;

            return matchesSearch && matchesDepartment;
        });


    filteredEmployees.forEach(employee => {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                <div class="employee-name">
                    ${employee.name}
                </div>
            </td>

            <td>
                ${employee.department}
            </td>

            <td>
                <span class="employee-email">
                    ${employee.email}
                </span>
            </td>

            <td>
                <span class="status status-active">
                    Active
                </span>
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteEmployee(${employee.id})">
                    Delete
                </button>
            </td>
        `;


        table.appendChild(row);
    });


    updateTaskEmployeeDropdown();
}


// =================================
// DELETE EMPLOYEE
// =================================

function deleteEmployee(id) {

    const employee =
        employees.find(item => item.id === id);


    if (!employee) return;


    const confirmDelete =
        confirm(
            `Delete ${employee.name}?`
        );


    if (!confirmDelete) return;


    employees =
        employees.filter(
            item => item.id !== id
        );


    attendance =
        attendance.filter(
            item => item.employeeId !== id
        );


    tasks =
        tasks.filter(
            item => item.employeeId !== id
        );


    saveData();

    renderAll();

    showToast("Employee deleted successfully.");
}


// =================================
// ATTENDANCE TABLE
// =================================

function renderAttendance() {

    const table =
        document.getElementById("attendanceTable");

    table.innerHTML = "";


    employees.forEach(employee => {

        let record =
            attendance.find(
                item =>
                    item.employeeId === employee.id
            );


        if (!record) {

            record = {
                employeeId: employee.id,
                status: "Absent",
                login: "-"
            };

            attendance.push(record);
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                <strong>${employee.name}</strong>
            </td>

            <td>
                ${employee.department}
            </td>

            <td>
                ${record.login}
            </td>

            <td>
                <span class="status ${getStatusClass(record.status)}">
                    ${record.status}
                </span>
            </td>

            <td>

                <select
                    onchange="changeAttendance(
                        ${employee.id},
                        this.value
                    )">

                    <option
                        ${record.status === "Present" ? "selected" : ""}>
                        Present
                    </option>

                    <option
                        ${record.status === "Late" ? "selected" : ""}>
                        Late
                    </option>

                    <option
                        ${record.status === "Absent" ? "selected" : ""}>
                        Absent
                    </option>

                </select>

            </td>
        `;


        table.appendChild(row);
    });


    saveData();
}


// =================================
// ATTENDANCE UPDATE
// =================================

function changeAttendance(
    employeeId,
    status
) {

    const record =
        attendance.find(
            item =>
                item.employeeId === employeeId
        );


    if (!record) return;


    record.status = status;


    if (status === "Absent") {

        record.login = "-";

    } else {

        record.login =
            new Date().toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    }


    saveData();

    renderAttendance();

    updateDashboard();

    showToast(
        "Attendance updated successfully."
    );
}


// =================================
// STATUS CLASS
// =================================

function getStatusClass(status) {

    if (status === "Present") {
        return "status-present";
    }

    if (status === "Late") {
        return "status-late";
    }

    if (status === "Absent") {
        return "status-absent";
    }

    if (status === "Completed") {
        return "status-completed";
    }

    return "status-pending";
}


// =================================
// TASK SUMMARY
// =================================

function renderTaskSummary() {

    const container =
        document.getElementById("taskSummary");

    container.innerHTML = "";


    tasks.slice(0, 4).forEach(task => {

        container.innerHTML += `

            <div class="task-summary-item">

                <div class="task-summary-top">

                    <span>${task.title}</span>

                    <strong>
                        ${task.progress}%
                    </strong>

                </div>

                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width:${task.progress}%">
                    </div>

                </div>

            </div>

        `;
    });
}


// =================================
// TASK CARDS
// =================================

function renderTasks() {

    const container =
        document.getElementById(
            "tasksContainer"
        );

    container.innerHTML = "";


    tasks.forEach(task => {

        const employee =
            employees.find(
                item =>
                    item.id === task.employeeId
            );


        const employeeName =
            employee
                ? employee.name
                : "Unknown Employee";


        const card =
            document.createElement("div");


        card.className = "task-card";


        card.innerHTML = `

            <div class="task-top">

                <span class="
                    priority
                    priority-${task.priority.toLowerCase()}
                ">
                    ${task.priority}
                </span>

                <span class="
                    status
                    ${getStatusClass(task.status)}
                ">
                    ${task.status}
                </span>

            </div>


            <h3>
                ${task.title}
            </h3>


            <div class="task-assignee">
                Assigned to: ${employeeName}
            </div>


            <div class="task-progress">

                <div class="task-progress-top">

                    <span>Progress</span>

                    <strong>
                        ${task.progress}%
                    </strong>

                </div>


                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width:${task.progress}%">
                    </div>

                </div>


                <input
                    class="progress-input"
                    type="range"
                    min="0"
                    max="100"
                    value="${task.progress}"
                    onchange="
                        updateTaskProgress(
                            ${task.id},
                            this.value
                        )
                    "
                >

            </div>


            <div class="task-deadline">
                Deadline: ${task.deadline}
            </div>

        `;


        container.appendChild(card);
    });
}


// =================================
// TASK PROGRESS
// =================================

function updateTaskProgress(
    taskId,
    progress
) {

    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) return;


    task.progress =
        Number(progress);


    if (task.progress === 100) {

        task.status = "Completed";

    } else if (task.progress === 0) {

        task.status = "Pending";

    } else {

        task.status = "In Progress";
    }


    saveData();

    renderTasks();

    renderTaskSummary();

    updateDashboard();

    showToast(
        "Task progress updated."
    );
}


// =================================
// TASK EMPLOYEE DROPDOWN
// =================================

function updateTaskEmployeeDropdown() {

    const select =
        document.getElementById(
            "taskEmployee"
        );


    if (!select) return;


    select.innerHTML =
        `<option value="">
            Select employee
        </option>`;


    employees.forEach(employee => {

        select.innerHTML += `
            <option value="${employee.id}">
                ${employee.name}
            </option>
        `;
    });
}


// =================================
// ADD EMPLOYEE
// =================================

document
    .getElementById("employeeForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "employeeName"
                ).value.trim();


            const department =
                document.getElementById(
                    "employeeDepartment"
                ).value;


            const email =
                document.getElementById(
                    "employeeEmail"
                ).value.trim();


            const newEmployee = {

                id: Date.now(),

                name: name,

                department: department,

                email: email
            };


            employees.push(
                newEmployee
            );


            attendance.push({

                employeeId:
                    newEmployee.id,

                status: "Absent",

                login: "-"
            });


            saveData();

            renderAll();

            closeModal(
                "employeeModal"
            );


            this.reset();


            showToast(
                "Employee added successfully."
            );
        }
    );


// =================================
// ADD TASK
// =================================

document
    .getElementById("taskForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const title =
                document.getElementById(
                    "taskTitle"
                ).value.trim();


            const employeeId =
                Number(
                    document.getElementById(
                        "taskEmployee"
                    ).value
                );


            const priority =
                document.getElementById(
                    "taskPriority"
                ).value;


            const deadline =
                document.getElementById(
                    "taskDeadline"
                ).value;


            tasks.push({

                id: Date.now(),

                title: title,

                employeeId: employeeId,

                priority: priority,

                progress: 0,

                status: "Pending",

                deadline: deadline
            });


            saveData();

            renderAll();

            closeModal(
                "taskModal"
            );


            this.reset();


            showToast(
                "Task assigned successfully."
            );
        }
    );


// =================================
// MODALS
// =================================

function openModal(id) {

    document
        .getElementById(id)
        .classList.add("show");
}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");
}


document
    .getElementById(
        "openEmployeeModal"
    )
    .addEventListener(
        "click",
        () => openModal(
            "employeeModal"
        )
    );


document
    .getElementById(
        "closeEmployeeModal"
    )
    .addEventListener(
        "click",
        () => closeModal(
            "employeeModal"
        )
    );


document
    .getElementById(
        "openTaskModal"
    )
    .addEventListener(
        "click",
        () => openModal(
            "taskModal"
        )
    );


document
    .getElementById(
        "closeTaskModal"
    )
    .addEventListener(
        "click",
        () => closeModal(
            "taskModal"
        )
    );


// Close modal when clicking outside

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target === this
                ) {
                    this.classList.remove(
                        "show"
                    );
                }

            }
        );

    });


// =================================
// SEARCH
// =================================

document
    .getElementById(
        "employeeSearch"
    )
    .addEventListener(
        "input",
        renderEmployees
    );


document
    .getElementById(
        "departmentFilter"
    )
    .addEventListener(
        "change",
        renderEmployees
    );


// =================================
// MOBILE MENU
// =================================

document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("sidebar")
                .classList.toggle("open");

        }
    );


// =================================
// DARK MODE
// =================================

document
    .getElementById(
        "darkModeBtn"
    )
    .addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );


            localStorage.setItem(
                "darkMode",
                document.body.classList.contains(
                    "dark-mode"
                )
            );

        }
    );


if (
    localStorage.getItem(
        "darkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark-mode"
    );
}


// =================================
// NAVIGATION
// =================================

document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".nav-link"
                    )
                    .forEach(item =>
                        item.classList.remove(
                            "active"
                        )
                    );


                link.classList.add(
                    "active"
                );


                document
                    .getElementById(
                        "sidebar"
                    )
                    .classList.remove(
                        "open"
                    );

            }
        );

    });


// =================================
// NOTIFICATION
// =================================

document
    .getElementById(
        "notificationBtn"
    )
    .addEventListener(
        "click",
        () => {

            showToast(
                "You have new dashboard updates."
            );

        }
    );


// =================================
// LOGOUT
// =================================

document
    .getElementById(
        "logoutBtn"
    )
    .addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                showToast(
                    "Logout functionality can be connected to your backend."
                );

            }

        }
    );


// =================================
// TOAST
// =================================

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);
}


// =================================
// RENDER EVERYTHING
// =================================

function renderAll() {

    renderEmployees();

    renderAttendance();

    renderTasks();

    renderTaskSummary();

    updateDashboard();

    updateTaskEmployeeDropdown();
}


// =================================
// START APPLICATION
// =================================

showDate();

renderAll();