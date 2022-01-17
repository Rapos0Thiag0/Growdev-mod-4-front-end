const url = "https://mod-4-be.herokuapp.com";
const urlDev = "http://localhost:8080";

class Usuario {
  constructor(nome, senha) {
    this.nome = nome;
    this.senha = senha;
  }
}

async function CriaNovoUsuario(nome, senha) {
  const user = new Usuario(nome, senha);
  await axios
    .post(`${url}/user`, user)
    .then((res) => {
      const novoUser = {
        nome: res.data.nome,
        senha: res.data.senha,
        uid: res.data.uid,
      };
      console.log(novoUser);
      return res.novoUser;
    })
    .then(() => {
      resetarInputs();
      window.location.pathname = "./index.html";
    })
    .catch((err) => {
      console.log(err.response.data);
      if (err.response.data === "User_exist") {
        modal4.style.display = "block";
      }
    });
}

function resetarInputs() {
  document.querySelector("#usuarioNoNovaConta").value = "";
  document.querySelector("#senhaNoNovaConta").value = "";
  document.querySelector("#senhaNoNovaConta2").value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const usuario = document.querySelector("#usuarioNoNovaConta");
  const senha = document.querySelector("#senhaNoNovaConta");
  const senha2 = document.querySelector("#senhaNoNovaConta2");
  const botaoCriar = document.querySelector("#botaoNovaConta");
  const modal1 = document.querySelector("#modal1");
  const modal2 = document.querySelector("#modal2");
  const modal3 = document.querySelector("#modal3");
  const modal4 = document.querySelector("#modal4");
  const botaoFecharModal1 = document.querySelector("#modal_1");
  const botaoFecharModal2 = document.querySelector("#modal_2");
  const botaoFecharModal3 = document.querySelector("#modal_3");
  const botaoFecharModal4 = document.querySelector("#modal_4");

  senha2.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (
        !!!senha.value ||
        !!!usuario.value ||
        senha.value == "" ||
        usuario.value == ""
      ) {
        modal1.style.display = "block";
      } else if (senha.value.length < 8 || senha.value.length >= 12) {
        modal2.style.display = "block";
      } else if (senha.value !== senha2.value) {
        modal3.style.display = "block";
      } else if (localStorage.getItem(usuario.value) !== null) {
        modal4.style.display = "block";
      } else {
        e.preventDefault();
        botaoCriar.click();
      }
    }
  });

  botaoCriar.addEventListener("click", () => {
    if (
      !!!senha.value ||
      !!!usuario.value ||
      senha.value == "" ||
      usuario.value == ""
    ) {
      modal1.style.display = "block";
    } else if (senha.value.length < 8 || senha.value.length >= 12) {
      modal2.style.display = "block";
    } else if (senha.value !== senha2.value) {
      modal3.style.display = "block";
    } else if (localStorage.getItem(usuario.value) !== null) {
      modal4.style.display = "block";
    } else {
      CriaNovoUsuario(usuario.value, senha.value);
    }
  });

  botaoFecharModal1.addEventListener("click", () => {
    modal1.style.display = "none";
    resetarInputs();
  });
  botaoFecharModal2.addEventListener("click", () => {
    modal2.style.display = "none";
    resetarInputs();
  });
  botaoFecharModal3.addEventListener("click", () => {
    modal3.style.display = "none";
    resetarInputs();
  });
  botaoFecharModal4.addEventListener("click", () => {
    modal4.style.display = "none";
    resetarInputs();
  });
});
