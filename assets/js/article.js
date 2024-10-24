// Function to get the permalink from query parameters
function getPermalinkFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('permalink');
}

// Function to render article content from the rich text field
function renderArticleContent(article) {
    // Rich Text Options
    const options = {
        renderNode: {
            'embedded-asset-block': (node) => {
                const { title, description, file } = node.data.target.fields;
                const imageUrl = `https:${file.url}`;
                return `<img src="${imageUrl}" alt="${description || title || 'Embedded Asset'}" class="img-fluid rounded" />`;
            },
            'heading-1': (node, next) => `<h1 class="mt-4 mb-3">${next(node.content)}</h1>`,
            'heading-2': (node, next) => `<h2 class="mt-4 mb-3">${next(node.content)}</h2>`,
            'paragraph': (node, next) => `<p>${next(node.content)}</p>`,
            'unordered-list': (node, next) => `<ul class="mb-4">${next(node.content)}</ul>`,
            'list-item': (node, next) => `<li>${next(node.content)}</li>`,
            'hyperlink': (node, next) => `<a href="${node.data.uri}" target="_blank" rel="noopener noreferrer">${next(node.content)}</a>`
        },
        renderMark: {
            'bold': text => `<strong>${text}</strong>`,
            'italic': text => `<em>${text}</em>`,
        }
    };

    return documentToHtmlString(article, options);
}

// Function to fetch single blog post from API by permalink
async function fetchBlogPost() {
    const permalink = getPermalinkFromUrl(); // Get the permalink from the URL
    if (!permalink) {
        document.getElementById('articleContent').innerHTML = `
            <div class="alert alert-warning" role="alert">
                No permalink provided.
            </div>
        `;
        return;
    }

    try {
        // Fetch article from API using permalink
        const response = await fetch(`https://blog-proxy-ecru.vercel.app/api/posts?permalink=${permalink}`);
        const data = await response.json();

        if (!data.items || !data.items.length) {
            document.getElementById('articleContent').innerHTML = `
                <div class="alert alert-warning" role="alert">
                    Article not found.
                </div>
            `;
            return;
        }

        const post = data.items[0]; // Get the first article that matches the permalink
        const { title, date, article, thumbnailUrl } = post.fields;

        // Format date
        const formattedDate = new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

        // Update the HTML with article data
        document.getElementById('articleTitle').innerHTML = title;
        document.getElementById('articleDate').innerHTML = formattedDate;
        document.getElementById('articleThumbnail').innerHTML = `
            <img src="${thumbnailUrl || 'https://placehold.co/800x400/lightgray/white?text=No+Image'}" width="75%" height="auto" alt="${title}" class="img-fluid">
        `;

        // Render the article content
        const contentHtml = renderArticleContent(article);
        document.getElementById('articleContent').innerHTML = contentHtml;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        document.getElementById('articleContent').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load article. Please try again later.
            </div>
        `;
    }
}

// Call the function to load the article when the page loads
fetchBlogPost();