const socket = io();

// Global Variables 
const userTable = document.querySelector('.users');
const userTagline = document.querySelector('#users-tagline');
let sabkanaam;
const userTitle = document.getElementById('user-title');
// Global methods

const methods = {
  socketConnect: async (username, userID,usermail) => {
    socket.auth = { username, userID,usermail }
    await socket.connect();
  },
  createSession: async (username,usermail) => {
    const data={
      username,usermail
    }
    
    let options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
    await fetch('/session', options)
    .then( res => res.json() )
    .then( data => {
      
      methods.socketConnect(data.username, data.userID,usermail);
      // set localstorage for session
      localStorage.setItem('session-username', data.username);
      
      localStorage.setItem('session-usermail', data.usermail);
      localStorage.setItem('session-userID', data.userID);
  
      document.querySelector(".login-container").style.display="none"
      document.querySelector(".chat-body").style.display="block"
      // userTitle.innerHTML = data.username;
      // console.log(data.username);
    })
    .catch( err => console.log(err) )
  }
}
// session variables
const sessUsername = localStorage.getItem('session-username');
const sessUsermail = localStorage.getItem('session-usermail');
const sessUserID = localStorage.getItem('session-userID');

if(sessUsername && sessUserID && sessUsermail) {

  methods.socketConnect(sessUsername, sessUserID,sessUsermail);

  document.querySelector(".login-container").style.display="none"
  document.querySelector(".chat-body").style.display="block"

  // userTitle.innerHTML = sessUsername;
}
    
// login form handler
const loginForm = document.querySelector('.user-login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username');
  const usermail = document.getElementById('usermail');
  methods.createSession(username.value.toLowerCase(),usermail.value.toLowerCase());
  username.value = '';
  usermail.value='';
});
  
// user list table
socket.on('users', ({users}) => {
  // console.log(users);

  const index = users.findIndex( user => user.userID === socket.id );
  if ( index > -1) {
    users.slice(index, 1);
}
console.log(users);
userTable.innerHTML = '';
  let ul = `<table class="table table-hover">`;
  for (const user of users) {
    ul += `<tr class="socket-users" onclick="methods.setActiveUser('${user.username} ', '${user.userID}')"><td>Name : ${user.username} ; Mail-Id : ${user.usermail} <span class="text-danger ps-1 d-none" id="${user.userID}"></span></td></tr>`;  
  }
  ul += `</table>`;
  if ( users.length > 0 ) {
    userTable.innerHTML = ul;
    userTagline.innerHTML = "online users";
    userTagline.classList.add('text-success');
    userTagline.classList.remove('text-danger');
  } else {
    userTagline.innerHTML = 'no active user';
    userTagline.classList.remove('text-success');
    userTagline.classList.add('text-danger');
  }
})
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.messages')
// do {
//     name =<input type="text " />
    
// } while(!name)

// const socket=io();

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})
// console.log(username);
function sendMessage(message) {
     let msg = {
        user: sabkanaam,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
     mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `       
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})
function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}
socket.emit("rec",(userkanaam)=>{

})
  
console.log();