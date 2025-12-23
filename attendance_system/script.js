/**
 * School Attendance System Logic
 */

const STORAGE_KEY_USER = 'attendance_user';
const STORAGE_KEY_ATTENDANCE = 'attendance_records';

// Function to handle login
function handleLogin(event) {
    event.preventDefault();
    const rollNumber = document.getElementById('roll-number').value.trim();
    
    if (!rollNumber) {
        showMessage('Please enter a valid roll number', 'error');
        return;
    }

    // specific mock user or generic
    const user = {
        rollNumber: rollNumber,
        name: `Student ${rollNumber}`, // Mocking a name
        class: 'Class X-A'
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    window.location.href = 'dashboard.html';
}

// Function to load dashboard
function loadDashboard() {
    const userStr = localStorage.getItem(STORAGE_KEY_USER);
    if (!userStr) {
        window.location.href = 'index.html';
        return;
    }

    const user = JSON.parse(userStr);
    
    document.getElementById('student-name').textContent = user.name;
    document.getElementById('student-roll').textContent = `Roll No: ${user.rollNumber}`;
    document.getElementById('student-avatar').textContent = user.name.charAt(0);

    checkAttendanceStatus(user.rollNumber);
}

// Function to check status
function checkAttendanceStatus(rollNumber) {
    const today = new Date().toLocaleDateString();
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY_ATTENDANCE) || '{}');
    
    const userRecords = records[rollNumber] || [];
    const isPresent = userRecords.includes(today);

    updateStatusUI(isPresent);
}

// Function to mark attendance
function markAttendance() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY_USER));
    const today = new Date().toLocaleDateString();
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY_ATTENDANCE) || '{}');
    
    if (!records[user.rollNumber]) {
        records[user.rollNumber] = [];
    }

    if (records[user.rollNumber].includes(today)) {
        showMessage('You have already marked attendance for today!', 'error');
        return;
    }

    records[user.rollNumber].push(today);
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(records));
    
    updateStatusUI(true);
    showMessage('Attendance marked successfully!', 'success');
}

// Helper to update UI based on status
function updateStatusUI(isPresent) {
    const statusEl = document.getElementById('status-badge');
    const markBtn = document.getElementById('mark-btn');

    if (isPresent) {
        statusEl.textContent = 'Status: Present';
        statusEl.className = 'status-badge status-present';
        markBtn.textContent = 'Marked Present';
        markBtn.disabled = true;
        markBtn.style.opacity = '0.6';
        markBtn.style.cursor = 'default';
    } else {
        statusEl.textContent = 'Status: Not Marked';
        statusEl.className = 'status-badge status-absent';
        markBtn.textContent = 'Mark Attendance';
        markBtn.disabled = false;
        markBtn.style.opacity = '1';
        markBtn.style.cursor = 'pointer';
    }
}

// Helper for messages
function showMessage(msg, type) {
    const box = document.getElementById('message-box');
    if(box) {
        box.textContent = msg;
        box.style.color = type === 'error' ? '#fca5a5' : '#6ee7b7';
        setTimeout(() => {
            box.textContent = '';
        }, 3000);
    } else {
        alert(msg);
    }
}

// Logout
function logout() {
    localStorage.removeItem(STORAGE_KEY_USER);
    window.location.href = 'index.html';
}
