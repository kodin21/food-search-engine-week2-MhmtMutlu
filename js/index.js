import 'regenerator-runtime/runtime'

class FoodApp {
    constructor() {
        this.foodsArray = []
        this.favouriteFoods = []
        this.renderApp()
    }

    async renderApp() {
        await this.getUserInformation()
        await this.getFoods()
        console.log(this.foodsArray)
        this.createCards()
    }

    createCards() {
        let cardListDOM = document.querySelector(".card-list")
        this.foodsArray.forEach((food, index) => {cardListDOM.innerHTML += `
            <div id=${index} class="card">
                <img src=${food.fields.strMealThumb}>
                <h3>${food.fields.strMeal}</h3>
                <button id=${index} class="details-button">See Details</button>
            </div>
        `})
        let detailsButtonDOM = document.querySelectorAll(".details-button")
        detailsButtonDOM.forEach(btn => btn.addEventListener("click", (e) => {
            console.log(detailsButtonDOM[e.target.id].id)
            this.openModals(detailsButtonDOM[e.target.id].id)
        }))
    }

    openModals(id) {
        let modalDOM = document.getElementById("modal")
        let meal = this.foodsArray[id]
        modalDOM.innerHTML += `
            <div class="modal-content">
                <img class="modal-image" src=${meal.fields.strMealThumb}>
                <div class="modal-body">
                    <h3>${meal.fields.strMeal}</h3>
                    <p>
                        ${meal.fields.strInstructions.length > 300 
                            ? `${meal.fields.strInstructions.slice(0, 300)}... 
                            <a href=${meal.fields.strYoutube} target="_blank">For More Informations</a>`
                            : meal.fields.strInstructions
                        }
                    </p>
                    <button class="favourite-button"><i class="far fa-heart fa-3x"></i></button>
                </div>
                <span class="close-modal">&times;</span>
            </div>
        `
        modalDOM.style.display= "block"

        this.closeModal()
        this.addToFavourites(meal)
    }

    closeModal() {
        let closeModalDOM = document.querySelector(".close-modal")
        closeModalDOM.addEventListener("click", () => {
            let modalDOM = document.getElementById("modal")
            modalDOM.innerHTML = ""
            modalDOM.style.display = "none"
        })
    }

    addToFavourites(meal) {
        let favouriteButtonDOM = document.querySelector(".favourite-button")
        favouriteButtonDOM.addEventListener("click", () => {
            console.log(meal.fields.strMeal)
            favouriteButtonDOM.innerHTML = `<i class="fas fa-heart fa-3x"></i>`
        })
    }

    removeFromFavourites() {
        let favouriteButtonDOM = document.querySelector(".favourite-button")
        favouriteButtonDOM.addEventListener("click", () => {
            favouriteButtonDOM.innerHTML = `<i class="far fa-heart fa-3x"></i>`
        })
    }

    async getUserInformation() {
        await fetch("https://jsonplaceholder.typicode.com/users/1")
            .then(response => response.json())
            .then(json => {
                const userName = json.name
                let headerTitleDOM = document.querySelector(".header-title")
                headerTitleDOM.innerText = `Hello, ${userName}!`
            })
    }

    async getFoods() {
        await fetch("https://api.airtable.com/v0/appyLL3B6PD1W44kF/Grid%20view?api_key=keynJKkfPVvo4RLJf")
            .then(response => response.json())
            .then(json => {
                json.records.forEach(food => {this.foodsArray.push(food)})
            })
    }
}


new FoodApp()