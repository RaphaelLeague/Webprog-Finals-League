<script setup>
import { ref, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';

// --- 3D BOOK FLIP LOGIC ---
const bookRef = ref(null);
const pages = ref([]);
const currentLocation = ref(1);
const numOfPages = 4;

const updateZIndex = () => {
    pages.value.forEach((page, index) => {
        if (index < currentLocation.value - 1) {
            page.style.zIndex = numOfPages + index; 
        } else {
            page.style.zIndex = numOfPages - index;
        }
    });
};

const goNextPage = () => {
    if (currentLocation.value <= numOfPages) {
        const page = pages.value[currentLocation.value - 1];
        page.classList.add("flipped");
        
        if (currentLocation.value === 1) bookRef.value.style.transform = "translateX(0)";
        if (currentLocation.value === numOfPages) bookRef.value.style.transform = "translateX(200px)";
        
        currentLocation.value++;
        setTimeout(updateZIndex, 600);
    }
};

const goPrevPage = () => {
    if (currentLocation.value > 1) {
        currentLocation.value--;
        const page = pages.value[currentLocation.value - 1];
        page.classList.remove("flipped");

        if (currentLocation.value === 1) bookRef.value.style.transform = "translateX(-200px)";
        if (currentLocation.value === numOfPages) bookRef.value.style.transform = "translateX(0)";
        
        setTimeout(updateZIndex, 600);
    }
};

const resetBook = () => {
    bookRef.value.style.transform = "translateX(-200px)";
    pages.value.forEach(page => page.classList.remove("flipped"));
    currentLocation.value = 1;
    setTimeout(updateZIndex, 600);
};

// --- SUPABASE SETUP ---
const supabaseUrl = 'https://safdltefbgdidkrwnjyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZmRsdGVmYmdkaWRrcnduanlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NzgxMjIsImV4cCI6MjA4NzI1NDEyMn0._Ya4kMNQ0FIcQ36tvUJE1LTzqTsqqnNAr9w34lBf8y0';
const supabase = createClient(supabaseUrl, supabaseKey);

const guestbookMessages = ref([]);

const fetchMessages = async () => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching guestbook:', error);
    } else {
        guestbookMessages.value = data;
    }
};

const senderName = ref('');
const senderEmail = ref('');
const senderMessage = ref('');
const formStatus = ref('');
const isSending = ref(false);

const submitMessage = async () => {
    isSending.value = true;
    formStatus.value = "Sending...";
    
    const { error } = await supabase.from('messages').insert([{
        name: senderName.value,
        email: senderEmail.value,
        message: senderMessage.value
    }]);

    if (error) {
        formStatus.value = "Error saving message!";
        console.error(error);
    } else {
        formStatus.value = "Message securely saved!";
        senderName.value = '';
        senderEmail.value = '';
        senderMessage.value = '';
        
        fetchMessages(); 
    }
    isSending.value = false;
};

onMounted(() => {
    pages.value = document.querySelectorAll('.page');
    updateZIndex();
    fetchMessages(); 
});
</script>

