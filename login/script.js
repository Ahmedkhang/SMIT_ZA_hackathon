const handleLogin = () => {
    let email = document.getElementById('email')
    let password = document.getElementById('password')

    if(!email.value || !password.value){
        alert('Please Fill All Fields')
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    

    let findUser = users.find(user =>

        user.userEmail == email.value && user.userPassword == password.value
    )

    if(findUser){
        alert('Login Successfull!')
        localStorage.setItem('currentUser',JSON.stringify(findUser))
        console.log('loginUser',findUser);
        window.location.replace('../feed.html')
        
    }
}
