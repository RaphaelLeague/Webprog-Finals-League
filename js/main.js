document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. 3D BOOK FLIPPING LOGIC
    // ==========================================
    const book = document.getElementById("book");
    const pages = document.querySelectorAll(".page");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    
    let currentLocation = 1;
    let numOfPages = pages.length;
    let maxLocation = numOfPages + 1;

    // Initialize Z-indexes so Page 1 is on top, Page 2 is below it, etc.
    pages.forEach((page, index) => {
        page.style.zIndex = numOfPages - index;
    });

    function goNextPage() {
        if(currentLocation < maxLocation) {
            // If opening the cover, shift book to center
            if(currentLocation === 1) {
                book.style.transform = "translateX(0)"; 
            }
            
            // Flip the page and set its z-index so it stacks correctly on the left
            const currentPage = pages[currentLocation - 1];
            currentPage.classList.add("flipped");
            currentPage.style.zIndex = currentLocation;
            
            // If closing the back cover, shift book to the left
            if(currentLocation === numOfPages) {
                book.style.transform = "translateX(-200px)"; 
            }
            currentLocation++;
        }
    }

    function goPrevPage() {
        if(currentLocation > 1) {
            let prevLocation = currentLocation - 1;
            
            // If opening from the back cover, shift book to center
            if(prevLocation === numOfPages) {
                book.style.transform = "translateX(0)"; 
            }
            
            // Un-flip the page and restore its right-side z-index
            const prevPage = pages[prevLocation - 1];
            prevPage.classList.remove("flipped");
            prevPage.style.zIndex = maxLocation - prevLocation;
            
            // If closing the front cover, shift book back to the right
            if(prevLocation === 1) {
                book.style.transform = "translateX(200px)"; 
            }
            currentLocation--;
        }
    }

    // Attach click events
    nextBtns.forEach(btn => btn.addEventListener('click', goNextPage));
    prevBtns.forEach(btn => btn.addEventListener('click', goPrevPage));

    // ==========================================
    // 2. HOBBY FILTERING LOGIC
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // ==========================================
    // 3. SUPABASE CONTACT FORM LOGIC
    // ==========================================
    // TODO: Paste your URL and Key back in here!
    const supabaseUrl = 'YOUR_SUPABASE_URL'; 
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; 
    
    if (typeof supabase !== 'undefined') {
        const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                formStatus.textContent = '';

                const name = document.getElementById('senderName').value;
                const email = document.getElementById('senderEmail').value;
                const message = document.getElementById('senderMessage').value;

                const { error } = await supabaseClient
                    .from('messages')
                    .insert([{ name: name, email: email, message: message }]);

                if (error) {
                    console.error('Error:', error);
                    formStatus.textContent = 'Database error. Please try again.';
                    formStatus.style.color = '#b71c1c'; 
                } else {
                    formStatus.textContent = 'Message securely saved!';
                    formStatus.style.color = '#2e7d32'; 
                    contactForm.reset(); 
                }

                submitBtn.textContent = 'Send to Database';
                submitBtn.disabled = false;
            });
        }
    }
});