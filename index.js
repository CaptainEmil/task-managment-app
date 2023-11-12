"use strict";

console.clear();


function Task(description, cost) {
    if (new.target !== IncomeTask && new.target !== ExpenseTask) {
        throw new Error("Function constructor Task cannot be invoked with 'new'");
    }
    if (cost < 0) {
        throw new Error('Cost cannot be negative');
    }
    const _id = "id" + Math.random().toString(16).slice(2);
    const _description = description;
    const _cost = cost;

    Object.defineProperties(this, {
        id: {
            get() {
                return _id;
            }
        },
        description: {
            get() {
                return _description;
            }
        },
        cost: {
            get() {
                return _cost;
            }
        }
    })
}

class IncomeTask extends Task {

    constructor(description, cost) {
        super(description, cost);
    }

    makeDone(budget) {
        budget.income += this.cost;
    }

    makeUnDone(budget) {
        budget.income -= this.cost;
    }

}

class ExpenseTask extends Task {

    constructor(description, cost) {
        super(description, cost);
    }


    makeDone(budget) {
        budget.expenses += this.cost;
    }

    makeUnDone(budget) {
        budget.expenses -= this.cost;
    }
}

class TasksController {
    #tasks;
    #areTasksDone;

    constructor(...tasks) {
        this.#tasks = [...tasks];
        this.#areTasksDone = Array(tasks.length).fill(false);
    }



    addTasks(...tasks) {
        for (let task of tasks) {
            let boolArr = this.#tasks.map(x => x.id === task.id ? false : true);
            if (!boolArr.includes(false)) {
                this.#tasks.push(task);
                this.#areTasksDone.push(false);
            }
        }
    }

    getTasks() {
        return [...this.#tasks];
    }

    getTaskIsDone(task) {
        return this.#areTasksDone[this.#tasks.indexOf(task)];
    }

    deleteTask(task) {
        let index = this.#tasks.indexOf(task);
        if (index !== -1) {
            this.#tasks.splice(index, 1);
        }
    }

    getAreTasksDone() {
        return [...this.#areTasksDone];
    }

    makeTaskDone(task, budget) {
        this.#areTasksDone[this.#tasks.indexOf(task)] = true;
        task.makeDone(budget);
    }

    makeTaskUnDone(task, budget) {
        this.#areTasksDone[this.#tasks.indexOf(task)] = false;
        task.makeUnDone(budget);
    }

    getTasksSortedBy(string) {
        let arr = [...this.#tasks];

        if (string === 'description') {
            arr.sort(function (a, b) {
                if (a.description > b.description) {
                    return 1;
                }
                if (a.description < b.description) {
                    return -1;
                }
                return 0;
            });
        }
        else if (string === 'cost') {
            arr.sort(function (a, b) {
                return a.cost - b.cost;
            });
        }
        else if (string === 'status') {
            let arrOfStatus = [...this.#areTasksDone];
            arr.sort(function (a, b) {
                const aIsDone = arrOfStatus[arr.indexOf(a)];
                const bIsDone = arrOfStatus[arr.indexOf(b)];
                if (bIsDone === aIsDone) {
                    return 0;
                }
                if (bIsDone) {
                    return 1;
                }
                if (aIsDone) {
                    return -1;
                }
            });
        }
        return arr;
    }

    getFilteredTasks(obj) {
        let arr = [...this.#tasks];
        let tempArr = [...this.#tasks];

        if (obj.description !== undefined) {
            for (let task of arr) {
                if (task.description !== obj.description) {
                    tempArr.splice(tempArr.indexOf(task), 1);
                }
            }
            arr = [...tempArr];
        }
        if (obj.isIncome !== undefined) {
            if (obj.isIncome) {
                for (let task of arr) {
                    let index = tempArr.indexOf(task);
                    if (!task instanceof IncomeTask) {
                        tempArr.splice(index, 1);
                    }
                }
            }
            else {
                for (let task of arr) {
                    let index = tempArr.indexOf(task);
                    if (!task instanceof ExpenseTask) {
                        tempArr.splice(index, 1);
                    }
                }
            }
            arr = [...tempArr];
        }
        if (obj.isCompleted !== undefined) {
            if (obj.isCompleted) {
                for (let task of arr) {
                    let index = tempArr.indexOf(task);
                    if (!(this.getTaskIsDone(task))) {
                        tempArr.splice(index, 1);
                    }
                }
            }
            else {
                for (let task of arr) {
                    let index = tempArr.indexOf(task);
                    if (this.getTaskIsDone(task)) {
                        tempArr.splice(index, 1);
                    }
                }
            }
            arr = [...tempArr];
        }
        return arr;
    }
}

class BudgetController {
    #tasksController;
    #budget = {};

    constructor(balance = 0) {
        this.#tasksController = new TasksController();
        this.#budget.balance = balance;
        this.#budget.income = 0;
        this.#budget.expenses = 0;
    }

    get balance() {
        return this.#budget.balance;
    }
    get income() {
        return this.#budget.income;
    }
    get expenses() {
        return this.#budget.expenses;
    }

    calculateBalance() {
        return this.#budget.balance + this.#budget.income - this.#budget.expenses;
    }

    getTasks() {
        return this.#tasksController.getTasks();
    }

    addTasks(...tasks) {
        this.#tasksController.addTasks(...tasks);
    }

    deleteTask(task) {
        if (!(this.#tasksController.getTasks().includes(task))) {
            console.log(`Task ${task.id} isn't recognized`);
            return;
        }
        if (this.#tasksController.getTaskIsDone(task)) {
            this.#tasksController.makeTaskUnDone(task, this.#budget);
        }
        this.#tasksController.deleteTask(task);
    }

    doneTask(task) {
        if (!(this.#tasksController.getTasks().includes(task))) {
            console.log(`Task ${task.id} isn't recognized`);
            return;
        }
        if (this.#tasksController.getTaskIsDone(task)) {
            console.log(`Task is already done`);
            return;
        }
        this.#tasksController.makeTaskDone(task, this.#budget);
    }

    unDoneTask(task) {
        if (!(this.#tasksController.getTasks().includes(task))) {
            console.log(`Task ${task.id} isn't recognized`);
            return;
        }
        if (!(this.#tasksController.getTaskIsDone(task))) {
            console.log(`Task isn't done before`);
            return;
        }
        this.#tasksController.makeTaskUnDone(task, this.#budget);
    }
}
