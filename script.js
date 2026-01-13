const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
	const itemsFromStorage = getItemFromStorage();
	itemsFromStorage.forEach((item) => addItemToDOM(item));

	checkUI();
}
function onAddItemSubmit(e) {
	e.preventDefault();
	const newItem = itemInput.value;
	// validate Input
	if (newItem === '') {
		alert('please add an item ');
		return;
	}
	// Check for editMode
	if (isEditMode) {
		const itemToEdit = itemList.querySelector('.edit-mode');
		removeItemFromStorage(itemToEdit.textContent);
		itemToEdit.classList.remove('edit-mode');
		itemToEdit.remove();
		isEditMode = false;
	} else {
		if (checkIfItemExist(newItem)) {
			alert('That item is already exists!');
			return;
		}
	}
	// Create item DOM element
	addItemToDOM(newItem);

	// Add item to local storage
	addItemToStorage(newItem);

	checkUI();

	itemInput.value = '';
}

function addItemToDOM(item) {
	// create list item
	const li = document.createElement('li');
	li.appendChild(document.createTextNode(item));
	console.log(li);
	const button = createButton('remove-item btn-link text-red');
	li.appendChild(button);

	// Add li to DOM
	itemList.appendChild(li);
}

function addItemToStorage(item) {
	const itemsFromStorage = getItemFromStorage();

	// if (localStorage.getItem('items') === null) {
	// 	itemsFromStorage = [];
	// } else {
	// 	itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	// }
	// Add new item to array
	itemsFromStorage.push(item);

	// convert to json string and set to local storage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function createButton(classes) {
	const button = document.createElement('button');
	button.className = classes;
	const icon = createIcon('fa-solid fa-xmark');
	button.appendChild(icon);
	return button;
}

function createIcon(classes) {
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
}
function getItemFromStorage() {
	let itemsFromStorage = [];

	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}

	return itemsFromStorage;
}

function onClickItem(e) {
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		setItemToEdit(e.target);
	}
}

function checkIfItemExist(item) {
	const itemsFromStorage = getItemFromStorage();
	return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
	isEditMode = true;

	itemList
		.querySelectorAll('li')
		.forEach((i) => i.classList.remove('edit-mode'));

	item.classList.add('edit-mode');
	formBtn.innerHTML = '<i class ="fa-solid fa-pen"></i>Update Item';
	formBtn.style.background = '#228B22';
	itemInput.value = item.textContent;
}
// Remove the item
function removeItem(item) {
	if (confirm('Are you sure?')) {
		// Remove item from DOM
		item.remove();

		// Remove item from storage
		removeItemFromStorage(item.textContent);

		checkUI();
	}
}

function removeItemFromStorage(item) {
	let itemsFromStorage = getItemFromStorage();
	console.log(itemsFromStorage);
	// filter out item to be removed
	itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}
function clearItem() {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}

	// clear from localSorage
	localStorage.removeItem('items');
	checkUI();
}

// filter items
function filterItems(e) {
	const items = itemList.querySelectorAll('li');
	const text = e.target.value.toLowerCase();

	items.forEach((item) => {
		const itemName = item.firstChild.textContent.toLocaleLowerCase();
		console.log(itemName);

		if (itemName.indexOf(text) != -1) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	});
	console.log(text);
}

function checkUI() {
	itemInput.value = '';
	const items = itemList.querySelectorAll('li');

	if (items.length === 0) {
		clearBtn.style.display = 'none';
		itemFilter.style.display = 'none';
	} else {
		clearBtn.style.display = 'block';
		itemFilter.style.display = 'block';
	}
	formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item';
	formBtn.style.backgroundColor = '#333';
	isEditMode = false;
}

// initialize app
// Event Listener
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItem);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();
