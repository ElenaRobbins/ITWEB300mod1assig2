class Ticket {
  constructor(ticketNumber, userName, issueDescription) {
    this.ticketNumber = ticketNumber;
    this.userName = userName;
    this.issueDescription = issueDescription;
    this.status = 'Open';
    this.dateCreated = new Date();
  }

  getDetails() {
    return `Ticket #${this.ticketNumber}\nUser: ${this.userName}\nIssue: ${this.issueDescription}\nStatus: ${this.status}\nCreated: ${this.dateCreated}`;
  }

  toggleStatus() {
    this.status = (this.status === 'Open') ? 'Closed' : 'Open';
  }
}

class SupportSystem {
  constructor() {
    this.tickets = [];
  }

  addTicket(ticket) {
    this.tickets.push(ticket);
  }

  searchByName(name) {
    return this.tickets.filter(ticket => ticket.userName.toLowerCase() === name.toLowerCase());
  }

  searchByNumber(number) {
    return this.tickets.find(ticket => ticket.ticketNumber == number);
  }

  getAllTickets() {
    return this.tickets;
  }
}

const supportSystem = new SupportSystem();

const form = document.getElementById('ticketForm');
const displayArea = document.getElementById('ticketsDisplay');
const searchBtn = document.getElementById('searchBtn');
const showAllBtn = document.getElementById('showAllBtn');
const clearBtn = document.getElementById('clearBtn');
const searchTypeSelect = document.getElementById('searchType');
const searchInput = document.getElementById('searchInput');

loadTickets();

function saveTickets() {
  localStorage.setItem('tickets', JSON.stringify(supportSystem.tickets));
}
function loadTickets() {
  const stored = localStorage.getItem('tickets');
  if (stored) {
    const arr = JSON.parse(stored);
    supportSystem.tickets = arr.map(t => {
      const ticket = new Ticket(t.ticketNumber, t.userName, t.issueDescription);
      ticket.status = t.status;
      ticket.dateCreated = new Date(t.dateCreated);
      return ticket;
    });
  }
}
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const ticketNumber = document.getElementById('ticketNumber').value;
  const userName = document.getElementById('userName').value;
  const issueDescription = document.getElementById('issueDescription').value;

  if (supportSystem.searchByNumber(ticketNumber)) {
    alert('Ticket number already exists!');
    return;
  }

  const newTicket = new Ticket(ticketNumber, userName, issueDescription);
  supportSystem.addTicket(newTicket);
  saveTickets();

  displayTickets([newTicket]);
  form.reset();
});

function displayTickets(tickets) {
  if (tickets.length === 0) {
    displayArea.textContent = 'No tickets found.';
    return;
  }
  displayArea.innerHTML = '';
  tickets.forEach((ticket, index) => {
    const div = document.createElement('div');
    div.style.border = '1px solid #ccc';
    div.style.padding = '10px';
    div.style.marginBottom = '10px';

    const details = document.createElement('pre');
    details.textContent = ticket.getDetails();
    div.appendChild(details);

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Toggle Status';
    toggleBtn.onclick = () => {
      ticket.toggleStatus();
      saveTickets();
      displayTickets([ticket]);
    };
    div.appendChild(toggleBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Ticket';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.onclick = () => {
      supportSystem.tickets.splice(supportSystem.tickets.indexOf(ticket), 1);
      saveTickets();
      displayTickets(supportSystem.getAllTickets());
    };
    div.appendChild(deleteBtn);

    displayArea.appendChild(div);
  });
}
document.getElementById('searchBtn').onclick = () => {
  const term = searchInput.value.trim();
  if (!term) {
    alert('Enter a search term.');
    return;
  }
  let results = [];
  if (searchTypeSelect.value === 'name') {
    results = supportSystem.searchByName(term);
  } else {
    const ticket = supportSystem.searchByNumber(term);
    if (ticket) results.push(ticket);
  }
  displayTickets(results);
};
document.getElementById('showAllBtn').onclick = () => {
  displayTickets(supportSystem.getAllTickets());
};

clearBtn.onclick = () => {
  displayArea.innerHTML = '';
};