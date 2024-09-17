// Retrieve saved contacts from LocalStorage
let contactData = JSON.parse(localStorage.getItem('contactData')) || [];
let currentCategory = null;  // Track current category

// Helper function to check for duplicate contacts
function isContactExists(phone) {
    return contactData.some(contact => contact.phone === phone);
}

// Predefined contacts with updated phone numbers
const predefinedContacts = {
    'Executive Contacts': [
        { name: "Shabhir Qadri", phone: "+92312-9832611", category: "Executive Contacts", subcategory: "None" },
        { name: "Muneer Nake ", phone: "+92300-0000002", category: "Executive Contacts", subcategory: "None" }
    ],
    'Employee Contacts': [
        { name: "Asim Shah/Tasleem Shah", phone: "+92300-7870705", category: "Employee Contacts", subcategory: "None" },
        { name: "Muhammad Ajmal", phone: "+92318-6837134", category: "Employee Contacts", subcategory: "None" },
        { name: "Muhammad Ateeq", phone: "+92340-7488060", category: "Employee Contacts", subcategory: "None" },
        { name: "Waqas Ahmed Dhoon", phone: "+92306-9052240", category: "Employee Contacts", subcategory: "None" },
        { name: "Waqas Ahmed Jora", phone: "+92301-6067646", category: "Employee Contacts", subcategory: "None" },
        { name: "Muhammad Fawad Azam", phone: "+92304-8523826", category: "Employee Contacts", subcategory: "None" },
        { name: "Faraz Sadeeqi", phone: "+92312-5829431", category: "Employee Contacts", subcategory: "None" },
        { name: "Syed Najaf Ali Shah", phone: "+92342-9329803", category: "Employee Contacts", subcategory: "None" },
        { name: "Asim Khan", phone: "+92305-2443790", category: "Employee Contacts", subcategory: "None" },
        { name: "Nemat Ullah", phone: "+92332-5062164", category: "Employee Contacts", subcategory: "None" },
        { name: "Maqsood ul Hassan", phone: "+92319-6538656", category: "Employee Contacts", subcategory: "None" },
        { name: "Muhammad Bilal", phone: "+92316-7460238", category: "Employee Contacts", subcategory: "None" },
        { name: "Muhammad Irfan", phone: "+92310-7878370", category: "Employee Contacts", subcategory: "None" },
        { name: "Muhammad Haris", phone: "+92309-0295583", category: "Employee Contacts", subcategory: "None" },
        { name: "Ahtesham", phone: "+92320-0956752", category: "Employee Contacts", subcategory: "None" }
    ],
    'Shop Keepers Contacts': [
        { name: "Shopkeeper 1", phone: "+92300-0000005", category: "Shop Keepers Contacts", subcategory: "None" },
        { name: "Shopkeeper 2", phone: "+92300-0000006", category: "Shop Keepers Contacts", subcategory: "None" }
    ],
    'Suppliers Contacts': [
        { name: "Supplier 1", phone: "+92300-0000007", category: "Suppliers Contacts", subcategory: "None" },
        { name: "Supplier 2", phone: "+92300-0000008", category: "Suppliers Contacts", subcategory: "None" }
    ],
    'Brokers Numbers': [
        { name: "Ramzan Shaloli Jazz", phone: "+92301-7150540", category: "Brokers Numbers", subcategory: "None" },
        { name: "Ramzan Shaloli Telenor", phone: "+92346-7779039", category: "Brokers Numbers", subcategory: "None" },
        { name: "Rana Habib Mithu", phone: "+92300-2667626", category: "Brokers Numbers", subcategory: "None" }
    ],
    'Drivers Contacts': [
        { name: "Driver 1", phone: "+92300-0000011", category: "Drivers Contacts", subcategory: "None" },
        { name: "Driver 2", phone: "+92300-0000012", category: "Drivers Contacts", subcategory: "None" }
    ],
    'Local Contacts': [
        { name: "Driver 1", phone: "+92300-0000011", category: "Drivers Contacts", subcategory: "None" },
        { name: "Driver 2", phone: "+92300-0000012", category: "Drivers Contacts", subcategory: "None" }
    ]
};


// Add predefined contacts ensuring no duplicates
Object.values(predefinedContacts).forEach(addUniqueContacts);

// Save the updated contact list to LocalStorage
localStorage.setItem('contactData', JSON.stringify(contactData));

// Handle form submission
document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const category = document.getElementById("category").value;
    const subcategory = category === "Shop Keepers Contacts" ? document.getElementById("subcategory").value : "None";

    if (!isContactExists(phone)) {
        saveContact(name, phone, category, subcategory);
    } else {
        alert("This contact already exists.");
    }

    // Clear form fields
    document.getElementById("contact-form").reset();
    document.getElementById("subcategory").disabled = true; // Reset subcategory disable
});

