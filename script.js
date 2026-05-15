/* --- 1. DATA ARRAYS --- */
const services = [
    { name: "Dental Implants", icon: "🦷", desc: "Natural appearance and long-lasting solutions.", img: "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?w=600" },
    { name: "Root Canal", icon: "⚡", desc: "Painless single-visit RCT using high-precision digital X-rays.", img: "https://images.unsplash.com/photo-1588776814546-1ffce47267a5?w=600" },
    { name: "Clear Aligners", icon: "💎", desc: "Invisible and removable braces for faster results.", img: "https://images.unsplash.com/photo-1593054999502-d9b30402094e?w=600" },
    { name: "Smile Makeover", icon: "✨", desc: "Transform your smile with veneers and whitening.", img: "https://images.unsplash.com/photo-1559839734-2b71ef159950?w=600" }
];

const doctors = [
    { name: "Dr. Dany Arulraj (MDS)", specialty: "Dental Implants", img: "https://i.pravatar.cc/400?u=1", qual: "Prosthodontist" },
    { name: "Dr. Arjun Sharma (MDS)", specialty: "Root Canal", img: "https://i.pravatar.cc/400?u=2", qual: "Endodontist" },
    { name: "Dr. Kavita Reddy (MDS)", specialty: "Clear Aligners", img: "https://i.pravatar.cc/400?u=3", qual: "Orthodontist" }
];

/* --- 2. ANIMATION LOGIC (Declared ONLY once) --- */
const observerOptions = { threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // If this is the stats section, start the numbers
            if (entry.target.querySelector('.counter')) {
                startCounters();
            }
        }
    });
}, observerOptions);

// Initialize observer when page loads
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

/* --- 3. UTILITY FUNCTIONS --- */
function startCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const inc = target / 100;
        const update = () => {
            if (count < target) {
                count += inc;
                counter.innerText = Math.ceil(count);
                setTimeout(update, 20);
            } else {
                counter.innerText = target + "+";
            }
        };
        update();
    });
}

function toggleMobileMenu() {
    const nav = document.querySelector('.nav-links');
    const hamburgerIcon = document.querySelector('.hamburger i');
    
    nav.classList.toggle('mobile-active');
    
    // Switch icon between Bars and X
    if (nav.classList.contains('mobile-active')) {
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-times');
    } else {
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
    }
}

// Close mobile menu when a link is clicked (Except for dropdown triggers)
document.querySelectorAll('.nav-links a:not(.drop-trigger)').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('mobile-active');
        const hamburgerIcon = document.querySelector('.hamburger i');
        if (hamburgerIcon) {
            hamburgerIcon.classList.add('fa-bars');
            hamburgerIcon.classList.remove('fa-times');
        }
    });
});

// Dropdown toggle for mobile
document.addEventListener('click', (e) => {
    const dropTrigger = e.target.closest('.drop-trigger');
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');

    if (dropTrigger && window.innerWidth <= 991) {
        const parent = dropTrigger.parentElement;
        if (!parent.classList.contains('active')) {
            e.preventDefault(); 
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            parent.classList.add('active');
        }
    } else if (!e.target.closest('.dropdown')) {
        // Close dropdowns if clicked outside
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    }

    // Close mobile menu if clicked outside
    if (navLinks && navLinks.classList.contains('mobile-active') && 
        !e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
        navLinks.classList.remove('mobile-active');
        const hamburgerIcon = document.querySelector('.hamburger i');
        if (hamburgerIcon) {
            hamburgerIcon.classList.add('fa-bars');
            hamburgerIcon.classList.remove('fa-times');
        }
    }
});

function handleTimeSelection(element, timeString) {
    const hiddenInput = document.getElementById('hiddenTimeSlot');
    if (element.classList.contains('active-slot')) {
        element.classList.remove('active-slot');
        hiddenInput.value = ""; 
    } else {
        document.querySelectorAll('.time-pill').forEach(pill => pill.classList.remove('active-slot'));
        element.classList.add('active-slot');
        hiddenInput.value = timeString;
    }
}

/**
 * 2. FINALIZED FORM SUBMISSION + WHATSAPP REDIRECT
 */
const appointmentForm = document.getElementById('appointmentForm');
const submitBtn = document.getElementById('submitBtn');

appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop standard submission

    // Validate time selection
    const timeValue = document.getElementById('hiddenTimeSlot').value;
    if (!timeValue) {
        alert("Please select a preferred Time Slot.");
        return;
    }

    // --- CONFIGURATION ---
    const adminPhone = "919597931410"; // REPLACE WITH YOUR REAL NUMBER (e.g. 91...)
    
    // Change UI to show progress
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Capture all data
    const formData = new FormData(appointmentForm);
    const data = Object.fromEntries(formData);

    // 1. Send Email via Web3Forms API
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json' 
        },
        body: JSON.stringify(data)
    })
    .then(async (response) => {
        let result = await response.json();
        if (response.status == 200) {
            // Success! Now build the WhatsApp message
            
            const waMessage = `*NEW APPOINTMENT REQUEST* 🦷\n` +
                              `--------------------------\n` +
                              `👤 *Patient:* ${data.Patient_Name}\n` +
                              `📞 *Phone:* ${data.Phone_Number}\n` +
                              `🏥 *Branch:* ${data.Branch}\n` +
                              `🛠 *Service:* ${data.Service}\n` +
                              `👨‍⚕️ *Doctor:* ${data.Doctor}\n` +
                              `📅 *Date:* ${data.Date}\n` +
                              `🕒 *Time:* ${data.Requested_Time_Slot}\n` +
                              `--------------------------\n` +
                              `Sent via V-Cure Website`;

            // Construct the final URL
            const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(waMessage)}`;

            // FORCE REDIRECT
            window.location.href = whatsappUrl;
            
            // Cleanup
            appointmentForm.reset();
        } else {
            alert("Submission Error: " + result.message);
        }
    })
    .catch(error => {
        console.error(error);
        alert("Something went wrong. Please check your internet connection.");
    })
    .finally(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });
});
document.addEventListener("DOMContentLoaded", function() {
    // Animation Observer
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Consolidated Carousel Logic (splitServicesTrack)
    const track = document.getElementById("splitServicesTrack");
    if (track) {
        const slides = Array.from(track.querySelectorAll('.split-slide'));
        const indicatorsContainer = document.getElementById("carouselIndicators");
        const btnPrev = document.getElementById("slidePrev");
        const btnNext = document.getElementById("slideNext");
        
        let currentIndex = 0;
        let autoPlayInterval;
        const speed = 3000;

        // 1. Generate the Dots dynamically
        if (indicatorsContainer) {
            slides.forEach((slide, index) => {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active'); 
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    resetAutoPlay();
                });
                indicatorsContainer.appendChild(dot);
            });
        }

        const dots = indicatorsContainer ? Array.from(indicatorsContainer.querySelectorAll('.carousel-dot')) : [];

        // 2. MATHEMATICAL SCROLL FUNCTION (100% RELIABLE)
        function goToSlide(index) {
            if (index < 0) index = slides.length - 1; 
            if (index >= slides.length) index = 0; 
            currentIndex = index;
            const exactScrollPosition = track.clientWidth * currentIndex;
            track.scrollTo({ left: exactScrollPosition, behavior: 'smooth' });
            updateDots(currentIndex);
        }

        function updateDots(activeIndex) {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[activeIndex]) dots[activeIndex].classList.add('active');
        }

        if (btnNext && btnPrev) {
            btnNext.addEventListener('click', (e) => {
                e.preventDefault();
                goToSlide(currentIndex + 1);
                resetAutoPlay();
            });
            btnPrev.addEventListener('click', (e) => {
                e.preventDefault();
                goToSlide(currentIndex - 1);
                resetAutoPlay();
            });
        }

        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), speed);
        }

        function stopAutoPlay() { clearInterval(autoPlayInterval); }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        // 3. Intelligent Scroll Syncing
        const obsOptions = { root: track, threshold: 0.6 };
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const visibleIndex = slides.indexOf(entry.target);
                    currentIndex = visibleIndex;
                    updateDots(visibleIndex);
                }
            });
        }, obsOptions);

        slides.forEach(slide => scrollObserver.observe(slide));
        startAutoPlay();

        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        track.addEventListener('touchstart', stopAutoPlay, {passive: true});
        track.addEventListener('touchend', resetAutoPlay, {passive: true});
        if (btnNext) btnNext.addEventListener('mouseenter', stopAutoPlay);
        if (btnPrev) btnPrev.addEventListener('mouseenter', stopAutoPlay);
    }
});
    