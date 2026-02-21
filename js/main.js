document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. BOOK PAGE TURNING LOGIC
    // =========================================
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.flipping-page');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Remove active class from all buttons
            navButtons.forEach(b => b.classList.remove('active'));
            // 2. Add active class to clicked button
            btn.classList.add('active');

            // 3. Find the target page
            const targetId = btn.getAttribute('data-target');
            
            // 4. Flip out current pages, flip in the new page
            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.add('active'); // Rotates in
                } else {
                    page.classList.remove('active'); // Rotates out
                }
            });
        });
    });

    // =========================================
    // 2. HOBBY FILTERING LOGIC
    // =========================================
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

    // =========================================
    // 3. SUPABASE CONTACT FORM LOGIC
    // =========================================
    // TODO: Paste your URL and Key back in here before pushing!
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
                submitBtn.textContent = 'Sending to DB...';
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
                    formStatus.textContent = 'Message securely saved to database!';
                    formStatus.style.color = '#2e7d32'; 
                    contactForm.reset(); 
                }

                submitBtn.textContent = 'Send to Database';
                submitBtn.disabled = false;
            });
        }
    } else {
        console.error("Supabase failed to load.");
    }
});