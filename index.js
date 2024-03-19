document.getElementById("login_content").style.display = "block";
document.getElementById("main_content").style.display = "none";

// Your web app's Firebase configuration
  const firebaseConfig = {
//Your  fire base config 
    

  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  
  

  // Set up our register function
  function register () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    full_name = document.getElementById('full_name').value
    
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Incorrect!!')
      return
      // Don't continue running the code
    }
    if (validate_field(full_name) == false) {
      alert('Name is Incorrect!!')
      return
    }
   
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        email : email,
        full_name : full_name,
        
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data)
      
      // DOne
      alert('User Created!!')
      window.open("index.html", '_self')
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  // Set up our login function
  function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Incorrect!!')
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
      
      
      

      // DOne
      alert('User Logged In!!')
      document.getElementById("login_content").style.display = "none";
      document.getElementById("main_content").style.display = "block";
      
      
      
  
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  
  
  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  } 

  function checkLogin() {
    // Replace with your actual login status check (e.g., session variable)
     // Example: Assume user is logged in
  
    if (logged_in) {
      document.getElementById("login_content").style.display = "none";
      document.getElementById("main_content").style.display = "block";
    } else {
      document.getElementById("login_content").style.display = "block";
      document.getElementById("main_content").style.display = "none";
    }
  }
  function logout(){
    auth.signOut().then(() => {
      alert("Signed Out!!")
      window.open("index.html", "_self")
    }).catch((error) => {
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    });
  }
  function createTask(){
    var user = auth.currentUser
  
      // Add this user data to Firebase Database
      var database_ref = database.ref()
      var task = document.getElementById("task").value
      // Create User data
      var user_data = {
        task_created : Date.now(),
        
        priority : document.getElementById("task_priority").value,
        due_date : document.getElementById("task_duedate").value,
        detail : document.getElementById("task_description").value
      }
      // Push to Firebase Database
      database_ref.child('users/' + user.uid + '/tasks/' + task).set(user_data).catch((error) => {
        var error_code = error.code
        var error_message = error.message
    
        alert(error_message)
      });
      alert("task created")

  }
  function showtasks(){
    var user = auth.currentUser
    const box = document.getElementById("main_content")
    const dbRef = firebase.database().ref();
    dbRef.child("users").child(user.uid).child("tasks").get().then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const taskList = document.getElementById("task_list");
        
        taskList.innerHTML = ""; // Clear existing content
        for (const key in data) {
          const task = key;
          const detail = data[key]["detail"];
          const Due = data[key]["due_date"];
          const Prio = data[key]["priority"];
          const taskItem = document.createElement("li");
          
          taskItem.textContent = task + " : " + detail + "(Due: " + Due + " " + Prio + " Priority)"; 
          taskList.appendChild(taskItem);


          let span = document.createElement("span")
          span.innerHTML = "\u00d7";
          taskItem.appendChild(span)

        }
          
      } else {
        alert("No data available");
      }
    }).catch((error) => {
      var error_code = error.code
        var error_message = error.message
    
        alert(error_message)
      });

      box.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
          e.target.classList.toggle("checked");
        }
        else if (e.target.tagName === "SPAN"){
          
          e.target.parentElement.remove()
          remove_task();
        }
      }, true); // Capture clicks on child elements
      
  }
  function show_detail(){
    alert("Test")
  }
  
  function google_signin(){
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ display: 'popup' });
    firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // IdP data available in result.additionalUserInfo.profile.
      // ...
      alert('User Logged In!!')
      document.getElementById("login_content").style.display = "none";
      document.getElementById("main_content").style.display = "block";

  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    alert(errorMessage)
  });
  }
  function anonymous_signin(){
    firebase.auth().signInAnonymously()
  .then(() => {
    // Signed in..
    alert('User Logged In!!')
      document.getElementById("login_content").style.display = "none";
      document.getElementById("main_content").style.display = "block";
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    alert(errorMessage)
  });
  }
  function contact(){
    alert(" Contact us at the email --> techandmecns@gmail.com \n Or ring us at --> +917439378104")
  }
  function about(){
    alert(" This project has been developed in MNNIT \n as part of the Mecathon event \n Part of Avishkar Techno Fest ")
  }
  function remove_task(){
    var user = auth.currentUser
  
      // Add this user data to Firebase Database
      var database_ref = database.ref()
      var task = prompt("Verify name of the task to delete")
      if(task == null){
        showtasks()
      }
      else{
        // Push to Firebase Database
      database_ref.child('users/' + user.uid + '/tasks/' + task).set(null).catch((error) => {
        var error_code = error.code
        var error_message = error.message
    
        alert(error_message)
      });
      alert("task deleted")
      }
      
      
  }