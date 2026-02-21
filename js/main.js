document.addEventListener('DOMContentLoaded', () => {
    const book = document.getElementById("book");
    const pages = document.querySelectorAll(".page");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    const resetTrigger = document.querySelector(".reset-btn-trigger");

    let currentLocation = 1;
    let numOfPages = pages.length;

    // FIX: Redesigned Z-Index logic to ensure flipped pages are always "on top" for clicks
    function updateZIndex() {
        pages.forEach((page, index) => {
            if (index < currentLocation - 1) {
                // Pages on the left (flipped)
                // We add numOfPages to ensure they are higher than anything on the right
                page.style.zIndex = numOfPages + index; 
            } else {
                // Pages on the right (unflipped)
                page.style.zIndex = numOfPages - index;
            }
        });
    }
    updateZIndex();

    function goNextPage() {
        if (currentLocation <= numOfPages) {
            const page = pages[currentLocation - 1];
            page.classList.add("flipped");
            
            if (currentLocation === 1) book.style.transform = "translateX(0)";
            if (currentLocation === numOfPages) book.style.transform = "translateX(-200px)";
            
            currentLocation++;
            setTimeout(updateZIndex, 600);
        }
    }

    function goPrevPage() {
        if (currentLocation > 1) {
            currentLocation--;
            const page = pages[currentLocation - 1];
            page.classList.remove("flipped");

            if (currentLocation === 1) book.style.transform = "translateX(200px)";
            if (currentLocation === numOfPages) book.style.transform = "translateX(0)";
            
            setTimeout(updateZIndex, 600);
        }
    }

    function resetBook() {
        book.style.transform = "translateX(200px)";
        pages.forEach(page => page.classList.remove("flipped"));
        currentLocation = 1;
        setTimeout(updateZIndex, 600);
    }

    nextBtns.forEach(btn => btn.addEventListener("click", goNextPage));
    prevBtns.forEach(btn => btn.addEventListener("click", goPrevPage));
    if(resetTrigger) resetTrigger.addEventListener("click", resetBook);

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