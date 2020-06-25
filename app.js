// BUDGET controller
var budgetController = (function () {

    // function constructor to create expense object 
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }


    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {
            sum = sum + current.value;
        });
        data.totals[type] = sum;
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
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function (type, id) {
            var ids, index;

            // need inestigation !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            ids = data.allItems[type].map(function (current) {
                return current.id
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {

            // 1. calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // 2.calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // 3. calculate the percentages
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        // get the budget object method
        getBudgget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        // testing method
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percenatage',
        dateLabel: '.budget__title--month'

    }

    var formatNumber = function (num, type) {
        var num, numSplit, int, dec, type;
        /*
        plus or minus sign before a number
        exactly 2 decimal points
        comma separating the thousents

        2310.4567 --> + 2,310.46 
        2000 --> 2,000.00
        */

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');

        int = numSplit[0];
        if (int.lenght > 3) {
            int = int.substr(0, int.lenght - 3) + ',' + int.substr(int.lenght - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : "+") + ' ' + int + '.' + dec;

    };

    return {
        // getIput method that returns the object of User inputs from HTML - type, description and value
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        //method to add item to the UI
        addListItem: function (obj, type) {
            var html, newHtml, element;

            // create HTML string with placeholder text 
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function (selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        //method to clear fields on the UI
        clearFields: function () {
            var fields, fieldsArray;

            // get the list of input elements
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            //trick to make array from fields list
            fieldsArray = Array.prototype.slice.call(fields);

            // iterate the arr and clear the fields
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            });

            // add focus to the description field after adding new item 
            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }

        },

        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            //??????????????????????????????????????????????????
            //      WTF??     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.lenght; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '--';
                }

            });

        },

        displayMonth: function () {
            var now, year, month;

            now = new Date();

            year = now.getFullYear;

            month = now.getMonth();

            document.querySelector(DOMstrings.dateLabel).textContent = month;
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget 
        var budget = budgetCtrl.getBudgget();

        // 3. display the budget on the UI
        UIctrl.displayBudget(budget);

    };

    var updatePercentages = function () {

        // 1. calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. read percentages from the budget controller 
        var percentages = budgetCtrl.getPercentages();

        // 3. update the ui with the new percentages
        UIctrl.displayPercentages(percentages);

        console.log(percentages);
    };

    var cntrlAddItem = function () {

        // 1. get the data from input field
        var input = UIctrl.getInput();
        console.log(input);

        // check that input fields are not empty 
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. add item to the budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. add item to UI
            UIctrl.addListItem(newItem, input.type);

            // 4. clear the fields
            UIctrl.clearFields();

            // 5. Calculate and update the budget
            updateBudget();

            // 6. calculate and update percentages
            updatePercentages();
        }

        // display in console that function was called and click button was clicked 
        console.log("Add item buton was clicked")

    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        // yes it is hardcoded cuz the html also hardcoded
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. delet ietem from the user interface
            UIctrl.deleteListItem(itemID);

            // 3. update and show the new budget 
            updateBudget();

            // 4. calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: function () {

            //initialization of the event listeners
            setupEventListeners();

            // display month
            UIctrl.displayMonth();

            //reset values
            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            //start the app
            console.log('application has started');
        }
    };

    // give in the budgetController as budgetCtrl and UIcontroller as UIctrl
})(budgetController, UIcontroller);

//starting the application controller
controller.init();