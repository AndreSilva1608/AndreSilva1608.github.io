document.addEventListener("DOMContentLoaded", () => {
  const descricao = document.getElementById("descricao");
  const contadorDisplay = document.getElementById("contador");
  let contador = 0;
document.getElementById("seletorCor").addEventListener("change", function() {
  document.body.style.backgroundColor = this.value;
});

  // Seleciona todos os botões
  const botoes = document.querySelectorAll("button");


  // Percorre cada botão e adiciona os eventos apropriados
  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      switch (botao.id) {
        case "botaoClick":
          descricao.textContent = "Clicaste no botão!";
          botao.style.backgroundColor = "#4CAF50";
          break;

        case "incrementar":
          contador++;
          contadorDisplay.textContent = contador;
          break;

        case "resetar":
          contador = 0;
          contadorDisplay.textContent = contador;
          descricao.textContent = "Contador resetado.";
          break;
      }
    });

    botao.addEventListener("dblclick", () => {
      if (botao.id === "botaoDblClick") {
        descricao.textContent = "Clicaste duas vezes!";
        botao.style.backgroundColor = "#FF5733";
      }
    });

    botao.addEventListener("mouseover", () => {
      if (botao.id === "botaoHover") {
        descricao.textContent = "Estás a passar o rato!";
        botao.style.transform = "scale(1.1)";
      }
    });

    botao.addEventListener("mouseout", () => {
      if (botao.id === "botaoSaida") {
        descricao.textContent = "Tiraste o rato de cima!";
        botao.style.transform = "scale(1)";
      }
    });

    botao.addEventListener("mousemove", () => {
      if (botao.id === "botaoMouseMove") {
        descricao.textContent = "Estás a mover o rato!";
        botao.style.backgroundColor = "#FFD700";
      }
    });
  });
});
document.getElementById("formularioUsuario").addEventListener("submit", function(e) {
  e.preventDefault(); // evita recarregar a página

  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;

  document.getElementById("mensagem").textContent = `Olá, o ${nome} tem ${idade}!`;
});

