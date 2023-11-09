"use strict";

console.clear();


function Task(description, cost) {
    if (new.target !== IncomeTask && new.target !==ExpenseTask) {
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
        // budget.income + cost
    }

    makeUnDone(budget) {
        // budget.income - cost
    }
    
}

class ExpenseTask extends Task {
    
    constructor(description, cost) {
        super(description, cost);
    }

    makeDone(budget) {
        // budget.expenses + cost
    }

    makeUnDone(budget) {
        // budget.expenses - cost
    }
}

class TasksController {
    #tasks;

    constructor(tasks) {
        this.#tasks = tasks;
    }

    get tasks(){
        return this.#tasks;
    }


}

