/// --------------
// CONFIGURATION : Express imports & other imports and express config   
/// --------------
//write the javascript to import express
const express = require("express")
const app = express()
const HTTP_PORT = process.env.PORT || 8080

app.use(express.static("assets"))

const exphbs = require("express-handlebars");

app.engine(".hbs", exphbs.engine({
extname: ".hbs",
helpers: {
    json: (context) => { return JSON.stringify(context) }
}
}));

app.set("view engine", ".hbs");
app.use(express.urlencoded({ extended: true }))

//array of js object literals which has itemid, item name, item availability.
const itemList = [
{id:"AAP1", item:"Car", img:"car.jpg", forRent:true},
{id:"AAP2", item:"Bike", img:"bike.jpeg", forRent:true},
{id:"AAP3", item:"Helicopter", img:"helicopter.jpg",  forRent:true},
{id:"AAP4", item:"Plane", img:"plane.jpg",  forRent:true},
{id:"AAP5", item: "Ship", img:"ship.jpg", forRent:true},
{id:"AAP6", item: "Bicycle", img:"bicycle.jpg",  forRent:true},
{id:"AAP7", item: "Truck", img:"truck.png",  forRent:true}
]

//by default, display list of all retnal items, res.render home.hbs
app.get("/", (req,res)=>{
console.log(`[DEBUG] GET request received at / endpoint`)
res.render("home", {layout:false, item:itemList})
})


//1.Search for an item
app.post("/search", (req, res) => {
console.log("[DEBUG] POST request received at /search endpoint")

const searchedItemsFromForm = req.body.search.toLowerCase()
console.log(searchedItemsFromForm)
let searchedItemsIndex = []
let searchList = []

for (let i = 0; i <itemList.length; i++) {
    if ((itemList[i].item.toLowerCase().includes(searchedItemsFromForm))){
        searchedItemsIndex.push(i)
    }
}
if (searchedItemsIndex.length !== 0) {
    for(let i = 0; i<searchedItemsIndex.length; i++) {
        const searchedItemInfo = {
            id: itemList[searchedItemsIndex[i]].id,
            item: itemList[searchedItemsIndex[i]].item,
            img: itemList[searchedItemsIndex[i]].img,
            forRent: itemList[searchedItemsIndex[i]].forRent
        }
        searchList.push(searchedItemInfo)
    }
    res.render("home", { layout: false, item: searchList })
    return
}
else {
    const errorMessage = "Uh oh! No results found"
    res.render("error", { layout: false, errormsg: errorMessage })
    return
}
})


app.post("/backToHomepage", (req,res)=>{
console.log(`[DEBUG] request received at /backToHomepage endpoint`)
res.render("home", {layout:false, item: itemList})
})


//2.Return an item
app.post("/rentItem", (req,res)=>{
console.log(`[DEBUG] POST request received at /rentItem endpoint`)
res.render("home", {layout:false, item: itemList})

const rentedItemFromForm = req.body.rentedItems
for (let i = 0; i < itemList.length; i++) {
    if (rentedItemFromForm === itemList[i].item) {
        itemList[i].forRent = false
    }
}
})

//3.Return an item
app.post("/returnAllItems", (req,res)=>{
console.log(`[DEBUG] POST request received at /returnAll endpoint`)
let rentedItemsFromForm = false
for(let i = 0; i < itemList.length; i++) {
    if(!(itemList[i].forRent)) {
        rentedItemsFromForm = true
        break
    }
}

if(rentedItemsFromForm) {
    for(let i = 0; i < itemList.length; i++) {
        itemList[i].forRent = true
    }
    res.render("home", {layout:false, item: itemList})
}
else {
    const errmsg = "No item has been borrowed to be displayed"
    res.render("error", {layout:false, errormsg: errmsg})
}
})


//4.Update Item
app.post("/modify-results", (req, res) => {
console.log(`[DEBUG] POST request received at /modify-results endpoint`);
const ModifierFromForm = req.body.modifyResults;
const modifiedList = [];

if (ModifierFromForm === "availableItems") {
    for (let i = 0; i <itemList.length; i++) {
        if (itemList[i].forRent) {
            const searchedItemInfo = {
            id:itemList[i].id,
            item:itemList[i].item,
            img:itemList[i].img,
            forRent:itemList[i].forRent,
            };
        modifiedList.push(searchedItemInfo);
        }
    }
} 
else if (ModifierFromForm === "rentedItems") {
    for (let i = 0; i <itemList.length; i++) {
        if (!itemList[i].forRent) {
            const searchedItemInfo = {
                id:itemList[i].id,
                item:itemList[i].item,
                img:itemList[i].img,
                forRent:itemList[i].forRent,
            };
        modifiedList.push(searchedItemInfo);
        }
    }
}

if (modifiedList.length >= 1) {
    res.render("home", { layout: false, item: modifiedList });
}
else {
    let errmsg = "No item has been rented to be displayed"
    res.render("error", {layout:false, errormsg: errmsg})
}
});


//5. Error page to go back to homepage
app.post("/backToHomepage", (req,res)=>{
console.log(`[DEBUG] POST request received at /backToHomepage endpoint`)
res.render("home", {layout:false, item: itemList})
})




/// --------------
// START THE SERVER : 
/// --------------
// function that will run when the server starts
const onHttpStart = () => {
console.log(`Server is running on port ${HTTP_PORT}`)
console.log(`Press CTRL+C to exit`)
}
// the code that actually runs the web server app
app.listen(8080, onHttpStart)