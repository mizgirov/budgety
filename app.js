// BUDGET controller
var budgetController = (function () {

    // function constructor to create expense object 
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // object for storing all data - incomes and expenses and totals // DATA STORAGE
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        // method to adding the data from input to the data storage 
        addItem: function (type, des, val) {
            var newItem, ID;

            //the id should be the last index of the element in array plus one
            if (data.allItems[type].lenght > 0) {
                ID = data.allItems[type][data.allItems[type].lenght - 1].id + 1;
            } else {
                ID = 0;
            }


            // if the input type = expenses create ne expense object 
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // add new object from input to the data storage
            data.allItems[type].push(newItem);

            //return new element
            return newItem;

        },

        checkData: function () {
            console.log(data);
        }
    }
})();


// UI controller
var UIcontroller = (function () {

    // storing all the css selectors inside the object 
    DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        // getIput method that returns the object of User inputs from HTML - type, description and value
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        //method to add item to the UI
        addListItem: function (obj, type) {

            // create HTML string with placeholder text 

            // replace placeholder text with actual data

            // insert the HTML into the DOM

        },

        // making the DOM strings object public
        getDOMstrings: function () {
            return DOMstrings;
        }

    };

})();


// Global app controller 
var controller = (function (budgetCtrl, UIctrl) {

    //setting up all the event listeners
    var setupEventListeners = function () {

        // getting the dom strings object from UI controller
        var DOM = UIctrl.getDOMstrings();

        // event listener for clicking the add item button 
        document.querySelector(DOM.inputBtn).addEventListener('click', cntrlAddItem);

        // event listener for pressing the enter button on the keyboard 
        document.addEventListener('keypress', function (event) {

            // make sure that exactly the Enter button was clicked
            if (event.keyCode === 13) {

                // call teh function to add the item - same as click add button 
                cntrlAddItem();

                console.log('Enter was pressed')

            } else {
                console.log(event.code + ' was pressed!')
            };

        });
    };

    var cntrlAddItem = function () {

        // 1. get the data from input field
        var input = UIctrl.getInput();
        console.log(input);

        // 2. add item to the budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. add item to UI

        // 4. calculatethe budget

        // 5. display the budget on UI

        // display in console that function was called and click button was clicked 
        console.log("Add item buton was clicked")

    };

    return {
        init: function () {
            //initialization of the event listeners
            setupEventListeners();

            //start the app
            console.log('application has started');
        }
    };

    // give in the budgetController as budgetCtrl and UIcontroller as UIctrl
})(budgetController, UIcontroller);

//starting the application controller
controller.init();