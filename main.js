function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    return true;
}

function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) 
    {
        displayInfoToast("Please wait...");

        const dataForApiRequest = 
        {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        $.ajax({
            url: API_BASE_URL + 'auth/register/',
            method: 'POST',
            data: dataForApiRequest,
            success: function(data, status, xhr) 
            {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            },
            error: function(xhr, status, err) 
            {
                displayErrorToast('An account using same email or username is already created');
            }
        })
    }
}

function login() 
{
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    if (loginFieldsAreValid(username, password))
    {
        displayInfoToast("Please Wait...");
        const dataForApiRequest = 
        {
            username: username,
            password: password
        }
        $.ajax({
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: dataForApiRequest,
            success: function(data, status, xhr)
            {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
                displaySuccessToast('Login Successful');
            },
            error: function(data, status, xhr)
            {
                displayErrorToast('Wrong Username and/or Password')
            }
        })
    }
}

function loginFieldsAreValid(username, password)
{
    if (username == '' || password == '')
    {
        displayErrorToast("Please Enter All Information Properly");
        return false;
    }
    return true;
}

function addTask() 
{
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const task = document.getElementById("add").value.trim()
    if (task == '')
    {
        displayErrorToast("Invalid")
        return
    }
    displayInfoToast("Please Wait");
    const dataForApiRequest =
    {
        title : task
    }
    $.ajax({
        url : API_BASE_URL + "todo/create/",
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        method: 'POST',
        data: dataForApiRequest,
        success: function(data, status, xhr)
        {
            displaySuccessToast("Task Successfully Added");
            getTasks()
        },
        error: function(data, status, xhr)
        {
            displayErrorToast("Error Occured")
        }
    })
    document.getElementById('add').value = '';
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    displayInfoToast("Please Wait");
    const dataForApiRequest =
    {
        id : id
    }
    $.ajax({
        url : API_BASE_URL + 'todo/' + id + '/',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        },
        method: 'DELETE',
        data: dataForApiRequest,
        success: function(data, status, xhr)
        {
            displaySuccessToast("Task Successfully Deleted");
            getTasks()
        },
        error: function(data, status, xhr)
        {
            displayErrorToast("Error Occured")
        }
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const task = document.getElementById("input-button-" + id).value.trim()
    if (task == '')
    {
        displayErrorToast("Please Enter a value")
        return
    }
    displayInfoToast("Please Wait");
    const dataForApiRequest =
    {
        title : task,
        id : id
    }
    $.ajax({
        url : API_BASE_URL + 'todo/' + id + '/',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        },
        method: 'PUT',
        data: dataForApiRequest,
        success: function(data, status, xhr)
        {
            displaySuccessToast("Task Successfully Updated");
            getTasks()
        },
        error: function(data, status, xhr)
        {
            displayErrorToast("Error Occured")
        }
    })
    document.getElementById('task-' + id).classList.remove('hideme');
    document.getElementById('task-actions-' + id).classList.remove('hideme');
    document.getElementById('input-button-' + id).classList.add('hideme');
    document.getElementById('done-button-' + id).classList.add('hideme');
}
