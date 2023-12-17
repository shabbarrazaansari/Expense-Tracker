function onLoad() {
    const parentElem = document.getElementById('details');
    parentElem.innerHTML = '';
    const token = localStorage.getItem('token')
    axios.get('http://localhost:1000/login/expense',{headers:{'Authorization':token}})
    .then(response=>{
        console.log(response)
        for (let i=0 ;i< response.data.length;i++ ) {
            showData(response.data[i]);
            
        }
    })
    
}

function expense(e) {
    e.preventDefault();
    // console.log(e);
   
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const option = document.getElementById('selection').value;
    const token = localStorage.getItem('token')
    axios.post("http://localhost:1000/login/expense",{
        amount:amount,
        description:description,
        category:option,

    },{headers:{'Authorization':token}})
    .then(response=>{
        if(response.status === 201){
            showData(response.data)
        }
        console.log(response.data)
        
    })
    .catch(err=>{
        console.log(err)
    })    
    
}
function showData(obj) {
    const parentElem = document.getElementById('details')
    const childElem = document.createElement('li')
    childElem.id =`expense${obj.id}`;
    childElem.className = "lists";
    childElem.innerHTML = `${obj.amount} -  ${obj.description} - ${obj.category}  <div> <button 
    onClick ='deleteExpense(event,${obj.id}) '> Delete
     </button></div>`;
    
    
    parentElem.appendChild(childElem);
    
}
async function deleteExpense(e,expenseId) {

   const token = localStorage.getItem('token')  
   await axios.delete(`http://localhost:1000/login/expense/${expenseId}`,{headers:{'Authorization':token}})
   .then(response=>{
      console.log(response)
      const Elem = document.getElementById(`expense${expenseId}`);
    Elem.remove();
    
   })
   .then(err=>{
    console.log(err)
   })
    
}
window.addEventListener('load',onLoad)