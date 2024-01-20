const inputBox = document.querySelector('#input-box');
const taskContainer = document.querySelector('.task-items');
const addBtn = document.querySelector('#addBtn');
const errorBox = document.querySelector('.error');
const tasks = document.querySelector('.task');
const pendingTask = document.querySelector('#pending-tasks');
const createdTasks = document.querySelector('#created-tasks');
let tasksContents = [];

/* -----------------------CODE TO CREATE DATE AND TIME----------------------- */
const date = () => {
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.toLocaleDateString('en-US', { month: '2-digit'});
    let year = currentDate.getFullYear();

    day = checkTime(day);
    
    return `${day}-${month}-${year}`;
}

const time = () => {
    let currentDate = new Date();
    let compHrs = currentDate.getHours();
    let compMin = currentDate.getMinutes();
    let compSec = currentDate.getSeconds();
    compHrs = checkTime(compHrs);
    compMin = checkTime(compMin);
    compSec = checkTime(compSec);

    return `${compHrs} : ${compMin} : ${compSec}`;
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}

/* -----------------END---------------------- */


/* --------------CODE TO TASK-COUNTER VARIABLES */
    
let created = '0';
let pending = '0';
let startDate, completeDate, startTime, completeTime;


const createdValue = (created) => {
    createdTasks.innerHTML = created;
}
const pendingValue = (pending) => {
    pendingTask.innerHTML = pending;
    pending == 0? pendingTask.style.color = 'green' : pending <= Math.floor(created *  0.25) ? pendingTask.style.color = 'yellow': pendingTask.style.color = 'red';
}

/* ------------END------------------- */

/*----------------FUNCTION FOR ERROR-BOX---------------------- */

const hideAndShowElement = () => {
    errorBox.style.display = 'none';
    const delay = 2;
    setTimeout(() => {
        errorBox.style.display = 'block';
    }, delay);
};

/*---------END------------- */

/* --------------------------ADD-TASK FUNCTION------------------------ */

const addTask = () => {
    const taskText = inputBox.value.trim();
    
    if(taskText !== ''){
        errorBox.style.display = 'none';
        const task = {
            text: taskText,
            timeStamp: time(),
            dateStamp: date(),
            completeTime: null,
            completeDate: null,
        }

        tasksContents.push(task);

        let li = document.createElement('li');
        li.innerText = taskText;

        li.dataset.index = tasksContents.length - 1;

        taskContainer.appendChild(li);

        let span = document.createElement('span');
        span.innerHTML = `<i class="fa-solid fa-trash"></i>`
        li.appendChild(span);
        li.insertAdjacentHTML('beforeend', `
            <div class="time-stamp">
                <div class="added">
                    <h6>Add Time</h6>
                    <p><small>${task.timeStamp}</small> <br> <small>${task.dateStamp}</small></p>
                </div>
                <div class="completed" style="display: none;">
                    <h6>Complete Time</h6>
                    <p><small class="timeStampSpan">${task.completeTime}</small> <br> <small class="dateStampSpan">${task.completeDate}</small></p>
                </div>                    
            </div> 
        `);

        created = (parseInt(created) + 1).toString();
        pending = (parseInt(pending) + 1).toString();

        pendingValue(pending);
        createdValue(created);

        saveData();
    }

    else if(inputBox.value === ''){
        
        navigator.vibrate(500);
        hideAndShowElement();
    }
    
    inputBox.value = '';
};

/* ---------------END--------------------- */

/*------------------------CODE TO UPDATE COMPLETED------------------------------*/

const updateCompleteTime = async (index) => {
    if (index >= 0 && index < tasksContents.length) {
        const task = tasksContents[index];
        if (task) {
            const li = taskContainer.querySelector(`li[data-index="${index}"]`);
            if (li) {
                const completeTime = li.querySelector('.completed');
                const timeStampSpan = completeTime.querySelector('.timeStampSpan');

                if (li.classList.contains('checked')) {
                    // If 'checked' class is added, update completeTime
                    task.completeTime = await time();
                } else {
                    // If 'checked' class is removed, clear completeTime
                    task.completeTime = null;
                }

                if (completeTime && timeStampSpan) {
                    timeStampSpan.textContent = task.completeTime;
                    saveData();
                }
            }
        }
    }
}

const updateCompleteDate = async (index) => {
    if (index >= 0 && index < tasksContents.length) {
        const task = tasksContents[index];
        if (task) {
            const li = taskContainer.querySelector(`li[data-index="${index}"]`);
            if (li) {
                const completeDate = li.querySelector('.completed');
                const dateStampSpan = completeDate.querySelector('.dateStampSpan');

                if (li.classList.contains('checked')) {
                    // If 'checked' class is added, update completeDate
                    task.completeDate = await date();
                } else {
                    // If 'checked' class is removed, clear completeDate
                    task.completeDate = null;
                }

                if (completeDate && dateStampSpan) {
                    dateStampSpan.textContent = task.completeDate;
                    saveData();
                }
            }
        }
    }
}


/*--------------------------END----------------------------*/

/* -----------------CODE TO ADD & REMOVE TASKS-------------------- */

inputBox.addEventListener('keyup', e => {
    if (e.key == 'Enter') {
        addTask();
        console.log(tasksContents);
    }
    saveData();
    showTasks();
});

addBtn.addEventListener('click', e => {
    addTask();
    console.log(tasksContents);
    saveData();
    showTasks();
});

const updateDataIndexes = () => {
    const liElements = document.querySelectorAll('.task-items li');
    liElements.forEach((li, index) => {
        li.dataset.index = index;
    });
};


taskContainer.addEventListener('click', e => {

    const li = e.target.closest('li');
    if (!li) return;

    if(e.target.tagName ==='LI' || e.target.classList.contains('time-stamp')){
        const completeTime = li.querySelector('.completed');


        li.classList.toggle('checked');

        if(li.classList.contains('checked')){
            pending--;
            pendingValue(pending);
            completeTime.style.display = 'block';
        } else {
            pending++;
            pendingValue(pending);
            completeTime.style.display = 'none';
        }
        
        const index = parseInt(li.dataset.index);
        updateCompleteTime(index);
        updateCompleteDate(index);
        console.log(tasksContents);
        saveData();
    } 

    else if (e.target.tagName === 'SPAN' || e.target.tagName === 'I') {
        const index = parseInt(li.dataset.index);

        li.remove();
        if (li.classList.contains('checked')) {
            created--;
            createdValue(created);
        } else {
            created--;
            pending--;
            createdValue(created);
            pendingValue(pending);
        }

        tasksContents.splice(index, 1);

        updateDataIndexes();
        console.log(tasksContents);

        saveData();
    }
}, false);

/* --------------------------END------------------------- */

/* ------------------ CODE TO SAVE AND RECALL DATA ON PAGE RELOAD-------------------- */

const saveTasksContents = () => {
    localStorage.setItem('tasksContents', JSON.stringify(tasksContents));
};

const saveData = () => {
    localStorage.setItem('data', taskContainer.innerHTML);
    localStorage.setItem('createdTasks', created);
    localStorage.setItem('pendingTasks', pending);
    saveTasksContents();
}

const showTasks = () => {
    taskContainer.innerHTML = localStorage.getItem('data');

    created = parseInt(localStorage.getItem('createdTasks')) || 0;
    pending = parseInt(localStorage.getItem('pendingTasks')) || 0;

    createdValue(created);
    pendingValue(pending);

    const storedTasksContents = localStorage.getItem('tasksContents');
    tasksContents = storedTasksContents ? JSON.parse(storedTasksContents) : [];
}

/* --------------------------END------------------------------------ */

showTasks();