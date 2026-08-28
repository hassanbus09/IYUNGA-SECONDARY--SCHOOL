// Ensure full browser document layout infrastructure initializes before firing scripts
document.addEventListener("DOMContentLoaded", () => {
    initRegistrationFormEngine();
    initRegistryTableViewer();
});

// High utility localized storage data mapping bridges
function getStoredStudents() {
    const students = localStorage.getItem('iyunga_students');
    return students ? JSON.parse(students) : [];
}

function saveStudentsToStorage(studentsArray) {
    localStorage.setItem('iyunga_students', JSON.stringify(studentsArray));
}

// ==========================================================================
// 1. REGISTRATION FORM CHANNEL (RUNS EXCLUSIVELY ON STUDENTS.HTML)
// ==========================================================================
function initRegistrationFormEngine() {
    const studentFormEl = document.getElementById('student-submission-form');
    const nameInput = document.getElementById('student-name');
    const idInput = document.getElementById('student-id');
    const genderSelect = document.getElementById('student-gender');
    const classSelect = document.getElementById('student-class');
    const phoneInput = document.getElementById('student-phone');
    const emailInput = document.getElementById('student-email');
    const clearFormBtn = document.getElementById('btn-clear-form');

    if (!studentFormEl || !nameInput) return;

    // Week 2 Day 4 Dynamic field generation: Automates random ID tags
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 3) {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            idInput.value = `ISS-2026-${randomNum}`;
        } else {
            idInput.value = '';
        }
    });

    // Form intake processing link execution
    studentFormEl.addEventListener('submit', (event) => {
        event.preventDefault();

        // Perform strict evaluation constraints on names and digits
        if (nameInput.value.trim().length < 3 || phoneInput.value.trim().length !== 10) {
            alert("Validation Error: Please make sure Full Name has 3+ characters and Phone Number has exactly 10 digits.");
            return;
        }

        const newStudent = {
            id: idInput.value,
            name: nameInput.value.trim(),
            gender: genderSelect.value,
            studentClass: classSelect.value,
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim()
        };

        const currentRegistry = getStoredStudents();
        currentRegistry.push(newStudent);
        saveStudentsToStorage(currentRegistry);

        // SUCCESS CONFIRMATION ALERT
        alert(`Success! "${newStudent.name}" has been compiled and saved into the browser database.\n\nYou can keep adding more students here, or click "View Student Records" on the left menu to view them!`);
        
        // Form caches reset so you can add another student immediately
        studentFormEl.reset();
        
        // 🔴 ABSOLUTE LAYOUT NAVIGATION PROTECTION: 
        // We have removed the automatic redirect line from here! The page stays on the form 
        // until the admin explicitly decides to click the sidebar menu vectors.
    });

    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all input fields?")) studentFormEl.reset();
        });
    }
}

