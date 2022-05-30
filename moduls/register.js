const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("pass");
const password2 = document.getElementById("pass2");

form.addEventListener("submit", (e) => {
  
  e.preventDefault();
  validate();
  
});

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;

const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;




const validate = () => {
 
  const user = username.value.trim();
  const mail = email.value.trim();
  const pass = password.value.trim();
  const pass2 = password2.value.trim();


 

  
  if (user === "") {
    let errorMessage = "Campo obligatorio (*)";
    inputError(username, errorMessage);
  } else if (user.length < 2 || user.length > 30) {
    let errorMessage =
      "El nombre de usuario debe tener entre 2 y 30 caracteres";
    inputError(username, errorMessage);
  } else {
    inputSuccess(username);
  }

  if (mail === "") {
    let errorMessage = "Campo obligatorio (*)";
    inputError(email, errorMessage);
  } else if (!emailRegex.test(mail)) {
    let errorMessage = "El email no es válido";
    inputError(email, errorMessage);
  } else {
    inputSuccess(email);
    localStorage.setItem('Email', email.value)
  }



  if (pass === "") {
    let errorMessage = "Campo obligatorio (*)";
    inputError(password, errorMessage);
  } else if (!passRegex.test(pass)) {
    let errorMessage =
      "La contraseña no es válida. Debe tener mayúscula, minúscula, números y al menos 8 caracteres.";
    inputError(password, errorMessage);
  } else {
    inputSuccess(password);
    localStorage.setItem('Password', password.value)
  }

  if (pass2 === "") {
    let errorMessage = "Campo obligatorio (*)";
    inputError(password2, errorMessage);
  } else if (pass2 !== pass) {
    let errorMessage = "Las contraseña no coinciden.";
    inputError(password2, errorMessage);
  } else {
    inputSuccess(password2);
    window.location.replace('/login.html');
  }

};


const inputSuccess = (input) => {
  const inputParent = input.parentElement;
  const small = inputParent.querySelector("small");
  inputParent.classList.add("success");
  inputParent.classList.remove("error");
  small.innerHTML = "";
};


const inputError = (input, message) => {
  const inputParent = input.parentElement;

 
    const small = inputParent.querySelector("small");
    inputParent.classList.add("error");
    inputParent.classList.remove("success");
  
    small.classList.add("error");
    small.innerHTML = message;
  

  setTimeout(() => {
    inputParent.classList.remove("error");
    small.classList.remove("error");
  }, 5000);
};