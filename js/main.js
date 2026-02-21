document.addEventListener('DOMContentLoaded', () => {

    const book = document.getElementById("book");
    const pages = document.querySelectorAll(".page");
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    
    let currentLocation = 1;
    let numOfPages = pages.length;
    let maxLocation = numOfPages + 1;

    pages.forEach((page, index) => {
        page.style.zIndex = numOfPages - index;
    });

    function goNextPage() {
        if(currentLocation < maxLocation) {
            if(currentLocation === 1) {
                book.style.transform = "translateX(0)"; 
            }
            
            const currentPage = pages[currentLocation - 1];
            currentPage.classList.add("flipped");
            currentPage.style.zIndex = currentLocation;
            
            if(currentLocation === numOfPages) {
                book.style.transform = "translateX(-200px)"; 
            }
            currentLocation++;
        }
    }

    function goPrevPage() {
        if(currentLocation > 1) {
            let prevLocation = currentLocation - 1;
            
            if(prevLocation === numOfPages) {
                book.style.transform = "translateX(0)"; 
            }
            
            const prevPage = pages[prevLocation - 1];
            prevPage.classList.remove("flipped");
            prevPage.style.zIndex = maxLocation - prevLocation;
            
            if(prevLocation === 1) {
                book.style.transform = "translateX(200px)"; 
            }
            currentLocation--;
        }
    }

    nextBtns.forEach(btn => btn.addEventListener('click', goNextPage));
    prevBtns.forEach(btn => btn.addEventListener('click', goPrevPage));

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
                    formStatus.style.color = '#c0392b'; 
                } else {
                    formStatus.textContent = 'Message securely saved!';
                    formStatus.style.color = '#27ae60'; 
                    contactForm.reset(); 
                }

                submitBtn.textContent = 'Send to Database';
                submitBtn.disabled = false;
            });
        }
    }
});