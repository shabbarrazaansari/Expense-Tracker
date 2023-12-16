function login(event) {
    event.preventDefault()
    const loginDetails = {
        email:event.target.email.value,
        password:event.target.password.value
    }
    console.log(loginDetails);
    axios.post('http://localhost:1000/user/login',loginDetails)
    .then(response=>{
        if(response.status===200){
            alert(response.data.message)
            localStorage.setItem('token',response.data.token)
            window.location.href = "../expense/expense.html";
        }
    })
    .catch((err)=>{
        console.log(err)
        document.body.innerHTML += `<div style ="color:red">${err.response.data.message}</div> `
    })
}