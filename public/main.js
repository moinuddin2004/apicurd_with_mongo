
// Function to create a new post
function createPost() {
    const postTitle = document.querySelector("#postTitle").value;
    const postText = document.querySelector("#postText").value;
    const resultDiv = document.querySelector("#result");

    if (!postTitle || !postText) {
        resultDiv.textContent = 'Title and Text are required.';
        return;
    }

    axios.post(`./api/v1/post`, {
        title: postTitle,
        text: postText
    })
    .then(function (response) {
        console.log(response.data);
        resultDiv.textContent = 'Post created successfully.';
        document.querySelector("#postTitle").value = '';
        document.querySelector("#postText").value = '';
        getAllPost();
    })
    .catch(function (error) {
        console.log(error);
        resultDiv.textContent = 'Error in post submission';
    });
}

// Function to get all posts and render them
function getAllPost() {
    const postsDiv = document.querySelector("#posts");
    axios.get(`./api/v1/posts`)
    .then(function (response) {
        console.log(response.data);

        if (response.data.length === 0) {
            postsDiv.innerHTML = 'No posts available.';
            return;
        }

        // Clear the existing content of the postsDiv
        postsDiv.innerHTML = "";

        // Render the new posts and append them to the postsDiv
        const postCardsHTML = response.data.map(data => renderPostCard(data)).join('');
        postsDiv.innerHTML = postCardsHTML;
    })
    .catch(function (error) {
        console.log(error);
        postsDiv.textContent = 'Error in fetching posts';
    });
}

// Function to render a single post card
function renderPostCard(data) {
    const postCard = `
        <div class="post-Card">
            <div class="post-Card-title">${data.title}</div>
            <div class="post-Card-content">${data.text}</div>
            <div>
                <button class="edit-button" ref="${data._id}" id="edit">Edit Post</button>
                <button class="delete-button" ref="${data._id}" id="del">Delete</button>
            </div>
        </div>
    `;
    return postCard;
}

// Function to edit a post
function edit(event) {
    const theRef = event.target.getAttribute('ref');
    const title = event.target.parentNode.parentNode.querySelector(".post-Card-title").textContent;
    const text = event.target.parentNode.parentNode.querySelector(".post-Card-content").textContent;
    const parentDiv = event.target.parentNode.parentNode;

    parentDiv.innerHTML = "";

    const editTitle = document.createElement('input');
    editTitle.type = 'text';
    editTitle.value = title;

    const editText = document.createElement('textarea');
    editText.value = text;

    const saveButton = document.createElement('button');
    saveButton.innerHTML = 'Save';
    saveButton.setAttribute('referer', theRef);
    saveButton.addEventListener('click', save);

    parentDiv.appendChild(editTitle);
    parentDiv.appendChild(editText);
    parentDiv.appendChild(saveButton);
}

// Function to save the edited post
function save(event) {
    const editRef = event.target.getAttribute('referer');
    const theTitle = event.target.parentNode.firstChild.value;
    const theText = event.target.parentNode.children[1].value;

    axios.put(`/api/v1/post/edit/${editRef}`, {
        title: theTitle,
        text: theText,
    })
    .then(function (response) {
        console.log("done");
        getAllPost();
    })
    .catch(function (error) {
        console.log(error);
    });
}

// Function to delete a post
function deletePost(event) {
    const delRef = event.target.getAttribute('ref');
    axios.delete(`/api/v1/post/delete/${delRef}`)
    .then(function (response) {
        console.log("deleted");
        getAllPost();
    })
    .catch(function (error) {
        console.log(error);
    });
}

// Function to initialize the application
function init() {
    // Add event listener for the create post form
    const createPostForm = document.querySelector("#the-form form");
    createPostForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    // Call the getAllPost function on page load (only once)
    getAllPost();

    // Add event listener to the posts container for handling "Edit" and "Delete" button clicks
    const postsDiv = document.querySelector("#posts");

    // Remove existing event listeners to avoid duplicate actions
    postsDiv.removeEventListener("click", edit);
    postsDiv.removeEventListener("click", deletePost);

    // Add new event listener
    postsDiv.addEventListener("click", function (event) {
        const target = event.target;
        if (target.classList.contains("edit-button")) {
            edit(event);
        } else if (target.classList.contains("delete-button")) {
            deletePost(event);
        }
    });
}

// Call the init function on page load
window.onload = init;
