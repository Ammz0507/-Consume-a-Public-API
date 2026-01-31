class ApiFetchHub {
    constructor() {
        this.currentTab = 'posts';
        this.data = {
            posts: [],
            users: [],
            todos: []
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTab('posts');
    }

    bindEvents() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadTab(this.currentTab);
        });
    }

    async fetchData(endpoint) {
        this.showLoading(true);
        
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.slice(0, 9); 
        } catch (error) {
            console.error('Fetch error:', error);
            this.showError(error.message);
            return [];
        } finally {
            this.showLoading(false);
        }
    }

    async loadTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        switch(tab) {
            case 'posts':
                this.data.posts = await this.fetchData('posts');
                this.renderPosts();
                break;
            case 'users':
                this.data.users = await this.fetchData('users');
                this.renderUsers();
                break;
            case 'todos':
                this.data.todos = await this.fetchData('todos');
                this.renderTodos();
                break;
        }
    }

    switchTab(tab) {
        document.getElementById('content').innerHTML = '';
        this.loadTab(tab);
    }

    renderPosts() {
        const container = document.getElementById('content');
        container.innerHTML = this.data.posts.map(post => `
            <div class="card post-card">
                <h3>📝 ${post.title.substring(0, 40)}${post.title.length > 40 ? '...' : ''}</h3>
                <p>${post.body.substring(0, 150)}${post.body.length > 150 ? '...' : ''}</p>
                <div class="user-info">
                    <span>👤 User ID: ${post.userId}</span>
                    <span>🆔 Post ID: ${post.id}</span>
                </div>
            </div>
        `).join('');
    }

    renderUsers() {
        const container = document.getElementById('content');
        container.innerHTML = this.data.users.map(user => `
            <div class="card user-card">
                <h3>👤 ${user.name}</h3>
                <p><strong>@${user.username}</strong></p>
                <p>📧 ${user.email}</p>
                <div class="user-info">
                    <span>📱 ${user.phone}</span>
                    <span>🌍 ${user.address.city}</span>
                </div>
            </div>
        `).join('');
    }

    renderTodos() {
        const container = document.getElementById('content');
        container.innerHTML = this.data.todos.map(todo => `
            <div class="card todo-card">
                <h3>${todo.completed ? '✅' : '⏳'} ${todo.title.substring(0, 50)}${todo.title.length > 50 ? '...' : ''}</h3>
                <div class="user-info">
                    <span>👤 User ID: ${todo.userId}</span>
                    <span class="status ${todo.completed ? 'completed' : 'pending'}">
                        ${todo.completed ? 'Completed' : 'Pending'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    showLoading(show) {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        document.getElementById('content').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #ff6b6b;">
                <h2>❌ Error loading data</h2>
                <p>${message}</p>
                <button class="refresh-btn" onclick="apiHub.loadTab('${this.currentTab}')">Try Again</button>
            </div>
        `;
    }
}

const apiHub = new ApiFetchHub();
