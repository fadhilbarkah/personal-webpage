// Fetch posts from Vercel proxy
async function fetchBlogPosts() {
    try {
        const response = await fetch('https://blog-proxy-ecru.vercel.app/api/posts');
        const data = await response.json();

        const blogPostsContainer = document.getElementById('blogPosts');
        
        // Pastikan data items ada
        if (data.items && data.items.length) {
            // Filter hanya postingan yang ditandai sebagai featured
            const featuredPosts = data.items.filter(post => post.fields.featuredPost === true).slice(0, 3); // Maks postingan
            
            if (featuredPosts.length) {
                featuredPosts.forEach(post => {
                    const { title, permalink, date, category, shortDescription, thumbnailUrl } = post.fields;
                    
                    // Gunakan thumbnailUrl yang baru ditambahkan atau placeholder jika tidak ada
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
                });
            } else {
                // Jika tidak ada featured post
                blogPostsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-warning" role="alert">
                            No featured blog posts available at the moment.
                        </div>
                    </div>
                `;
            }
        } else {
            // Jika tidak ada post
            blogPostsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning" role="alert">
                        No blog posts available at the moment.
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        document.getElementById('blogPosts').innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    Failed to load blog posts. Please try again later.
                </div>
            </div>
        `;
    }
}

// Format date function tetap sama
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Load posts when page loads
fetchBlogPosts();