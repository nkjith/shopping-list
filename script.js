const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const filterLabel = document.getElementById('filter');
const formButton = itemForm.querySelector('button');
let isEditMode = false;

const onAddItemSubmit = (event) => {

    event.preventDefault();

    const itemToAdd = itemInput.value;

    if (itemToAdd === '') {
        alert('Please enter an item');
        return;
    }

    if (checkForDuplicate(itemToAdd)) {
        alert('Item already exists in the list');
        itemInput.value = '';
        itemList.querySelector('.edit-mode')?.classList.remove('edit-mode');
        checkUI();
        return;
    }

    if (isEditMode) {
        // get the item which is being edited
        // we have added css class edit-mode, so query with that
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItem(itemToEdit);
        isEditMode = false;
    }

    // Add item to DOM
    addItemToDOM(itemToAdd);

    // Add items to local storage
    addItemToStorage(itemToAdd);

    // After adding, if the filter and clearAll button are hidden, we need to make those visible again
    checkUI();

    itemInput.value = '';
}

const displayItems = () => {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => {
        addItemToDOM(item);
    });
    checkUI();
}

const resetDisplay = () => {

}

const addItemToDOM = (itemToAdd) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(itemToAdd));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

const addItemToStorage = (itemToAdd) => {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(itemToAdd);

    // Convert to json string and store again
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

const getItemsFromStorage = () => {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

/**
 * Handles the click event on an item in the list.
 * Generic because we need to identify where click happened
 * Handle Edit and Delete scenaios
 * @param {Event} event - The click event object.
 */
const onClickItem = (event) => {
    // If the target itself was the li items
    if (event.target.tagName === 'LI') {
        setItemToEdit(event.target);
    }
    // To identify only when the delete icon is clicked - 
    // check if the parent is a button with classes like remove-item
    else if (event.target.parentElement.classList.contains('remove-item')) {
        removeItem(event.target.parentElement.parentElement);
    }
}

const setItemToEdit = (item) => {
    isEditMode = true;

    // if a second item is selected, we need to reset everything back to the original color
    itemList.querySelectorAll('li').forEach((item) => item.classList.remove('edit-mode'));

    // change color of the selected item to see its selected in edit mode
    // edit-mode is in css
    item.classList.add('edit-mode');
    // change color, content and icon of the button
    formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formButton.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent.trim();
}

const removeItem = (item) => {
    // Remove item from DOM
    item.remove();
    // Remove item from local storage
    removeItemFromStorage(item.textContent.trim());
    // After removing, if it was the last item, then we need to clear FilterItem and clearAll
    checkUI();
}

const removeItemFromStorage = (item) => {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter((currItem) => currItem !== item);
    // update the local storage
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

const clearItems = (event) => {
    console.log(event.target);
    //itemList.innerHTML = '';
    // better way and faster
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    // clear from local storage
    localStorage.removeItem('items');
    checkUI();
}

const checkForDuplicate = (newItem) => {
    for (let item of itemList.children) {
        if (newItem.toLowerCase() === item.textContent.trim().toLowerCase()) {
            return true;
        }
    }
}

const createButton = (classes) => {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

const createIcon = (classes) => {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

const checkUI = () => {
    if (itemList.children.length === 0) {
        clearButton.style.display = 'none';
        filterLabel.style.display = 'none';
    }
    else {
        clearButton.style.display = 'block';
        filterLabel.style.display = 'block';
    }

    formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formButton.style.backgroundColor = '#333';
}

const filterItems = (event) => {
    const text = event.target.value.toLowerCase();
    for (let item of itemList.children) {
        if (item.textContent.trim().toLowerCase().startsWith(text)) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';
        }
    }
}

// Initialize listeners
const init = () => {
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItems);
    filterLabel.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
}

init();
