//storage controlle


//item controller
const ItemCtrl = (function(){
    //item constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    
    //data structure / State
    const data = {
        items: [
            // {id:0, name: 'Steak Dinner', calories: 1200},
            //     {id:1, name: 'Cookie ', calories: 400},
            //     {id:2, name: 'Eggs ', calories: 300}
            ],
        currentItem: null,
        totalCalories: 0
    }

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


        logData: function() {
            return data;
        }
    }
})();

//UI controller
const UICtrl = (function(){
    const UISelector = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
    }
    
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
        hideList: function(){
            document.querySelector(UISelector.itemList).style.display = 'none';
        },
        getSelectors: function() {
            return UISelector;
        }
    }
})();

//app controller
const App = (function(ItemCtrl, UI){
    //load event listeners
    const loadEventListeners = function() {
        //get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    }

    //add item submit
    const itemAddSubmit = function(e) {
        e.preventDefault();
        //get for input from UI controller
        const input = UICtrl.getItemInput();

        //check for name add calories input
        if(input.name !== '' && input.calories !== '') {
            //add item
           const newItem = ItemCtrl.addItem(input.name, input.calories);
        
            UICtrl.addListItem(newItem);

            //clear fields
            UICtrl.clearInput();
        }
    }


    //Public methods 
    return {
        init: function() {
            console.log('Initializing app..');

            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if any items
            if(items.length===0){
                UICtrl.hideList();
            }else{
                UICtrl.populateItemList();
            }

            //populate list with items
            UICtrl.populateItemList(items);

            //load event lissteners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);


App.init();