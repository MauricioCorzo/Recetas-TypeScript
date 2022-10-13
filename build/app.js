// import bootstrap from "bootstrap";
// SELECTORES
const selectCategorias = document.querySelector("#categorias");
const resultado = document.querySelector("#resultado");
const modal = new bootstrap.Modal("#modal", {});
//FUNCIONES
const obtenerCategorias = async () => {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    const data = await fetch(url);
    const respuesta = await data.json();
    mostrarCategorias(respuesta);
};
const mostrarCategorias = ({ categories }) => {
    categories.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.strCategory;
        option.textContent = categoria.strCategory;
        // console.log(option);
        selectCategorias?.appendChild(option);
    });
};
const seleccionarCategoria = async (e) => {
    const categoriaValue = e.target.value;
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoriaValue}`);
    const { meals } = await data.json();
    mostrarComidas(meals);
};
//Boton de receta y activacion del modal
const seleccionarReceta = async (id) => {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const data = await fetch(url);
    const { meals } = await data.json();
    const [meal] = meals;
    mostrarRecetaModal(meal);
};
const mostrarRecetaModal = (meal) => {
    const { strInstructions, strMeal, strMealThumb } = meal;
    //Añadir Contenido al Modal
    const modalTitle = document.querySelector(".modal .modal-title");
    const modalBody = document.querySelector(".modal .modal-body");
    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `
        <img class="img-fluid" src=${strMealThumb} alt=receta ${strMeal}>
        <h3 class="my-3 text-center">Instrucciones</h3>
        <p>${strInstructions}</p>
    `;
    //Muestra el Modal
    modal.show();
};
//Limpia el HTML
const limpiarHTML = (selector) => {
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
};
const mostrarComidas = (meals) => {
    limpiarHTML(resultado);
    const headig = document.createElement("h2");
    headig.classList.add("text-center", "text-black", "my-5");
    headig.textContent = meals.length ? `${meals.length} Resultados` : "No hay Resultados";
    resultado.appendChild(headig);
    meals.forEach(m => {
        const { idMeal, strMeal, strMealThumb } = m;
        const recetaContenedor = document.createElement("div");
        recetaContenedor.classList.add("col-md-4");
        const card = document.createElement("div");
        card.classList.add("card", "mb-4");
        const cardImagen = document.createElement("img");
        cardImagen.classList.add("card-img-top");
        cardImagen.alt = `Imagen de la receta ${strMeal}`;
        cardImagen.src = strMealThumb;
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        const recetaHeading = document.createElement("h3");
        recetaHeading.classList.add("card-title", "mb-3");
        recetaHeading.textContent = strMeal;
        const recetaButton = document.createElement("button");
        recetaButton.classList.add("btn", "btn-danger", "w-100");
        recetaButton.textContent = "Ver Receta";
        recetaButton.onclick = function () {
            seleccionarReceta(idMeal);
        };
        // recetaButton.dataset.bsTarget = "#modal";
        // recetaButton.dataset.bsToggle = "modal";
        //Inyectar en HTML
        cardBody.appendChild(recetaHeading);
        cardBody.appendChild(recetaButton);
        card.appendChild(cardImagen);
        card.appendChild(cardBody);
        recetaContenedor.appendChild(card);
        resultado.appendChild(recetaContenedor);
    });
};
//INICIO DE APP
function iniciarApp() {
    obtenerCategorias();
    selectCategorias.addEventListener("change", seleccionarCategoria);
}
document.addEventListener("DOMContentLoaded", iniciarApp);
