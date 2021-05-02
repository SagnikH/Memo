//Link Class: Represents the Link
class List{
    constructor(description, link, title){
        this.description = description;
        this.link = link;
        this.title = title;
    }
}

//Storage Class : To work with Local storage
class Storage{
    //extracting the data from the local storage
    static getData(){
        let items;
        if(localStorage.getItem("items") === null)
            items = [];
        else
            items = JSON.parse(localStorage.getItem("items"));

        return items;
    }

    static addItem(item){
        let items = Storage.getData();
        items.push(item);

        localStorage.setItem("items", JSON.stringify(items));
    }

    static removeItem(title){
        let items = Storage.getData();
        
        items.forEach((item, index)=>{
            if(item.title === title){
                console.log("in Storage remove");
                items.splice(index, 1);
            }
        });

        localStorage.setItem("items", JSON.stringify(items));
    }
}

//UI Class : To handle the UI components of the website
class UI{
    static displayList(){
        const lists = Storage.getData();

        lists.forEach((list) => UI.addItemToList(list));
    }

    static addItemToList(item){
        console.log(item);
        const list = document.querySelector("#linkList");

        const row = document.createElement('tr');
        row.classList.add('center-align');

        row.innerHTML = `
        <td class="left-align">
            <ul class="collapsible">
                <li>
                    <div class="collapsible-header" id="title">${item.title}</div>
                    <div class="collapsible-body">
                        <span id="link"><b>Link : </b><a href="${item.link}" target="_blank">${item.link}</a></span><br><br>
                        <span id="description"><b>Description : </b> ${item.description}</span>
                    </div>
                </li>
            </ul>
        </td>
        <td class="center-align"><a href="#" class="small material-icons red black-text delete">delete_forever</a></td>
        `;

        list.appendChild(row);
        // document.querySelectorAll('collapsible').collapsible();
    }

    static removeItemFromList(e){
        if(e.classList.contains('delete')){
            // console.log(e.parentElement.parentElement);
            e.parentElement.parentElement.remove();
    
            UI.showAlert("Item Deleted!!", "red");
        }
    }

    static insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    static showAlert(message, color){
        const div = document.createElement('div');
        div.classList.add("row", "alert");

        div.innerHTML = `<div class="col s8 offset-s2">
                            <div class="row card-panel ${color} accent-4 center-align">${message}</div>
                         </div>
        `;

        const appendelment = document.querySelector('#heading');
        UI.insertAfter(div, appendelment);

        setTimeout(()=>document.querySelector(".alert").remove(), 3000);
    }

    static clearFields(){
        document.querySelector("#title").value = "";
        document.querySelector("#link").value = "";
        document.querySelector("#description").value = "";
    }
}

//Event : Display books on load
document.addEventListener('DOMContentLoaded', UI.displayList());

//Event : Add books to the list
document.querySelector(".insertForm").addEventListener('submit', e=>{
    e.preventDefault();

    const title  = document.querySelector("#title").value;
    const link = document.querySelector("#link").value;
    const description = document.querySelector("#description").value;

    if(title==="" || link==="" || description===""){
        UI.showAlert("Please fill all the fields!!", "amber");
    }
    else{
        //TODO: add validation for unique titles

        const item = new List(description, link, title);

        //item is added to the UI
        UI.addItemToList(item);
        //item is added to the local storage
        Storage.addItem(item);
        UI.clearFields();
        UI.showAlert("Succesfully added!!", "green");
    }
});

//Event : Delete books from the list
document.querySelector("#linkList").addEventListener('click', e =>{
    let targetValue = e.target.parentElement.previousSibling.previousSibling.children[0].children[0].children[0].textContent;
    UI.removeItemFromList(e.target);
    Storage.removeItem(targetValue);
    console.log(targetValue);
});