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
    let _isDone=false;

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
        },
        isDone:{
            get(){
                return _isDone;
            },
            set(isDone){
                _isDone=isDone;
            }
        }
    })
}

class IncomeTask extends Task {

    constructor(description, cost) {
        super(description, cost);
    }

    makeDone(budget) {
        this.isDone = true;
        // budget.income + cost
    }

    makeUnDone(budget) {
        this.isDone = false;
        // budget.income - cost
    }

}

class ExpenseTask extends Task {

    constructor(description, cost) {
        super(description, cost);
    }


    makeDone(budget) {
        this.isDone = true;
        // budget.expenses + cost
    }

    makeUnDone(budget) {
        this.isDone = false;
        // budget.expenses - cost
    }
}

class TasksController {
    #tasks;

    constructor(tasks) {
        this.#tasks = [...tasks];
    }

    addTasks(...tasks) {
        for (let task of tasks) {
            let boolArr = this.#tasks.map(x => x.id === task.id ? false : true);
            if (!boolArr.includes(false)) {
                this.#tasks.push(task);
            }
        }
    }

    getTasks() {
        return [...this.#tasks];
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
            arr.sort(function (a, b) {
                if (b.isDone === a.isDone) {
                    return 0;
                }
                if (b.isDone) {
                    return 1;
                }
                if (a.isDone) {
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
                    if (!task.isDone) {
                        tempArr.splice(index, 1);
                    }
                }
            }
            else {
                for (let task of arr) {
                    let index = tempArr.indexOf(task);
                    if (task.isDone) {
                        tempArr.splice(index, 1);
                    }
                }
            }
            arr = [...tempArr];
        }
        return arr;
    }
}