// ==========================================================================
// 2. REGISTRY DATABASE VIEWPORT (RUNS EXCLUSIVELY ON VIEW_STUDENT.HTML)
// ==========================================================================
function initRegistryTableViewer() {
    const viewTableBody = document.getElementById('view-table-body');
    const viewNoDataRow = document.getElementById('view-no-data-row');
    const recordCountDisplay = document.getElementById('record-count');
    const searchInput = document.getElementById('search-student');
    const classFilter = document.getElementById('filter-class');

    if (!viewTableBody) return;

    let storedStudents = getStoredStudents();

    if (storedStudents.length > 0 && viewNoDataRow) {
        viewNoDataRow.remove();
    }

    // Dynamic grid compiler: Renders student rows with built-in modification parameters
    function renderTableRows(dataArray) {
        viewTableBody.innerHTML = '';
        
        if (dataArray.length === 0) {
            viewTableBody.innerHTML = `<tr id="view-no-data-row"><td colspan="6" style="text-align: center; color: #6c757d; padding: 30px;">No matching student records found. <a href="students.html" style="color:var(--primary-dark); font-weight:bold; text-decoration:none;">Click here to register student.</a></td></tr>`;
            if (recordCountDisplay) recordCountDisplay.textContent = '0';
            return;
        }

        dataArray.forEach((student) => {
            const row = document.createElement('tr');
            row.className = 'student-row';
            row.setAttribute('data-class', student.studentClass);

            row.innerHTML = `
                <td class="cell-id"><strong>${student.id}</strong></td>
                <td class="cell-name">${student.name}</td>
                <td class="cell-class">${student.studentClass} (${student.gender})</td>
                <td class="cell-phone">${student.phone}</td>
                <td class="cell-email">${student.email}</td>
                <td class="table-actions-cell">
                    <button class="btn-table-edit">Edit</button>
                    <button class="btn-table-delete">Delete</button>
                </td>
            `;

            // IN-LINE EDITING AND UPDATE METHOD COMPILER
            const editBtn = row.querySelector('.btn-table-edit');
            editBtn.addEventListener('click', () => {
                const globalRegistry = getStoredStudents();
                const targetIndex = globalRegistry.findIndex(s => s.id === student.id);

                if (editBtn.classList.contains('editing')) {
                    const uId = row.querySelector('.input-id').value;
                    const uName = row.querySelector('.input-name').value;
                    const uClass = row.querySelector('.input-class').value;
                    const uPhone = row.querySelector('.input-phone').value;
                    const uEmail = row.querySelector('.input-email').value;

                    if (targetIndex !== -1) {
                        globalRegistry[targetIndex].id = uId; globalRegistry[targetIndex].name = uName;
                        globalRegistry[targetIndex].studentClass = uClass; globalRegistry[targetIndex].phone = uPhone;
                        globalRegistry[targetIndex].email = uEmail; saveStudentsToStorage(globalRegistry);
                    }

                    row.querySelector('.cell-id').innerHTML = `<strong>${uId}</strong>`;
                    row.querySelector('.cell-name').textContent = uName;
                    row.querySelector('.cell-class').textContent = `${uClass} (${student.gender})`;
                    row.querySelector('.cell-phone').textContent = uPhone;
                    row.querySelector('.cell-email').textContent = uEmail;

                    editBtn.textContent = 'Edit'; editBtn.className = 'btn-table-edit';
                } else {
                    row.querySelector('.cell-id').innerHTML = `<input type="text" class="table-cell-input input-id" value="${student.id}">`;
                    row.querySelector('.cell-name').innerHTML = `<input type="text" class="table-cell-input input-name" value="${student.name}">`;
                    row.querySelector('.cell-class').innerHTML = `<input type="text" class="table-cell-input input-class" value="${student.studentClass}">`;
                    row.querySelector('.cell-phone').innerHTML = `<input type="tel" class="table-cell-input input-phone" value="${student.phone}">`;
                    row.querySelector('.cell-email').innerHTML = `<input type="email" class="table-cell-input input-email" value="${student.email}">`;

                    editBtn.textContent = 'Save'; editBtn.className = 'btn-table-save editing';
                }
            });

            // PERMANENT RECORD ROW EVICTION METHOD
            row.querySelector('.btn-table-delete').addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete ${student.name}?`)) {
                    const globalRegistry = getStoredStudents();
                    const cleanRegistry = globalRegistry.filter(s => s.id !== student.id);
                    saveStudentsToStorage(cleanRegistry);
                    initRegistryTableViewer();
                }
            });

            viewTableBody.appendChild(row);
        });

        if (recordCountDisplay) recordCountDisplay.textContent = dataArray.length;
    }

    renderTableRows(storedStudents);

    // Dynamic row filtration metrics
    function filterEngine() {
        const searchText = searchInput.value.toLowerCase();
        const selectedClass = classFilter.value;
        storedStudents = getStoredStudents();

        const filtered = storedStudents.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchText) || student.id.toLowerCase().includes(searchText);
            const matchesClass = selectedClass === 'All' || student.studentClass === selectedClass;
            return matchesSearch && matchesClass;
        });
        renderTableRows(filtered);
    }

    if (searchInput && classFilter) {
        searchInput.addEventListener('input', filterEngine);
        classFilter.addEventListener('change', filterEngine);
    }
}
// Hakikisha kila kitu kinapakiwa kabla ya kuanza
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MIFUMO YA SLIDESHOW
    let slideIndex = 0;
    let slideTimer;

    function showSlides() {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        
        // Ficha picha zote kwanza
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        
        // Ongeza index
        slideIndex++;
        
        // Kama index imezidi idadi ya picha, rudi mwanzo
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }    
        
        // Onyesha picha iliyopo kwenye zamu
        if (slides.length > 0) {
            slides[slideIndex - 1].style.display = "block";  
        }
        
        // Badilisha picha kila baada ya sekunde 3
        slideTimer = setTimeout(showSlides, 3000); 
    }

    // 2. KUDHIBITI VITUFE VYA PREV NA NEXT
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearTimeout(slideTimer); // Simamisha muda wa kujiendesha kwanza
            moveSlide(1);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearTimeout(slideTimer);
            moveSlide(-1);
        });
    }

    function moveSlide(n) {
        let slides = document.getElementsByClassName("mySlides");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        
        slideIndex += n;
        
        if (slideIndex > slides.length) { slideIndex = 1; }
        if (slideIndex < 1) { slideIndex = slides.length; }
        
        slides[slideIndex - 1].style.display = "block";
        slideTimer = setTimeout(showSlides, 4000); // Anza tena auto-play baada ya sekunde 4
    }

    // Washa slideshow
    showSlides();


    // 3. MENU TOGGLE (Kwa ajili ya Simu)
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
