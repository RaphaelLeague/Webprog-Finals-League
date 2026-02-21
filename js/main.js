document.addEventListener('DOMContentLoaded', () => {
    const book = document.getElementById("book");
    const pages = document.querySelectorAll(".page");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    
    let currentLocation = 1;
    let numOfPages = pages.length;
    let maxLocation = numOfPages + 1;

    // Set initial stack
    pages.forEach((page, index) => {
        page.style.zIndex = numOfPages - index;
    });

    function goNextPage() {
        if(currentLocation < maxLocation) {
            const currentPage = pages[currentLocation - 1];
            
            if(currentLocation === 1) {
                book.style.transform = "translateX(0)";
            }
            
            currentPage.classList.add("flipped");
            // Set z-index after half the transition for smoothness
            setTimeout(() => {
                currentPage.style.zIndex = currentLocation;
            }, 600);
            
            if(currentLocation === numOfPages) {
                book.style.transform = "translateX(-200px)";
            }
            currentLocation++;
        }
    }

    function goPrevPage() {
        if(currentLocation > 1) {
            let prevLocation = currentLocation - 1;
            const prevPage = pages[prevLocation - 1];
            
            if(prevLocation === numOfPages) {
                book.style.transform = "translateX(0)";
            }
            
            prevPage.classList.remove("flipped");
            setTimeout(() => {
                prevPage.style.zIndex = maxLocation - prevLocation;
            }, 600);
            
            if(prevLocation === 1) {
                book.style.transform = "translateX(200px)";
            }
            currentLocation--;
        }
    }

    nextBtns.forEach(btn => btn.addEventListener('click', goNextPage));
    prevBtns.forEach(btn => btn.addEventListener('click', goPrevPage));

    // Supabase
    const supabaseUrl = 'https://safdltefbgdidkrwnjyf.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZmRsdGVmYmdkaWRrcnduanlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NzgxMjIsImV4cCI6MjA4NzI1NDEyMn0._Ya4kMNQ0FIcQ36tvUJE1LTzqTsqqnNAr9w34lBf8y0';
    
    if (typeof supabase !== 'undefined') {
        const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = document.getElementById('submitBtn');
                submitBtn.disabled = true;
                
                const { error } = await _supabase.from('messages').insert([{ 
                    name: document.getElementById('senderName').value,
                    email: document.getElementById('senderEmail').value,
                    message: document.getElementById('senderMessage').value
                }]);

                if (!error) {
                    document.getElementById('formStatus').textContent = "Saved!";
                    contactForm.reset();
                }
                submitBtn.disabled = false;
            });
        }
    }
});