const url = "http://mod-4-be.herokuapp.com";
const urlDev = "http://localhost:8080";

async function login() {
  const usuario = document.querySelector("#usuarioNoLogin").value;
  const senha = document.querySelector("#senhaNoLogin").value;
  await axios
    .get(`${url}/user`, { params: { nome: usuario, senha: senha } })
    .then((res) => {
      let userLogado = res.data;
      setIdKey(userLogado.uid);
      resetarInputs();
      return userLogado;
    })
    .then((res) => {
      console.log(res);
      return (location.href =
        "recados.html?nome=" + res.nome + "&uid=" + res.uid);
    })
    .catch((err) => {
      console.log(err.response);
      if (err.response.data == "field_error") {
        modal1.style.display = "block";
      } else if (err.response.data == "user_not_exist") {
        modal2.style.display = "block";
      }
      resetarInputs();
    });
  const modal1 = document.querySelector("#modal1");
  const modal2 = document.querySelector("#modal2");
  const botaoFecharModal1 = document.querySelector("#modal_1");
  const botaoFecharModal2 = document.querySelector("#modal_2");

  function resetarInputs() {
    document.querySelector("#usuarioNoLogin").value = "";
    document.querySelector("#senhaNoLogin").value = "";
  }

  botaoFecharModal1.addEventListener("click", () => {
    modal1.style.display = "none";
  });
  botaoFecharModal2.addEventListener("click", () => {
    modal2.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const botaoEntrar = document.querySelector("#botaoEntrarLogin");

  window.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
      login();
    }
  });

  botaoEntrar.addEventListener("click", () => {
    login();
  });
});

function setIdKey(userId) {
  localStorage.setItem("user_id", JSON.stringify(userId));
}
