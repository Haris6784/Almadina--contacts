// Retrieve saved contacts from LocalStorage
let contactData = JSON.parse(localStorage.getItem('contactData')) || [];
let currentCategory = null;  // Track current category

// Helper function to check for duplicate contacts
function isContactExists(phone) {
    return contactData.some(contact => contact.phone === formatPhoneNumber(phone));
}

// Helper function to format phone numbers to the correct format (+92XXXXXXXXXX)
function formatPhoneNumber(phone) {
    // Remove any non-numeric characters and ensure the number starts with +92
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('92')) {
        return `+${formattedPhone}`;
    } else if (formattedPhone.startsWith('0')) {
        return `+92${formattedPhone.slice(1)}`;
    }
    return `+92${formattedPhone}`;
}

// Predefined contacts with updated phone numbers
const predefinedContacts = {
    'Executive Contacts': [
        { name: "Shabhir Qadri", phone: "+923129832611", category: "Executive Contacts", subcategory: "None" },
        { name: "Muneer Nake", phone: "+923000000002", category: "Executive Contacts", subcategory: "None" }
    ],
    'Employee Contacts': [
        { name: "Asim Shah/Tasleem Shah", phone: "+923007870705", category: "Employee Contacts", subcategory: "None" },
        { name: "Muhammad Ajmal", phone: "+923186837134", category: "Employee Contacts", subcategory: "None" },
        // Add more contacts here...
    ],
    // Add other categories here...
};

// Add predefined contacts ensuring no duplicates
Object.values(predefinedContacts).forEach(addUniqueContacts);

// Save the updated contact list to LocalStorage
localStorage.setItem('contactData', JSON.stringify(contactData));

// Handle form submission
document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = formatPhoneNumber(document.getElementById("phone").value);
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
