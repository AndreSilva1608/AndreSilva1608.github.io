document.addEventListener("DOMContentLoaded", function () {
  // Inicializa produtos selecionados no localStorage
  if (!localStorage.getItem("produtos-selecionados")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
  }

  // Criar filtros e controlos
  criarFiltroCategorias();
  criarOrdenacaoPreco();
  criarPesquisaNome();

  // Buscar produtos da API
  obterProdutos()
    .then(produtos => {
      window.todosOsProdutos = produtos;
      window.produtosVisiveis = produtos; // produtos atualmente mostrados
      console.log("Número de produtos carregados:", produtos.length);
      carregarProdutos(produtos);
      atualizaCesto();
    })
    .catch(erro => {
      console.error("Erro ao carregar produtos:", erro);
      alert("Não foi possível carregar os produtos da loja. Tenta novamente mais tarde.");
    });
});


// ============================
// FUNÇÕES AJAX
// ============================

// Buscar produtos
async function obterProdutos(categoria = "") {
  let url = "https://deisishop.pythonanywhere.com/products";
  if (categoria && categoria !== "") {
    url += `/category/${encodeURIComponent(categoria)}`;
  }

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }
  const produtos = await resposta.json();
  return produtos;
}

// Buscar categorias
async function obterCategorias() {
  const resposta = await fetch("https://deisishop.pythonanywhere.com/categories");
  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }
  const categorias = await resposta.json();
  return categorias;
}


// ============================
// FILTRO DE CATEGORIAS
// ============================

async function criarFiltroCategorias() {
  const select = document.getElementById("categoria"); // já no HTML

  try {
    const categorias = await obterCategorias();
    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      select.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao obter categorias:", erro);
  }

  select.addEventListener("change", async function () {
    const categoriaSelecionada = this.value;
    const lista = document.getElementById("lista-produtos");
    lista.innerHTML = "<li>Carregando produtos...</li>";

    try {
      const produtosFiltrados = await obterProdutos(categoriaSelecionada);
      window.todosOsProdutos = produtosFiltrados;
      window.produtosVisiveis = produtosFiltrados;
      lista.innerHTML = "";
      carregarProdutos(produtosFiltrados);
    } catch (erro) {
      console.error("Erro ao filtrar produtos:", erro);
      lista.innerHTML = "<li>Erro ao carregar produtos.</li>";
    }
  });
}


// ============================
// ORDENAR POR PREÇO
// ============================

function criarOrdenacaoPreco() {
  const filtroContainer = document.getElementById("filtro-container");

  const label = document.createElement("label");
  label.textContent = "Ordenar por: ";
  label.setAttribute("for", "ordenar-preco");
  label.style.marginLeft = "1rem";

  const select = document.createElement("select");
  select.id = "ordenar-preco";
  select.style.marginBottom = "1rem";

  const opcaoPadrao = new Option("Ordenar pelo preço", "");
  const opcaoCrescente = new Option("Preço crescente", "asc");
  const opcaoDecrescente = new Option("Preço decrescente", "desc");

  select.append(opcaoPadrao, opcaoCrescente, opcaoDecrescente);
  filtroContainer.appendChild(label);
  filtroContainer.appendChild(select);

  select.addEventListener("change", function () {
    const ordem = this.value;
    let produtos = [...(window.produtosVisiveis || [])];

    if (ordem === "asc") {
      produtos.sort((a, b) => a.price - b.price);
    } else if (ordem === "desc") {
      produtos.sort((a, b) => b.price - a.price);
    }

    carregarProdutos(produtos);
  });
}


// ============================
// PESQUISA POR NOME
// ============================

function criarPesquisaNome() {
  const filtroContainer = document.getElementById("filtro-container");

  const label = document.createElement("label");
  label.textContent = "Pesquisar: ";
  label.setAttribute("for", "pesquisa-nome");
  label.style.marginLeft = "1rem";

  const input = document.createElement("input");
  input.type = "text";
  input.id = "pesquisa-nome";
  input.placeholder = "Escreve o nome do produto...";
  input.style.marginBottom = "1rem";
  input.style.padding = "0.3rem";
  input.style.borderRadius = "5px";
  input.style.border = "1px solid #ccc";

  filtroContainer.appendChild(label);
  filtroContainer.appendChild(input);

  input.addEventListener("input", function () {
    const termo = this.value.toLowerCase();
    let produtosFiltrados = window.todosOsProdutos || [];

    // Filtra por nome
    produtosFiltrados = produtosFiltrados.filter(produto =>
      produto.title.toLowerCase().includes(termo)
    );

    // Guarda os produtos atualmente visíveis (para ordenar depois)
    window.produtosVisiveis = produtosFiltrados;

    carregarProdutos(produtosFiltrados);
  });
}


// ============================
// FUNÇÕES DE INTERFACE
// ============================

function carregarProdutos(listaProdutos) {
  const lista = document.getElementById("lista-produtos");
  lista.innerHTML = "";

  if (listaProdutos.length === 0) {
    const vazio = document.createElement("li");
    vazio.textContent = "Nenhum produto encontrado.";
    lista.appendChild(vazio);
    return;
  }

  listaProdutos.forEach(produto => {
    const itemProduto = criarProduto(produto);
    lista.appendChild(itemProduto);
  });
}

