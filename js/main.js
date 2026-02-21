document.addEventListener('DOMContentLoaded', () => {
    const book = document.getElementById("book");
    const pages = document.querySelectorAll(".page");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");

    let currentLocation = 1;
    let numOfPages = pages.length;

    // Set initial stack z-index
    pages.forEach((page, index) => { 
        page.style.zIndex = numOfPages - index; 
    });

    function goNextPage() {
        if (currentLocation <= numOfPages) {
            const page = pages[currentLocation - 1];
            page.classList.add("flipped");
            
            // Adjust z-index during animation for smoothness
            setTimeout(() => { 
                page.style.zIndex = currentLocation; 
            }, 600);
            
            // Book shifts left when opened, further left when reaching end
            if (currentLocation === 1) book.style.transform = "translateX(0)";
            if (currentLocation === numOfPages) book.style.transform = "translateX(-200px)";
            
            currentLocation++;
        }
    }

    function goPrevPage() {
        if (currentLocation > 1) {
            const page = pages[currentLocation - 2];
            page.classList.remove("flipped");
            
            // Revert z-index during flip back
            setTimeout(() => { 
                page.style.zIndex = (numOfPages - currentLocation) + 2; 
            }, 600);
            
            // Shift book back into center or right cover position
            if (currentLocation === 2) book.style.transform = "translateX(200px)";
            if (currentLocation === numOfPages + 1) book.style.transform = "translateX(0)";
            
            currentLocation--;
        }
    }

    nextBtns.forEach(btn => btn.addEventListener("click", goNextPage));
    prevBtns.forEach(btn => btn.addEventListener("click", goPrevPage));

    // Supabase
    const supabaseUrl = 'https://safdltefbgdidkrwnjyf.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZmRsdGVmYmdkaWRrcnduanlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NzgxMjIsImV4cCI6MjA4NzI1NDEyMn0._Ya4kMNQ0FIcQ36tvUJE1LTzqTsqqnNAr9w34lBf8y0';
    
    if (typeof supabase !== 'undefined') {
        const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
        const contactForm = document.getElementById('contactForm');
        contactForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.disabled = true;
            const { error } = await _supabase.from('messages').insert([{
                name: document.getElementById('senderName').value,
                email: document.getElementById('senderEmail').value,
                message: document.getElementById('senderMessage').value
            }]);
            document.getElementById('formStatus').textContent = error ? "Error!" : "Message Saved!";
            if (!error) contactForm.reset();
            btn.disabled = false;
        });
    }
});