const url = "https://mod-4-be.herokuapp.com";
const urlDev = "http://localhost:8080";

// função para pegar os valores dos parametros de nome e id.
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// pega o parametro nome do usuário logado.
const user = getParameterByName("nome");

// pega o parametro id do usuário logado.
const userId = getParameterByName("uid");

//busca as informações do usuário Logado no localStorage.
const idUserLogado = JSON.parse(localStorage.getItem("user_id"));

// evita que um usuário que não esteja logado acesse a pagina de outro usuário
async function verificarLogado() {
  if (idUserLogado === null) {
    alert("Voçê não está logado!");
    window.location.href = "./index.html";
  } else {
    await axios.get(`${urlDev}/user/${idUserLogado}/msg`).then(() => {
      mostrarTabela();
    });
  }
}
verificarLogado();

// função que carrega as informações na tabela.
async function mostrarTabela() {
  await axios.get(`${urlDev}/user/${idUserLogado}/msg`).then((res) => {
    let msgs = res.data;
    const table = document.querySelector("#tbody");

    table.innerHTML = "";

    for (let i = 0; i < msgs.length; i++) {
      let id = msgs[i].uid;

      let tagTr = tbody.insertRow();

      let td_descricao = tagTr.insertCell();
      let td_detalhamento = tagTr.insertCell();
      let td_acoes = tagTr.insertCell();

      td_descricao.innerHTML = msgs[i].descricao;
      td_detalhamento.innerHTML = msgs[i].detalhamento;

      let imgEditar = document.createElement("img");
      imgEditar.src = "./img/edit.svg";
      imgEditar.setAttribute("onclick", `editarLinha("${id}")`);

      let imgExcluir = document.createElement("img");
      imgExcluir.src = "./img/delet.svg";
      imgExcluir.setAttribute("onclick", `apagarLinha("${id}")`);

      td_acoes.appendChild(imgEditar);
      td_acoes.appendChild(imgExcluir);
    }
  });
}

async function apagarLinha(posicao) {
  let id = posicao;

  if (confirm("Deseja realmente deletar esta mensagem?")) {
    await axios
      .delete(`${urlDev}/user/${idUserLogado}/msg/${id}`)
      .catch((error) => {
        console.log(error);
      });
    mostrarTabela();
  }
}

async function editarLinha(posicao) {
  let id = posicao;
  await axios
    .get(`${urlDev}/user/${idUserLogado}/msg/${id}`)
    .then((res) => {
      let msg = res.data;
      let novaDesc = msg.descricao;
      let novoDet = msg.detalhamento;
      document.querySelector("#descricaoRecados").value = novaDesc;
      document.querySelector("#detalhamentoRecados").value = novoDet;
    })
    .then(async () => {
      editar(id);
    });
}

async function editar(posicao) {
  let id = posicao;
  const botaoAtualizar = document.querySelector("#botaoAtualizarRecados");

  botaoAtualizar.addEventListener("click", async () => {
    const desNova = document.querySelector("#descricaoRecados").value;
    const detNovo = document.querySelector("#detalhamentoRecados").value;

    if (!!!desNova || desNova == "" || !!!detNovo || detNovo == "") {
      alert("Preencha os campos de descrição e detalhamento!");
    } else {
      await axios.put(`${urlDev}/user/${idUserLogado}/msg/${id}`, {
        descricao: desNova,
        detalhamento: detNovo,
      });
      resetarInputs();
      mostrarTabela();
    }
  });
}

async function addMensagem(desc, det) {
  const descricaoNova = desc;
  const detalhamentoNovo = det;
  if (
    !!!descricaoNova ||
    descricaoNova == "" ||
    !!!detalhamentoNovo ||
    detalhamentoNovo == ""
  ) {
    alert("Preencha os campos de descrição e detalhamento!");
  } else {
    await axios
      .post(`${urlDev}/user/${idUserLogado}/msg`, {
        descricao: descricaoNova,
        detalhamento: detalhamentoNovo,
      })
      .catch((error) => {
        console.log(error);
      });
    mostrarTabela();
  }
}

const botaoSalvar = document.querySelector("#botaoSalvarRecados");
botaoSalvar.addEventListener("click", () => {
  const descricaoNova = document.querySelector("#descricaoRecados").value;
  const detalhamentoNovo = document.querySelector("#detalhamentoRecados").value;

  addMensagem(descricaoNova, detalhamentoNovo);
  resetarInputs();
});

function resetarInputs() {
  document.querySelector("#descricaoRecados").value = "";
  document.querySelector("#detalhamentoRecados").value = "";
}

function logout() {
  localStorage.removeItem("user_id");
  location.href = "index.html";
}