<template>
  <div class="desk">
        <div class="book" ref="bookRef">
            
            <div class="page" id="p1">
                <div class="front cover">
                    <h1>Raphael League</h1>
                    <p class="subtitle">IT Student & Researcher</p>
                    <button @click="goNextPage" class="next-btn open-book-btn">Open Book <i class="fas fa-arrow-right"></i></button>
                </div>
                <div class="back page-content">
                    <img src="https://i.postimg.cc/L5x5WMF6/SONY6273.jpg" alt="Raphael League" class="profile-img">
                    <h2>Raphael Gabriel League</h2>
                    <h3 class="studentschool" style="text-align: center; margin-bottom: 15px;">IT Student @ Asia Pacific College</h3>
                    <p class="bio-text" style="text-align: center;">What's up! I'm Gab. I hate coding but I love to do SQL and research.</p>
                    <div class="page-footer">
                        <button @click="goPrevPage" class="prev-btn"><i class="fas fa-arrow-left"></i> Close</button>
                    </div>
                </div>
            </div>

            <div class="page" id="p2">
                <div class="front page-content">
                    <h2>Background & Projects</h2>
                    <div class="info-block">
                        <h3>Educational Background</h3>
                        <p><strong>STEM</strong><br><span style="color: #888; font-size: 0.9em;">June 2022 - April 2024 (Asia Pacific College)</span></p>
                        <p class="mt-20"><strong>BS Information Technology</strong><br><span style="color: #888; font-size: 0.9em;">2024 - 2028 (Asia Pacific College)</span></p>
                    </div>
                    <div class="info-block mt-20">
                        <h3>Projects</h3>
                        <ul style="list-style-type: square; margin-left: 20px; color: #555; line-height: 1.8;">
                            <li><strong>RamBus:</strong> Developer and Researcher</li>
                            <li><strong>Smoke & Fire Detector:</strong> Developer and Researcher</li>
                        </ul>
                    </div>
                    <div class="page-footer">
                        <button @click="goNextPage" class="next-btn">Turn Page <i class="fas fa-arrow-right"></i></button>
                    </div>
                </div>
                <div class="back page-content">
                    <h2>Hobbies & Interests</h2>
                    <div class="hobbies-list">
                        <div class="hobby-category">
                            <h3><i class="fas fa-book-open"></i> Reading</h3>
                            <div class="hobby-items">
                                <img src="https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1759623080i/28705056.jpg" alt="Reading">
                                <img src="https://i5.walmartimages.com/seo/Dante-s-Inferno-The-Divine-Comedy-Book-One-Paperback-9781434444745_4baa4dbe-24f8-4298-9fa4-30d85dd6d3ce.b162e863409f0d89f6a7ecae3315b229.jpeg" alt="Reading">
                            </div>
                        </div>
                        <div class="hobby-category">
                            <h3><i class="fas fa-gamepad"></i> Gaming</h3>
                            <div class="hobby-items">
                                <img src="https://images.seeklogo.com/logo-png/37/2/valorant-logo-png_seeklogo-379976.png" alt="Gaming">
                                <img src="https://img.playstationtrophies.org/images/2025/08/29/icon/31f7655397589bb36a341c2d8454864d-l.png" alt="Gaming">
                            </div>
                        </div>
                        <div class="hobby-category">
                            <h3><i class="fas fa-music"></i> Music</h3>
                            <div class="hobby-items">
                                <img src="https://upload.wikimedia.org/wikipedia/en/b/b9/Freudian_by_Daniel_Caesar.jpg" alt="Music">
                                <img src="https://upload.wikimedia.org/wikipedia/en/e/eb/Bruno_Mars_-_Doo-Wops_%26_Hooligans.png" alt="Music">
                            </div>
                        </div>
                    </div>
                    <div class="page-footer">
                        <button @click="goPrevPage" class="prev-btn"><i class="fas fa-arrow-left"></i> Prev</button>
                    </div>
                </div>
            </div>

            <div class="page" id="p3">
                <div class="front page-content">
                    <h2>Technical Skills</h2>
                    <div class="skill-list">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/500px-HTML5_logo_and_wordmark.svg.png" alt="HTML">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1452px-CSS3_logo_and_wordmark.svg.png" alt="CSS">
                        <img src="https://1000logos.net/wp-content/uploads/2020/09/JavaScript-Logo.png" alt="JS">
                        <img src="https://p1.hiclipart.com/preview/415/298/342/sql-server-logo-mysql-database-microsoft-sql-server-php-text-line-company-png-clipart.jpg" alt="SQL">
                    </div>
                    <h2 class="mt-20">Soft Skills</h2>
                    <div class="soft-skills">
                        <span>Teamwork</span>
                        <span>Leadership</span>
                        <span>Adaptability</span>
                    </div>
                    <div class="page-footer">
                        <button @click="goNextPage" class="next-btn">Turn Page <i class="fas fa-arrow-right"></i></button>
                    </div>
                </div>
                <div class="back page-content">
                    <h2>Send a Message</h2>
                    <form @submit.prevent="submitMessage" class="contact-form">
                        <input v-model="senderName" type="text" placeholder="Your Name" required>
                        <input v-model="senderEmail" type="email" placeholder="Your Email" required>
                        <textarea v-model="senderMessage" placeholder="Your Message" rows="3" required></textarea>
                        <button type="submit" :disabled="isSending">{{ isSending ? 'Sending...' : 'Send to Database' }}</button>
                        <p style="color: #2e7d32; font-weight: bold; text-align: center;">{{ formStatus }}</p>
                    </form>
                    <div class="page-footer">
                        <button @click="goPrevPage" class="prev-btn"><i class="fas fa-arrow-left"></i> Prev</button>
                    </div>
                </div>
            </div>

            <div class="page" id="p4">
                <div class="front page-content">
                    <h2>Guestbook</h2>
                    
                    <div class="guestbook-container">
                        <div v-if="guestbookMessages.length === 0" style="text-align: center; color: #888; font-style: italic; margin-top: 20px;">
                            No messages yet. Write one on the previous page!
                        </div>
                        
                        <div v-for="msg in guestbookMessages" :key="msg.id" class="guestbook-entry">
                            <strong>{{ msg.name }}</strong> <span style="font-size: 0.85em; color: #888;">says:</span>
                            <p style="margin-top: 4px; font-size: 0.95rem; color: #444;">"{{ msg.message }}"</p>
                        </div>
                    </div>

                    <div class="social-icons">
                        <a href="mailto:raphaelgabriel.league@gmail.com"><i class="fas fa-envelope"></i></a>
                        <a href="https://linkedin.com/in/raphael-league" target="_blank"><i class="fab fa-linkedin"></i></a>
                        <a href="https://github.com/RaphaelLeague" target="_blank"><i class="fab fa-github"></i></a>
                    </div>

                    <div class="page-footer">
                        <button @click="resetBook" class="reset-btn-trigger"><i class="fas fa-undo"></i> Close Book</button>
                    </div>
                </div>
                <div class="back cover" style="position: absolute !important;"></div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.guestbook-container {
    flex-grow: 1;
    overflow-y: auto;
    background: #faf8f2;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px;
    max-height: 250px;
}

.guestbook-container::-webkit-scrollbar { width: 5px; }
.guestbook-container::-webkit-scrollbar-thumb { background: #dcd6c8; border-radius: 4px; }

.guestbook-entry {
    border-bottom: 1px solid #e8e3d3;
    padding-bottom: 12px;
    margin-bottom: 12px;
}
.guestbook-entry:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 25px;
    margin-bottom: 15px;
    font-size: 1.5rem;
}
.social-icons a {
    color: #2c3e50;
    transition: color 0.3s;
}
.social-icons a:hover { color: #d4af37; }
</style>