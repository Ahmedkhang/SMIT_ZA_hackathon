
const handleSignup = () => {
    let name = document.getElementById('name')
    let email = document.getElementById('email')
    let password = document.getElementById('password')
     
    if(!name.value || !email.value || !password.value){
        alert('PLease Fill The All Fields!!')
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({
        userName:name.value,
        userEmail:email.value,
        userPassword:password.value
    })

    localStorage.setItem('users',JSON.stringify(users))
    console.log(users);
    window.location.replace('../login/index.html')
    alert('Signup Successful!')
    
}