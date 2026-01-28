const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const type = document.querySelector("#type").value;
  const amount = Number(document.querySelector("#amount").value);
  const date = document.querySelector("#date").value;
  const category = document.querySelector("#category").value;
  const description = document.querySelector("#description").value;

  // Validação 1: campos obrigatórios
  if (!type || !date || !category) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  // Validação 2: valor válido
  if (isNaN(amount) || amount <= 0) {
    alert("Informe um valor válido maior que zero.");
    return;
  }

  console.log("Dados válidos:");
  console.log({
    type,
    amount,
    date,
    category,
    description,
  });
});
