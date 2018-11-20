//storage controlle
const StorageCtrl = (function(){

    //public methods
    return {
        storeItem: function(item) {
            let items;
            // check if any items in ls
            if(localStorage.getItem('items') === null) {
                items = [];
                //push new item
                items.push(newItem);

                //set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));

                //push to new item
                items.push(item);

                //re set ls
                localStorage.setItem('items', JSON.stringify(items));

            }
        },

        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        }
    }
})();


//item controller
const ItemCtrl = (function(){
    class Item {
        constructor(id, name, calories) {
            this.id = id;
            this.name = name;
            this.calories = calories;
        }
    }
    
    //data structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    };

    //Public methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            //create ID
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length-1].id + 1;
            } else{
                ID = 0;
            }

            //calories to number
            calories = parseInt(calories);

            //create new item
            newItem = new Item(ID, name, calories);

            //add to items array
            data.items.push(newItem);

            return newItem;
        },

        getCurrentItem: function() {
            return data.currentItem;

        },
        getTotalCalories: function(){
            let total = 0;

            //loop through items and cals
            data.items.forEach(function(item) {
                total += item.calories;
            });

            //set total cal in data structure
            data.totalCalories = total;

            return data.totalCalories;
        },
        getItemById: function(id) {
            let found = null;

            //loop through items
            data.items.forEach(function(item){
                if(item.id === id) {
                    found = item;
                }
            });

            return found;
        },

        updateItem: function(name, calories){
            // calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        deleteItem: function(id) {
            //get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            //get index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index, 1);
        },

        clearAllItems: function() {
            data.items = [];
        },

        setCurrentItem: function(item) {
            data.currentItem = item;
        },

        logData: function() {
            return data;
        }
    }
})();

//UI controller
const UICtrl = (function(){
    const UISelector = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        clearBtn: '.clear-btn'
    };
    
    //Public methods
    return {
        populateItemList: function(items) {
            let html = '';
            items.forEach(function(item) {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class=" edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `;
            });

            //Insert list items
            document.querySelector(UISelector.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelector.itemNameInput).value,
                calories: document.querySelector(UISelector.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //show list
            document.querySelector(UISelector.itemList).style.display = 'block';
            //create li elment
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add id
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class=" edit-item fa fa-pencil"></i>
                </a>
            `;
            //insert item
            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',li);
        },
        clearInput: function(){
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelector.listItems);

            //turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID===`item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class=" edit-item fa fa-pencil"></i>
                    </a>
                    `;
                }
            });
        },

        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        removeItems: function(){
            let listItems = document.querySelectorAll(UISelector.listItems);

            //turn Node list into array 
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },

        addItemToForm: function() {
            document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelector.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
          UICtrl.clearInput();  
          document.querySelector(UISelector.updateBtn).style.display = 'none';
          document.querySelector(UISelector.deleteBtn).style.display = 'none';
          document.querySelector(UISelector.backBtn).style.display = 'none';
          document.querySelector(UISelector.addBtn).style.display = 'inline';

        },
        showEditState: function() {
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
  
          },
        getSelectors: function() {
            return UISelector;
        }
    }
})();

//app controller
const App = (function(ItemCtrl, StorageCtrl, UI){
    //load event listeners
    const loadEventListeners = function() {
        //get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn)
        .addEventListener('click', itemAddSubmit);

        //disable submjt on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        //edit icon click event 
        document.querySelector(UISelectors.itemList)
        .addEventListener('click', itemEditClick);
    

        //update item event
        document.querySelector(UISelectors.updateBtn)
        .addEventListener('click', itemUpdateSubmit);

        //delete item event
        document.querySelector(UISelectors.deleteBtn)
        .addEventListener('click', itemDeleteSubmit);


        //back button event
        document.querySelector(UISelectors.backBtn)
        .addEventListener('click', UICtrl.clearEditState);

        //clear items event
        document.querySelector(UISelectors.clearBtn)
        .addEventListener('click', clearAllItemsClick);
    };

    //add item submit
    const itemAddSubmit = function(e) {
        e.preventDefault();
        //get for input from UI controller
        const input = UICtrl.getItemInput();

        //check for name add calories input
        if(input.name !== '' && input.calories !== '') {
            //add item
           const newItem = ItemCtrl.addItem(input.name, input.calories);
        
           //add item to UI list
            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add totalCalories to UI
            UICtrl.showTotalCalories(totalCalories);

            //store in localStorage
            StorageCtrl.storeItem(newItem);

            //clear fields
            UICtrl.clearInput();
        }
    };

    //click edit item
    const itemEditClick = function(e) {
        e.preventDefault();
        if(e.target.classList.contains('edit-item')) {
             //get list item id(item-0,item-1)
             const listId = e.target.parentNode.parentNode.id;
             
             //break into an array
             const listIdArr = listId.split('-');

             //get the actual id
             const id = parseInt(listIdArr[1]);

             //get item
             const itemToEdit = ItemCtrl.getItemById(id);

              //set current item
              ItemCtrl.setCurrentItem(itemToEdit);

              //add item to form
              UICtrl.addItemToForm();
        }
    };

    const itemUpdateSubmit = function(e) {
        e.preventDefault();

        //get item input
        const input = UICtrl.getItemInput();

        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();
    }

    const itemDeleteSubmit = function(e) {
        e.preventDefault();
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from data structer
        ItemCtrl.deleteItem(currentItem.id);

        //delete from UI 
        UICtrl.deleteListItem(currentItem.id);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

    };

    const clearAllItemsClick = function(e) {
        e.preventDefault();

        //delete all items from data struct
        ItemCtrl.clearAllItems();

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories);

        //remover from UI
        UICtrl.removeItems();

        //hide UL
        UICtrl.hideList();

    };

    //Public methods 
    return {
        init: function() {
            //clear edit state / set initial set        
            UICtrl.clearEditState();

            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if any items
            if(items.length===0){
                UICtrl.hideList();
            }else{
                //populate list with items
                UICtrl.populateItemList(items);
            }

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add totalCalories to UI
            UICtrl.showTotalCalories(totalCalories);

            //load event lissteners
            loadEventListeners();
        }
    };
})(ItemCtrl, StorageCtrl, UICtrl);


App.init();