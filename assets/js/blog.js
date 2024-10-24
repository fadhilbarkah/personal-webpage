const postsPerPage = 6;
let currentPage = 1;
let blogPosts = [];

// Fetch posts from Vercel proxy
async function fetchBlogPosts() {
    try {
        const response = await fetch('https://blog-proxy-ecru.vercel.app/api/posts');
        const data = await response.json();

        // Pastikan data items ada
        if (data.items && data.items.length) {
            // Mengurutkan posts berdasarkan tanggal terbaru terlebih dahulu
            blogPosts = data.items.sort((a, b) => new Date(b.fields.date) - new Date(a.fields.date));
            displayPosts();
            setupPagination();
        } else {
            displayNoPosts();
        }
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        displayError();
    }
}

function displayPosts() {
    const blogPostsContainer = document.getElementById('blogPosts');
    blogPostsContainer.innerHTML = ''; // Kosongkan container

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, blogPosts.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const post = blogPosts[i].fields;
        const { title, permalink, date, category, shortDescription, thumbnailUrl } = post;

        const postHtml = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="col-auto d-none d-lg-block">
                        <img src="${thumbnailUrl || 'https://placehold.co/600x400/lightgray/white?text=No+Image'}" class="card-img-top" alt="${title}" style="height: 225px; object-fit: cover;">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong class="d-inline-block mb-2 text-success">${category || 'Uncategorized'}</strong>
                            <small class="text-muted">${formatDate(date)}</small>
                        </div>
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${shortDescription || ''}</p>
                        <a href="article.html?permalink=${permalink}" class="btn btn-outline-primary mt-auto">Continue reading</a>
                    </div>
                </div>
            </div>
        `;
        
        blogPostsContainer.innerHTML += postHtml;
    }
}

function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Kosongkan pagination

    const totalPages = Math.ceil(blogPosts.length / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = `btn btn-outline-secondary me-2 ${i === currentPage ? 'active' : ''}`;
        
        pageButton.onclick = () => {
            currentPage = i;
            displayPosts();
            setupPagination(); // Update pagination setelah memilih halaman baru
        };
        paginationContainer.appendChild(pageButton);
    }
}

function displayNoPosts() {
    const blogPostsContainer = document.getElementById('blogPosts');
    blogPostsContainer.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning" role="alert">
                No blog posts available at the moment.
            </div>
        </div>
    `;
}

function displayError() {
    document.getElementById('blogPosts').innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger" role="alert">
                Failed to load blog posts. Please try again later.
            </div>
        </div>
    `;
}

// Format date function tetap sama
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Load posts when page loads
fetchBlogPosts();