// Show subcategories only for Shop Keepers Contacts
document.getElementById("category").addEventListener("change", function () {
    const subcategoryElement = document.getElementById("subcategory");
    subcategoryElement.disabled = this.value !== "Shop Keepers Contacts";
});

// Function to save the contact to LocalStorage
function saveContact(name, phone, category, subcategory) {
    contactData.push({ name, phone, category, subcategory });
    localStorage.setItem('contactData', JSON.stringify(contactData));
    alert(`Contact saved: ${name}, ${phone}, ${category}, ${subcategory}`);
}

// Function to view contacts by category or subcategory
function viewContacts(categoryOrSubcategory) {
    currentCategory = categoryOrSubcategory;
    document.getElementById("search-section").style.display = "block";
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";

    const filteredContacts = contactData.filter(contact => 
        contact.category === categoryOrSubcategory || contact.subcategory === categoryOrSubcategory
    );

    if (!filteredContacts.length) {
        contactList.innerHTML = `<div class="alert alert-warning">No contacts found for ${categoryOrSubcategory}</div>`;
        return;
    }

    filteredContacts.forEach((contact, index) => {
        const contactItem = document.createElement("div");
        contactItem.className = "d-flex justify-content-between align-items-center bg-light p-2 mb-2 border rounded";
        contactItem.innerHTML = `
            <span>${contact.name} - ${contact.phone}</span>
            <div>
                <a href="tel:${contact.phone}" class="btn btn-primary me-2">Call</a>
                <a href="https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}" class="btn btn-success me-2">WhatsApp</a>
                <button class="btn btn-warning me-2" onclick="editContact(${index})">Edit</button>
                <button class="btn btn-danger delete-btn" onclick="deleteContact(${index})">Delete</button>
            </div>
        `;
        contactList.appendChild(contactItem);
    });

    const downloadButton = document.createElement("button");
    downloadButton.className = "btn btn-secondary mt-3";
    downloadButton.textContent = "Download Contacts";
    downloadButton.onclick = () => downloadContacts(categoryOrSubcategory, filteredContacts);
    contactList.appendChild(downloadButton);
}

// Function to search contacts within a category
function searchCategoryContacts() {
    const searchQuery = document.getElementById("category-search-input").value.toLowerCase();
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";

    const filteredContacts = contactData.filter(contact => 
        (contact.category === currentCategory || contact.subcategory === currentCategory) &&
        (contact.name.toLowerCase().includes(searchQuery) || contact.phone.includes(searchQuery))
    );

    if (!filteredContacts.length) {
        contactList.innerHTML = `<div class="alert alert-warning">No contacts found.</div>`;
        return;
    }

    filteredContacts.forEach((contact, index) => {
        const contactItem = document.createElement("div");
        contactItem.className = "d-flex justify-content-between align-items-center bg-light p-2 mb-2 border rounded";
        contactItem.innerHTML = `
            <span>${contact.name} - ${contact.phone}</span>
            <div>
                <a href="tel:${contact.phone}" class="btn btn-primary me-2">Call</a>
                <a href="https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}" class="btn btn-success me-2">WhatsApp</a>
                <button class="btn btn-warning me-2" onclick="editContact(${index})">Edit</button>
                <button class="btn btn-danger delete-btn" onclick="deleteContact(${index})">Delete</button>
            </div>
        `;
        contactList.appendChild(contactItem);
    });
}

// Function to edit a contact
function editContact(index) {
    const contact = contactData[index];
    document.getElementById("name").value = contact.name;
    document.getElementById("phone").value = contact.phone;
    document.getElementById("category").value = contact.category;

    if (contact.category === "Shop Keepers Contacts") {
        document.getElementById("subcategory").value = contact.subcategory;
        document.getElementById("subcategory").disabled = false;
    } else {
        document.getElementById("subcategory").disabled = true;
    }

    // Remove the contact from the list to allow updating
    contactData.splice(index, 1);
    localStorage.setItem('contactData', JSON.stringify(contactData));
}

// Function to delete a contact
function deleteContact(index) {
    if (confirm("Are you sure you want to delete this contact?")) {
        contactData.splice(index, 1);
        localStorage.setItem('contactData', JSON.stringify(contactData));
        alert("Contact deleted.");
        viewContacts(currentCategory);
    }
}

// Function to download contacts as CSV
function downloadContacts(categoryOrSubcategory, list) {
    let csvContent = "data:text/csv;charset=utf-8,Name,Phone\n";
    list.forEach(contact => {
        csvContent += `${contact.name},${contact.phone}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${categoryOrSubcategory}-contacts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
