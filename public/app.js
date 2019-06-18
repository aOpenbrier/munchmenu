let menu, newMenu
let tabplaceholder = document.createElement('option')
tabplaceholder.value = ''
tabplaceholder.innerText = 'Select a Menu Tab'
tabplaceholder.setAttribute('selected', true)
document.getElementById('menutabselect').appendChild(tabplaceholder)

fetch('https://www.adamopenbrier.com/munchthai/assets/js/menu.json')
    .then(r => r.json())
    .then(r => {
        menu = r
        newMenu = r
        console.log(r)
        r.forEach((tab, tabIndex) => {
            let taboption = document.createElement('option')
            taboption.value = tabIndex
            taboption.innerText = tab.id
            document.getElementById('menutabselect').appendChild(taboption)
        })
    })
    .catch(e => console.log(e))

function tabSelect(event) {
    document.getElementById('item-list').innerHTML = ''
    document.getElementById('menusectionselect').innerHTML = ''
    document.getElementById('menusectionselect').dataset.tab = ''
    if (event.target.value) {
        document.getElementById('menusectionselect').dataset.tab = event.target.value
        let selectplaceholder = document.createElement('option')
        selectplaceholder.value = ''
        selectplaceholder.innerText = 'Select a Menu Section'
        selectplaceholder.setAttribute('selected', true)
        document.getElementById('menusectionselect').appendChild(selectplaceholder)
        newMenu[event.target.value].sections.forEach((section, sIndex) => {
            let option = document.createElement('option')
            option.value = sIndex
            option.innerText = section["section title"]
            document.getElementById('menusectionselect').appendChild(option)
        })
    }
}

function sectionSelect(event) {
    document.getElementById('item-list').innerHTML = ''
    if (event.target.value) {
 
        newMenu[event.target.dataset.tab].sections[parseInt(event.target.value)]["section items"].forEach((item, iIndex) => {

            let itemForm = document.createElement('div')
            itemForm.className = 'card mb-2 p-2'
            itemForm.innerHTML = `
                    <form>
                    <div class="form-group">
                        <label for="itemname">Name: </label>
                        <input type="text" name="name" id="itemname" class="w-100" value="${item.name || ""}">
                    </div>

                    <div class="form-group">
                        <label for="itemdescription">Description: </label>
                        <textarea name="description" id="itemdescription" rows="2" class="w-100">${item.description || ""}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="itemprice">Price: </label>
                        <input type="number" name="price" id="itemprice" class="w-100" value="${item.price || ""}">
                    </div>

                    <div class="form-group">
                        <label for="itemextras">Extras: </label>
                        <textarea name="extras" id="itemextras" rows="3" class="w-100">${item.extras || ""}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="itemoptions">Options: </label>
                        <textarea name="options" id="itemoptions" rows="3" class="w-100" >${item.options || ""}</textarea>

                    </div>

                    <div class="form-group">
                        <label for="itemfeatured">Featured: </label>
                        <input type="checkbox" name="featured" id="itemfeatured" ${item.featured ? "checked" : ""} >
                    </div>

                    <div class="form-group">
                        <label for="itemvegan">Vegan: </label>
                        <input type="checkbox" name="vegan" id="itemvegan" ${item.vegan ? "checked" : ""} >
                    </div>

                    <div class="form-group">
                        <label for="itemvegetarian">Vegetarian: </label>
                        <input type="checkbox" name="vegetarian" id="itemvegetarian" ${item.vegetarian ? "checked" : ""} >
                    </div>

                    <div class="form-group">
                        <label for="itemglutenoption">Gluten Free Option: </label>
                        <input type="checkbox" name="glutenoption" id="itemglutenoption" ${item["gf option"] ? "checked" : ""}>
                    </div>
                </form>`
            document.getElementById('item-list').appendChild(itemForm)
        })
    }
}


function clearForm() {
    document.getElementById("itemname").value = ''
    document.getElementById("itemdescription").value = ''
    document.getElementById("itemprice").value = ''
    document.getElementById("itemextras").value = ''
    document.getElementById("itemoptions").value = ''
    document.getElementById("itemfeatured").checked = false
    document.getElementById("itemvegan").checked = false
    document.getElementById("itemvegetarian").checked = false
    document.getElementById("itemglutenoption").checked = false
}