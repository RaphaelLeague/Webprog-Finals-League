document.addEventListener('DOMContentLoaded', () => {
    const book = document.getElementById("book");
    const pages = document.querySelectorAll(".page");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");

    let currentLocation = 1;
    let numOfPages = pages.length;

    // Initial Stack
    function setStack() {
        pages.forEach((page, index) => { 
            page.style.zIndex = numOfPages - index; 
        });
    }
    setStack();

    function goNextPage() {
        if (currentLocation <= numOfPages) {
            const page = pages[currentLocation - 1];
            page.classList.add("flipped");
            
            // Adjust stacking halfway through flip
            setTimeout(() => { 
                page.style.zIndex = currentLocation; 
            }, 600);
            
            if (currentLocation === 1) book.style.transform = "translateX(0)";
            if (currentLocation === numOfPages) book.style.transform = "translateX(-200px)";
            
            currentLocation++;
        }
    }

    function goPrevPage() {
        // RESET TO FRONT if on final page
        if (currentLocation > numOfPages) {
            book.style.transform = "translateX(200px)";
            pages.forEach((page, index) => {
                page.classList.remove("flipped");
                setTimeout(() => { 
                    page.style.zIndex = numOfPages - index; 
                }, 600);
            });
            currentLocation = 1;
        } 
        else if (currentLocation > 1) {
            const page = pages[currentLocation - 2];
            page.classList.remove("flipped");
            
            setTimeout(() => { 
                page.style.zIndex = (numOfPages - currentLocation) + 2; 
            }, 600);
            
            if (currentLocation === 2) book.style.transform = "translateX(200px)";
            currentLocation--;
        }
    }

    nextBtns.forEach(btn => btn.addEventListener("click", goNextPage));
    prevBtns.forEach(btn => btn.addEventListener("click", goPrevPage));

    // Supabase Initialization
    const supabaseUrl = 'https://safdltefbgdidkrwnjyf.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZmRsdGVmYmdkaWRrcnduanlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NzgxMjIsImV4cCI6MjA4NzI1NDEyMn0._Ya4kMNQ0FIcQ36tvUJE1LTzqTsqqnNAr9w34lBf8y0';
    
    if (typeof supabase !== 'undefined') {
        const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');

        contactForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const { error } = await _supabase.from('messages').insert([{
                name: document.getElementById('senderName').value,
                email: document.getElementById('senderEmail').value,
                message: document.getElementById('senderMessage').value
            }]);

            if (error) {
                formStatus.textContent = "Error: Please try again.";
                formStatus.style.color = "red";
            } else {
                formStatus.textContent = "Message saved!";
                formStatus.style.color = "green";
                contactForm.reset();
            }
            submitBtn.textContent = 'Send to Database';
            submitBtn.disabled = false;
        });
    }
});