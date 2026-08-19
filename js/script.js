
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');


if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active'); 
    });
}


const alertBtn = document.getElementById('alert-btn');


if (alertBtn) {
    alertBtn.addEventListener('click', () => {
        alert('Welcome to Iyunga Secondary School! Thanks for exploring our website.');
    });
}


const fadeSections = document.querySelectorAll('.fade-in-section');

const appearanceOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};


const appearanceOnScroll = new IntersectionObserver(function(entries, appearanceOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            appearanceOnScroll.unobserve(entry.target);
        }
    });
}, appearanceOptions);

fadeSections.forEach(section => {
    appearanceOnScroll.observe(section);
});


const shapesContainer = document.getElementById('shapes-container');


function createShape() {
    if (!shapesContainer) return;

    const shape = document.createElement('div');
    shape.classList.add('floating-shape');

    
    if (Math.random() > 0.5) {
        shape.classList.add('square');
    }

    
    const size = Math.random() * 50 + 20 + 'px';
    shape.style.width = size;
    shape.style.height = size;
    shape.style.left = Math.random() * 100 + 'vw';
    
    
    shape.style.animationDuration = Math.random() * 10 + 10 + 's';

    shapesContainer.appendChild(shape);

    
    setTimeout(() => {
        shape.remove();
    }, 20000);
}


if (shapesContainer) {
    setInterval(createShape, 2500);
}

let currentGalleryIndex = 0;
let galleryTimeout;

function initSlideshow() {
    const slides = document.getElementsByClassName("mySlides");
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");

    if (slides.length === 0) return; 

    
    function showSlide(index) {
        if (index >= slides.length) { currentGalleryIndex = 0; }
        if (index < 0) { currentGalleryIndex = slides.length - 1; }

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[currentGalleryIndex].style.display = "block";
    }

    
    function autoPlay() {
        showSlide(currentGalleryIndex);
        currentGalleryIndex++;
        galleryTimeout = setTimeout(autoPlay, 3000);
    }

    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
            clearTimeout(galleryTimeout);
            currentGalleryIndex--;
            showSlide(currentGalleryIndex);
            galleryTimeout = setTimeout(autoPlay, 4000);
        });

        nextBtn.addEventListener("click", () => {
            clearTimeout(galleryTimeout);
            currentGalleryIndex++;
            showSlide(currentGalleryIndex);
            galleryTimeout = setTimeout(autoPlay, 4000);
        });
    }

   
    autoPlay();
}


initSlideshow();


const dashboardStudentForm = document.getElementById('student-submission-form');
const dashboardTableBody = document.getElementById('table-body');
const dashboardNoDataRow = document.getElementById('no-data-row');
const dashboardClearFormBtn = document.getElementById('btn-clear-form');

if (dashboardStudentForm && dashboardTableBody) {
    dashboardStudentForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

       
        const name = document.getElementById('student-name').value;
        const id = document.getElementById('student-id').value;
        const gender = document.getElementById('student-gender').value;
        const studentClass = document.getElementById('student-class').value;
        const phone = document.getElementById('student-phone').value;
        const email = document.getElementById('student-email').value;

        
        if (dashboardNoDataRow && dashboardTableBody.contains(dashboardNoDataRow)) {
            dashboardNoDataRow.remove();
        }

        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><strong>${id}</strong></td>
            <td>${name}</td>
            <td>${studentClass} (${gender})</td>
            <td>${phone}</td>
            <td>${email}</td>
        `;

        
        dashboardTableBody.appendChild(newRow);
        dashboardStudentForm.reset(); 
    });
}

if (dashboardClearFormBtn && dashboardStudentForm) {
    dashboardClearFormBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all input fields?")) {
            dashboardStudentForm.reset();
        }
    });
}

