document.addEventListener("DOMContentLoaded", function () {
  // Inicializa produtos selecionados no localStorage
  if (!localStorage.getItem("produtos-selecionados")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
  }

  console.log("Número de produtos carregados:", produtos.length);
  carregarProdutos(produtos);
  atualizaCesto(); // Atualiza o cesto ao carregar a página
});


function carregarProdutos(listaProdutos) {
  const lista = document.getElementById("lista-produtos");

  listaProdutos.forEach(produto => {
    console.log(produto.id, produto.title);
    const itemProduto = criarProduto(produto);
    lista.appendChild(itemProduto);
  });
}

function criarProduto(produto) {
  const li = document.createElement("li"); // Cada produto dentro de <li>

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

function adicionarAoCesto(produto) {
  let cesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
  const jaExiste = cesto.find(item => item.id === produto.id);

  if (!jaExiste) {
    cesto.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(cesto));
    alert(`"${produto.title}" foi adicionado ao cesto!`);
    atualizaCesto(); // Atualiza o cesto automaticamente
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
}
