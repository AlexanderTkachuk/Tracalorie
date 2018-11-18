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
        items: [{id:0, name: 'Steak Dinner', calories: 1200},
                {id:1, name: 'Cookie ', calories: 400},
                {id:2, name: 'Eggs ', calories: 300}],
        currentItem: null,
        totalCalories: 0
    }

    //Public methods
    return {
        getItems: function() {
            return data.items;
        },
        logData: function() {
            return data;
        }
    }
})();

//UI controller
const UICtrl = (function(){
    const UISelector = {
        itemList: '#item-list'
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

        }
    }
})();

//app controller
const App = (function(ItemCtrl, UI){
    


    //Public methods 
    return {
        init: function() {
            console.log('Initializing app..');

            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //populate list with items
            UICtrl.populateItemList(items);
        }
    }
})(ItemCtrl, UICtrl);

App.init();