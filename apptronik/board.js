import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, where } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import firebaseConfig from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsCol = collection(db, "posts");

document.addEventListener('DOMContentLoaded', () => {
    const boardBody = document.getElementById('board-body');
    const writeBtn = document.getElementById('write-btn');
    const writeModal = document.getElementById('write-modal');
    const viewModal = document.getElementById('view-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const writeForm = document.getElementById('write-form');
    
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    const MASTER_PW = '20252578';
    let currentPostId = null;
    let currentPostData = null;
    let isEditing = false;
    let currentCategory = 'all';

    async function fetchPosts() {
        boardBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">로딩 중...</td></tr>';
        
        let q;
        if (currentCategory === 'all') {
            q = query(postsCol, orderBy("createdAt", "desc"));
        } else {
            q = query(postsCol, where("category", "==", currentCategory), orderBy("createdAt", "desc"));
        }

        const querySnapshot = await getDocs(q);
        boardBody.innerHTML = '';
        
        const posts = [];
        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
        });

        if (posts.length === 0) {
            boardBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">게시글이 없습니다.</td></tr>';
            return;
        }

        posts.forEach((post, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${posts.length - index}</td>
                <td><span class="tag ${post.category}">${post.category === 'tech' ? '기술 문서' : '인사이트'}</span></td>
                <td>${post.title}</td>
                <td>${post.author || '사용자'}</td>
                <td>${post.date}</td>
            `;
            tr.addEventListener('click', () => openViewModal(post));
            boardBody.appendChild(tr);
        });
    }

    function openViewModal(post) {
        currentPostId = post.id;
        currentPostData = post;
        document.getElementById('view-title').textContent = post.title;
        document.getElementById('view-category').textContent = post.category === 'tech' ? '기술 문서' : '인사이트';
        document.getElementById('view-category').className = `tag ${post.category}`;
        document.getElementById('view-date').textContent = post.date;
        document.getElementById('view-content').textContent = post.content;
        viewModal.classList.add('active');
    }

    writeBtn.addEventListener('click', () => {
        isEditing = false;
        writeForm.reset();
        document.querySelector('#write-modal h3').textContent = '게시글 작성';
        writeModal.classList.add('active');
    });

    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            writeModal.classList.remove('active');
            viewModal.classList.remove('active');
        });
    });

    // Delete Logic
    deleteBtn.addEventListener('click', async () => {
        const pw = prompt('비밀번호를 입력하세요:');
        if (pw === currentPostData.password || pw === MASTER_PW) {
            if (confirm('정말로 삭제하시겠습니까?')) {
                await deleteDoc(doc(db, "posts", currentPostId));
                fetchPosts();
                viewModal.classList.remove('active');
                alert('삭제되었습니다.');
            }
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    });

    // Edit Logic
    editBtn.addEventListener('click', () => {
        const pw = prompt('비밀번호를 입력하세요:');
        if (pw === currentPostData.password || pw === MASTER_PW) {
            isEditing = true;
            document.querySelector('#write-modal h3').textContent = '게시글 수정';
            document.getElementById('post-category').value = currentPostData.category;
            document.getElementById('post-title').value = currentPostData.title;
            document.getElementById('post-content').value = currentPostData.content;
            document.getElementById('post-password').value = currentPostData.password;
            
            viewModal.classList.remove('active');
            writeModal.classList.add('active');
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    });

    writeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const postData = {
            category: document.getElementById('post-category').value,
            title: document.getElementById('post-title').value,
            content: document.getElementById('post-content').value,
            password: document.getElementById('post-password').value,
            date: new Date().toISOString().split('T')[0],
            createdAt: Date.now()
        };
        
        try {
            if (isEditing) {
                await updateDoc(doc(db, "posts", currentPostId), postData);
            } else {
                postData.author = '사용자';
                await addDoc(postsCol, postData);
            }
            
            writeModal.classList.remove('active');
            writeForm.reset();
            fetchPosts();
        } catch (err) {
            console.error("Error saving post:", err);
            alert("저장 중 오류가 발생했습니다.");
        }
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            fetchPosts();
        });
    });

    fetchPosts();
});
