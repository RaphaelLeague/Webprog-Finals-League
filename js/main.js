document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FILTERING LOGIC ---
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

            // Highlight active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // --- 2. SUPABASE CONTACT FORM LOGIC ---
    
    // Initialize Supabase Client
    // TODO: Replace these with your actual keys from the Supabase Dashboard
    const supabaseUrl = 'https://safdltefbgdidkrwnjyf.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZmRsdGVmYmdkaWRrcnduanlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NzgxMjIsImV4cCI6MjA4NzI1NDEyMn0._Ya4kMNQ0FIcQ36tvUJE1LTzqTsqqnNAr9w34lBf8y0';
    
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the page from reloading

        // Change button text while loading
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        formStatus.textContent = '';

        // Get the values from the form inputs
        const name = document.getElementById('senderName').value;
        const email = document.getElementById('senderEmail').value;
        const message = document.getElementById('senderMessage').value;

        // Insert into the 'messages' table
        const { error } = await supabaseClient
            .from('messages')
            .insert([
                { name: name, email: email, message: message }
            ]);

        // Handle success or error
        if (error) {
            console.error('Error:', error);
            formStatus.textContent = 'Something went wrong. Please try again.';
            formStatus.style.color = '#ff6b6b'; // Red color for error
        } else {
            formStatus.textContent = 'Message sent successfully!';
            formStatus.style.color = '#51cf66'; // Green color for success
            contactForm.reset(); // Clear the form
        }

        // Reset button
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    });
});