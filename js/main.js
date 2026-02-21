document.addEventListener('DOMContentLoaded', () => {
    const book = document.getElementById("book");
    const pages = document.querySelectorAll(".page");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");

    let currentLocation = 1;
    let numOfPages = pages.length;

    // Initial Stack
    function setInitialStack() {
        pages.forEach((page, index) => { 
            page.style.zIndex = numOfPages - index; 
        });
    }
    setInitialStack();

    function goNextPage() {
        if (currentLocation <= numOfPages) {
            const page = pages[currentLocation - 1];
            page.classList.add("flipped");
            setTimeout(() => { page.style.zIndex = currentLocation; }, 600);
            
            if (currentLocation === 1) book.style.transform = "translateX(0)";
            if (currentLocation === numOfPages) book.style.transform = "translateX(-200px)";
            
            currentLocation++;
        }
    }

    function goPrevPage() {
        // RESET LOGIC: If we are past the last page, loop to front
        if (currentLocation > numOfPages) {
            book.style.transform = "translateX(200px)";
            pages.forEach((page, index) => {
                page.classList.remove("flipped");
                setTimeout(() => { page.style.zIndex = numOfPages - index; }, 600);
            });
            currentLocation = 1;
        } 
        // Normal Prev Logic
        else if (currentLocation > 1) {
            const page = pages[currentLocation - 2];
            page.classList.remove("flipped");
            setTimeout(() => { page.style.zIndex = (numOfPages - currentLocation) + 2; }, 600);
            
            if (currentLocation === 2) book.style.transform = "translateX(200px)";
            currentLocation--;
        }
    }

    nextBtns.forEach(btn => btn.addEventListener("click", goNextPage));
    prevBtns.forEach(btn => btn.addEventListener("click", goPrevPage));

    // Supabase
    const _supabase = supabase.createClient('https://safdltefbgdidkrwnjyf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZmRsdGVmYmdkaWRrcnduanlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NzgxMjIsImV4cCI6MjA4NzI1NDEyMn0._Ya4kMNQ0FIcQ36tvUJE1LTzqTsqqnNAr9w34lBf8y0');
    
    document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        const { error } = await _supabase.from('messages').insert([{
            name: document.getElementById('senderName').value,
            email: document.getElementById('senderEmail').value,
            message: document.getElementById('senderMessage').value
        }]);
        document.getElementById('formStatus').textContent = error ? "Error!" : "Message Saved!";
        btn.disabled = false;
    });
});