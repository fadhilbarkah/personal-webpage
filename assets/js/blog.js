    // Initialize Contentful Client
    const client = contentful.createClient({
        space: 'lwdvl28ri311',
        accessToken: '__CONTENTFUL_ACCESS_TOKEN__'  // Gunakan placeholder khusus
    });

    // Format date function
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    // Fetch and display blog posts
    async function fetchBlogPosts() {
        try {
            const response = await client.getEntries({
                content_type: 'blogPost',
                order: '-fields.date'  // Sort by date descending
            });

            const blogPostsContainer = document.getElementById('blogPosts');
            
            response.items.forEach(post => {
                const { title, permalink, date, category, shortDescription, thumbnail } = post.fields;
                
                // Get thumbnail URL or use placeholder
                const thumbnailUrl = thumbnail?.fields?.file?.url 
                    ? `https:${thumbnail.fields.file.url}`
                    : 'https://placehold.co/600x400/lightgray/white?text=No+Image';

                const postHtml = `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100">
                            <div class="col-auto d-none d-lg-block">
                            <img src="${thumbnailUrl}" class="card-img-top" alt="${title}" style="height: 225px; object-fit: cover;">
                            </div>
                            <div class="card-body d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <strong class="d-inline-block mb-2 text-success">${category || 'Uncategorized'}</strong>
                                    <small class="text-muted">${formatDate(date)}</small>
                                </div>
                                <h5 class="card-title">${title}</h5>
                                <p class="card-text">${shortDescription || ''}</p>
                                <a href="#" class="btn btn-outline-primary mt-auto">Continue reading</a>
                            </div>
                        </div>
                    </div>
                `;
                
                blogPostsContainer.innerHTML += postHtml;
            });
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

    // Load posts when page loads
    fetchBlogPosts();