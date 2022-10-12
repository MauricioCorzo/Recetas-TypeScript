const selectCategorias = document.querySelector("#categorias");
const resultado = document.querySelector("#resultado");
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
        const { strMeal, strMealThumb } = m;
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
        //Inyectar en HTML
        cardBody.appendChild(recetaHeading);
        cardBody.appendChild(recetaButton);
        card.appendChild(cardImagen);
        card.appendChild(cardBody);
        recetaContenedor.appendChild(card);
        resultado.appendChild(recetaContenedor);
    });
};
function iniciarApp() {
    obtenerCategorias();
    selectCategorias.addEventListener("change", seleccionarCategoria);
}
document.addEventListener("DOMContentLoaded", iniciarApp);
export {};
