const formUsuario = document.getElementById("formUsuario")
const emailUsuario = document.getElementById("emailUsuario")
const passUsuario = document.getElementById("passUsuario")

formUsuario.addEventListener("click", e =>{
    let sucess = false
    e.preventDefault()
    if (emailUsuario.value === window.localStorage.getItem("Email")) {
       sucess = true
       inputSuccess(emailUsuario)
    }else{
        sucess = false
    }

    if(passUsuario.value === window.localStorage.getItem("Password")){
        sucess = true
        inputSuccess(passUsuario)
    }
    else{
        sucess = false
    }

    if (sucess === true) {
        window.location.replace("/index.html")
    }

})




const inputSuccess = (input) => {
    const inputParent = input.parentElement;
    inputParent.classList.add("success");
}

