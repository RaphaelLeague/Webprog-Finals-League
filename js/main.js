document.addEventListener('DOMContentLoaded', () => {
    const book = document.getElementById("book");
    const pages = document.querySelectorAll(".page");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");

    let currentLocation = 1;
    let numOfPages = pages.length;

    // Handles the stacking layers correctly as you flip
    function updateZIndex() {
        pages.forEach((page, index) => {
            if (index < currentLocation - 1) {
                page.style.zIndex = index + 1; // Left side
            } else {
                page.style.zIndex = numOfPages - index; // Right side
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

    function goPrevPage(e) {
        if (currentLocation > 1) {
            // Check for the Reset condition on the final button
            if (currentLocation > numOfPages && e.target.closest('.reset-trigger')) {
                resetBook();
                return;
            }

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
    prevBtns.forEach(btn => btn.addEventListener("click", (e) => goPrevPage(e)));

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