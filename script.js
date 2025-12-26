const addButton = document.querySelector(".add-btn");
const modalContainer = document.querySelector(".model_popup-container");
let isModalVisible = false;
modalContainer.style.display = "none";
const textArea = document.querySelector(".text_Area_Container");

let modalProirityColor = "LightBlue";

let colors = ["LightPink", "LightGreen", "LightBlue", "Black"];

let ticketsArray = [];
let toolBoxColors = document.querySelectorAll(".color-box");

let isRemoveTicket = false;
const removeBtn = document.querySelector(".remove-btn");

const mainContainer = document.querySelector(".main-cont");

//Read data from local storage

let localStorageTickets = JSON.parse(localStorage.getItem("tickets"));

if (localStorageTickets != null && localStorageTickets.length > 0) {
    ticketsArray = localStorageTickets;
  localStorageTickets.forEach((ticket) => {
    createTicket(ticket.task, ticket.id, ticket.taskColor);
  });
}   

removeBtn.addEventListener("click", () => {
  isRemoveTicket = !isRemoveTicket;
  if (isRemoveTicket === true) {
    removeBtn.style.color = "red";
    alert("Click on Ticket to Remove it");
  } else {
    alert("Remove Button Deactivated");
    removeBtn.style.color = "white";
  }
});

const allPriorityColors = document.querySelectorAll(".priority-color");

allPriorityColors.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    allPriorityColors.forEach((priorityColor) => {
      priorityColor.classList.remove("Active");
    });
    colorElem.classList.add("Active");
    let selectedColor = colorElem.classList[1];
    modalProirityColor = selectedColor;
  });
});

addButton.addEventListener("click", () => {
  isModalVisible = !isModalVisible;

  if (isModalVisible === true) {
    modalContainer.style.display = "flex";
  } else {
    modalContainer.style.display = "none";
  }
});

modalContainer.addEventListener("keydown", (e) => {
  if (e.key === "Shift") {
    let task = textArea.value;
    if (task === "") return;
    let taskid = null;
    createTicket(task, taskid, modalProirityColor);
    textArea.value = "";
  }
});
function createTicket(task, taskid, taskColor) {
  let id = null;

  if (taskid === undefined || taskid === null) {
    id = Math.floor(Math.random() * 10000);
  } else {
    id = taskid;
  }

  const divElement = document.createElement("div");
  divElement.setAttribute("class", "ticket-cont");
  divElement.innerHTML = `
                <div class="Ticket_color ${taskColor}"></div>
                <div class="Ticket-id">${id}</div>
                <div class="Ticket-task">${task}</div>
                <div class="Ticket-lock"> <i class="fa-solid fa-lock"></i> </div>
             `;

  mainContainer.appendChild(divElement);
  isModalVisible = false;
  modalContainer.style.display = "none";
  handleLock(id,divElement);
  handleRemoval(id,divElement);
  handleBandColorChange(id, divElement);

  if (taskid === undefined || taskid === null) {
    ticketsArray.push({ id, taskColor, task });
  }
  
  console.log(ticketsArray);
  localStorage.setItem("tickets",JSON.stringify(ticketsArray));
}

function handleLock(id,ticket) {
  console.log("lock clicked");
  const ticketLockElem = ticket.querySelector(".Ticket-lock");
  const ticketTaskArea = ticket.querySelector(".Ticket-task");

  const ticketLocIcon = ticketLockElem.children[0];
  ticketLocIcon.addEventListener("click", () => {
    if (ticketLocIcon.classList.contains("fa-lock")) {
      ticketLocIcon.classList.remove("fa-lock");
      ticketLocIcon.classList.add("fa-lock-open");
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLocIcon.classList.remove("fa-lock-open");
      ticketLocIcon.classList.add("fa-lock");
      ticketTaskArea.setAttribute("contenteditable", "false");

     ticketIndex = ticketsArray.findIndex(function (ticket) {
      return ticket.id == id;
    });

    ticketsArray[ticketIndex].task  = ticketTaskArea.innerText;
    localStorage.setItem("tickets",JSON.stringify(ticketsArray));
    }
  });
}

// Handle ticket removal
function handleRemoval(id,ticket) {
  ticket.addEventListener("click", () => {
    if (isRemoveTicket === true) {
      ticket.remove();
      
    ticketsArray=ticketsArray.filter(function(ticketObj){
        return ticketObj.id != id
    })
    }
     localStorage.setItem("tickets",JSON.stringify(ticketsArray));
  });
}

// Handle band color change
function handleBandColorChange(id, ticket) {
  const ticketBand = ticket.querySelector(".Ticket_color");

  ticketBand.addEventListener("click", () => {
    let currentColor = ticketBand.classList[1];
    let currentColorIndex = colors.indexOf(currentColor);
    newColorIndex = (currentColorIndex + 1) % colors.length;
    let newColor = colors[newColorIndex];

    ticketBand.classList.remove(currentColor);
    ticketBand.classList.add(newColor);

    ticketIndex = ticketsArray.findIndex(function (ticket) {
      return ticket.id == id;
    });

    ticketsArray[ticketIndex].taskColor = newColor;
     localStorage.setItem("tickets",JSON.stringify(ticketsArray));
  });
}

toolBoxColors.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    let color = colorElem.classList[0];

    console.log("Inside Foreach Ticket Array is " + ticketsArray);
    let filteredTicket = ticketsArray.filter((ticketObj) => {
      console.log("Ticket Obj color" + ticketObj.taskColor);
      console.log("Color Clicked" + color);
      return ticketObj.taskColor == color;
    });
    console.log("Filtered Ticket", filteredTicket);

    mainContainer.innerHTML = "";

    filteredTicket.forEach((ticketObj) => {
      console.log("Creating Ticket for filtered Ticket Obj", ticketObj);
      createTicket(ticketObj.task, ticketObj.id, ticketObj.taskColor);
    });
  });

  colorElem.addEventListener("dblclick", (e) => {
    mainContainer.innerHTML = "";
    ticketsArray.forEach((ticketObj) => {
      createTicket(ticketObj.task, ticketObj.id, ticketObj.taskColor);
    });
  });
});
