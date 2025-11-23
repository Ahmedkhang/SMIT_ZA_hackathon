let posts = JSON.parse(localStorage.getItem('posts')) || [];
let searchQuery = "";
let sortOption = "latest";
let editingPostId = null;

// Toggle Forms
function showLogin() {
  document.getElementById('signup-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
}

function showSignup() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('signup-form').classList.remove('hidden');
}

// Signup
function handleSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (!name || !email || !password){

       alert("All fields required!");
       return;
  } 
  let users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.find(u => u.email === email)) return alert("Email already exists!");

  users.push({
     name,
     email, 
     password });
  localStorage.setItem('users', JSON.stringify(users));
  alert("Signup successful! Now login");
  showLogin();
}

// Login
function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return alert("Wrong email or password!");
  localStorage.setItem('currentUser', JSON.stringify(user));
  loadApp();
}

// Load Main App
function loadApp() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('app-section').classList.remove('hidden');

  const user = JSON.parse(localStorage.getItem('currentUser'));
  document.getElementById('sidebar-user-name').textContent = user.name;
  document.getElementById('sidebar-user-email').textContent = user.email;

  renderPosts();
}

// Logout
function logout() {
  localStorage.removeItem('currentUser');
  location.reload();
}

// Create or Update Post
function createPost() {
  const text = document.getElementById('post-text').value.trim();
  const image = document.getElementById('post-image').value.trim();
  if (!text) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if(editingPostId){
    // EDIT POST
    posts = posts.map(p => p.id === editingPostId ? {...p, text, image} : p);
    editingPostId = null;
  } else {
    // NEW POST
    const newPost = {
      id: Date.now(),
      text,
      image,
      author: currentUser.name,
      likes: 0,
      timestamp: new Date().toISOString()
    };
    posts.unshift(newPost);
  }

  localStorage.setItem('posts', JSON.stringify(posts));
  document.getElementById('post-text').value = "";
  document.getElementById('post-image').value = "";
  document.getElementById('create-post-form').classList.add("hidden");
  renderPosts();
}

// Render Posts
function renderPosts() {
  const container = document.getElementById('posts-container');
  container.innerHTML = "";
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  let filteredPosts = posts.filter(p => p.text.toLowerCase().includes(searchQuery.toLowerCase()));

  if(sortOption === "latest") filteredPosts.sort((a,b)=> new Date(b.timestamp)-new Date(a.timestamp));
  if(sortOption === "oldest") filteredPosts.sort((a,b)=> new Date(a.timestamp)-new Date(b.timestamp));
  if(sortOption === "most-liked") filteredPosts.sort((a,b)=> b.likes - a.likes);

  filteredPosts.forEach(post => {
    const div = document.createElement('div');
    div.className = "bg-white rounded-xl shadow-md p-6 mb-4";

    div.innerHTML = `
      <strong>${post.author}</strong>
      <span class="text-gray-500 text-sm"> • ${new Date(post.timestamp).toLocaleString()}</span>
      <p class="mt-3">${post.text}</p>
      ${post.image ? `<img src="${post.image}" class="mt-4 w-full rounded-xl"/>` : ''}
      <div class="flex gap-4 mt-4">
        <button onclick="toggleLike(${post.id})" class="text-red-500 font-bold">
           ❤️ ${post.likes} Likes
        </button>
        ${post.author === currentUser.name ? `<button onclick="editPost(${post.id})" class="text-blue-600 font-semibold">Edit</button>` : ''}
        ${post.author === currentUser.name ? `<button onclick="deletePost(${post.id})" class="text-red-600">Delete</button>` : ''}
      </div>
    `;
    container.appendChild(div);
  });
}

// Like
function toggleLike(id) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  posts = posts.map(post => {
    if(post.id === id){
      if(!post.likedBy) post.likedBy = [];

      const userIndex = post.likedBy.indexOf(currentUser.email);
      if(userIndex === -1){
        // User has not liked yet
        post.likes += 1;
        post.likedBy.push(currentUser.email);
      } else {
        // User already liked, remove like
        post.likes -= 1;
        post.likedBy.splice(userIndex, 1);
      }
    }
    return post;
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
}


// Delete
function deletePost(id){
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const post = posts.find(p=> p.id === id);
  if(post.author !== currentUser.name) return alert("You can only delete your own posts!");
  if(confirm("Delete this post?")){
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
}

// Edit
function editPost(id){
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const post = posts.find(p => p.id === id);
  if(post.author !== currentUser.name) return alert("You can only edit your own posts!");
  editingPostId = id;
  document.getElementById("post-text").value = post.text;
  document.getElementById("post-image").value = post.image || "";
  document.getElementById("create-post-form").classList.remove("hidden");
}

// Toggle Post Form
function togglePostForm(){
  document.getElementById("create-post-form").classList.toggle("hidden");
}

// Search
document.getElementById("search-bar").addEventListener("keyup", e=>{
  searchQuery = e.target.value;
  renderPosts();
});

// Sort
document.getElementById("sort-select").addEventListener("change", e=>{
  sortOption = e.target.value;
  renderPosts();
});

// Auto load app
window.onload = ()=>{
  if(localStorage.getItem("currentUser")){
    loadApp();
  }
};
