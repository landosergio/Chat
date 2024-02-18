const socket = io();

let user = "";

let chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Usuario",
  input: "text",
  text: "Ingrese un nombre de usuario",
  inputValidator: (value) => {
    return !value && "Debes ingresar un nombre de usuario para continuar";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("autenticado");
});

chatBox.onkeyup = (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
};

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages = messages + `${message.user} dice: ${message.message}</br>`;
  });
  log.innerHTML = messages;
});

socket.on("autenticado", (data) => {
  user != "" &&
    Swal.fire({
      text: `nuevo usuario ha conectado`,
      toast: true,
      position: "top-right",
    });
});
