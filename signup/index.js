function signUpdata(event) {
    event.preventDefault();
    const p = document.getElementById('p');

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(document.getElementById('username').value);

    axios.post('http://localhost:1000/user',{
        name:name,
        email:email,
        password:password
    })
    .then(response=>{
        // console.log(response.data);
        window.location.href = ' ../login/login.html';
    })
    .catch((err)=>{
        console.log(err)
        p.innerHTML=`Error : ${err.response.data.message}` ;
    })
}