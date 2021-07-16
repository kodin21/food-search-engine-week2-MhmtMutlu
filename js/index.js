import 'regenerator-runtime/runtime'

class FoodApp {
    constructor() {
        this.foodsArray = []
        this.favouriteFoods = []
        this.renderApp()
    }

    async renderApp() {
        this.favouriteFoods = JSON.parse(localStorage.getItem("favFoods")) || []
        await this.getUserInformation()
        await this.getFoods()
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
            this.openModals(detailsButtonDOM[e.target.id].id)
        }))
    }

    openModals(id) {
        let modalDOM = document.getElementById("modal")
        let meal = this.foodsArray[id]
        let emptyHeart = `<i id="icon" class="far fa-heart fa-3x"></i>`
        let filledHeart = `<i id="icon" class="fas fa-heart fa-3x"></i>`
        modalDOM.innerHTML = `
            <div class="modal-content">
                <img class="modal-image" src=${meal.fields.strMealThumb}>
                <div class="modal-body">
                    <h3>${meal.fields.strMeal}</h3>
                    <p>
                        ${meal.fields.strInstructions.slice(0, 270)}... 
                        <a href=${meal.fields.strYoutube} target="_blank">For More Informations</a>
                    </p>
                    <button class="favourite-button">
                        ${this.favouriteFoods.findIndex((favourite) => {
                           return favourite.id === meal.id
                        }) > -1 
                            ? filledHeart : emptyHeart}
                    </button>
                </div>
                <span class="close-modal">&times;</span>
            </div>
        `
        modalDOM.style.display= "block"

        this.closeModal()
        
        this.handleFavouritesFoods(meal)
    }

    closeModal() {
        let closeModalDOM = document.querySelector(".close-modal")
        closeModalDOM.addEventListener("click", () => {
            let modalDOM = document.getElementById("modal")
            modalDOM.style.display = "none"
        })
    }

    handleFavouritesFoods(meal) {
        let favouriteButtonDOM = document.querySelector(".favourite-button")
        let iconDOM = document.getElementById("icon")
        favouriteButtonDOM.addEventListener("click", () => {
            if (iconDOM.className.includes("fas")) {
                iconDOM.classList = "far fa-heart fa-3x"
                let index = this.favouriteFoods.indexOf(meal, 1)
                this.favouriteFoods.splice(index, 1);
                localStorage.setItem('favFoods', JSON.stringify(this.favouriteFoods));
            } else if(iconDOM.className.includes("far")) {
                this.favouriteFoods.push(meal)
                localStorage.setItem("favFoods", JSON.stringify(this.favouriteFoods))
                iconDOM.classList = "fas fa-heart fa-3x"
            }
            
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