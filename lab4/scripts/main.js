// Manipuladores de eventos
document.getElementById("botaoClick").addEventListener("click", function () {
  document.getElementById("descricao").textContent = "Clicaste no botão!";
  this.style.backgroundColor = "#4CAF50";
});

document.getElementById("botaoDblClick").addEventListener("dblclick", function () {
  document.getElementById("descricao").textContent = "Clicaste duas vezes!";
  this.style.backgroundColor = "#FF5733";
});

document.getElementById("botaoHover").addEventListener("mouseover", function () {
  document.getElementById("descricao").textContent = "Estás a passar o rato!";
  this.style.transform = "scale(1.1)";
});

document.getElementById("botaoSaida").addEventListener("mouseout", function () {
  document.getElementById("descricao").textContent = "Tiraste o rato de cima!";
  this.style.transform = "scale(1)";
});

document.getElementById("botaoMouseMove").addEventListener("mousemove", function () {
  document.getElementById("descricao").textContent = "Estás a mover o rato!";
  this.style.backgroundColor = "#FFD700";
});

// Contador
let contador = 0;
const contadorDisplay = document.getElementById("contador");

document.getElementById("incrementar").addEventListener("click", function () {
  contador++;
  contadorDisplay.textContent = contador;
});

document.getElementById("resetar").addEventListener("click", function () {
  contador = 0;
  contadorDisplay.textContent = contador;
  document.getElementById("descricao").textContent = "Contador resetado.";
});