function criarProduto(produto) {
  const li = document.createElement("li");
  const artigo = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = "Imagem do produto " + produto.title;
  imagem.width = 200;

  const descricao = document.createElement("p");
  descricao.textContent = produto.description;

  const preco = document.createElement("p");
  preco.textContent = "Preço: €" + produto.price.toFixed(2);

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao cesto";
  botao.style.marginTop = "0.5rem";
  botao.style.padding = "0.4rem 0.8rem";
  botao.style.backgroundColor = "#3b82f6";
  botao.style.color = "white";
  botao.style.border = "none";
  botao.style.borderRadius = "5px";
  botao.style.cursor = "pointer";

  botao.addEventListener("click", function () {
    adicionarAoCesto(produto);
  });

  artigo.append(titulo, imagem, descricao, preco, botao);
  li.appendChild(artigo);
  return li;
}


// ============================
// FUNÇÕES DO CESTO
// ============================

function adicionarAoCesto(produto) {
  let cesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
  const jaExiste = cesto.find(item => item.id === produto.id);

  if (!jaExiste) {
    cesto.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(cesto));
    alert(`"${produto.title}" foi adicionado ao cesto!`);
    atualizaCesto();
  } else {
    alert(`"${produto.title}" já está no cesto.`);
  }
}

function atualizaCesto() {
  const listaCesto = document.getElementById("lista-cesto");
  listaCesto.innerHTML = "";

  const cesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

  cesto.forEach(produto => {
    const item = criaProdutoCesto(produto);
    listaCesto.appendChild(item);
  });

  atualizarPrecoTotal(cesto);
}

function criaProdutoCesto(produto) {
  const li = document.createElement("li");
  const artigo = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const preco = document.createElement("p");
  preco.textContent = "Preço: €" + produto.price.toFixed(2);

  const botaoRemover = document.createElement("button");
  botaoRemover.textContent = "Remover do cesto";
  botaoRemover.style.marginTop = "0.5rem";
  botaoRemover.style.padding = "0.4rem 0.8rem";
  botaoRemover.style.backgroundColor = "#ef4444";
  botaoRemover.style.color = "white";
  botaoRemover.style.border = "none";
  botaoRemover.style.borderRadius = "5px";
  botaoRemover.style.cursor = "pointer";

  botaoRemover.addEventListener("click", function () {
    removerDoCesto(produto.id);
  });

  artigo.append(titulo, preco, botaoRemover);
  li.appendChild(artigo);
  return li;
}

function removerDoCesto(produtoId) {
  let cesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
  cesto = cesto.filter(item => item.id !== produtoId);
  localStorage.setItem("produtos-selecionados", JSON.stringify(cesto));
  atualizaCesto();
}

function atualizarPrecoTotal(cesto) {
  let totalLi = document.getElementById("preco-total");
  if (!totalLi) {
    const listaCesto = document.getElementById("lista-cesto");
    totalLi = document.createElement("li");
    totalLi.id = "preco-total";
    totalLi.style.fontWeight = "bold";
    listaCesto.appendChild(totalLi);
  }
  const total = cesto.reduce((soma, produto) => soma + produto.price, 0);
  totalLi.textContent = "Preço total: €" + total.toFixed(2);
}document.addEventListener("DOMContentLoaded", () => {
  const btnComprar = document.getElementById("btn-comprar");
  if (btnComprar) {
    btnComprar.addEventListener("click", finalizarCompra);
  }
});

async function finalizarCompra() {
  const cupao = document.getElementById("cupao").value.trim();
  const resultado = document.getElementById("resultado-compra");
  resultado.textContent = "";

  let cesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

  if (cesto.length === 0) {
    alert("O cesto está vazio. Adiciona produtos antes de comprar.");
    return;
  }

  // Monta o corpo do pedido
  const dadosCompra = {
    products: cesto.map(p => p.id),
  };

  if (cupao) {
    dadosCompra.coupon = cupao; // o endpoint aceita "coupon"
  }

  try {
    const resposta = await fetch("https://deisishop.pythonanywhere.com/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosCompra),
    });

    if (!resposta.ok) {
      if (resposta.status === 400) {
        resultado.textContent = "❌ Cupão inválido ou produtos indisponíveis.";
      } else {
        resultado.textContent = "❌ Erro ao processar a compra.";
      }
      return;
    }

    const dados = await resposta.json();


    resultado.innerHTML = `
      ✅ Compra efetuada com sucesso!<br>
      Referência de pagamento: <strong>${dados.payment_reference}</strong><br>
      Total final: <strong>€${dados.final_total.toFixed(2)}</strong>
      ${dados.discount ? `<br>Desconto aplicado: ${dados.discount}%` : ""}
    `;

    // Limpa o cesto
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
    atualizaCesto();

  } catch (erro) {
    console.error("Erro na compra:", erro);
    resultado.textContent = "❌ Erro de comunicação com o servidor.";
  }
}
