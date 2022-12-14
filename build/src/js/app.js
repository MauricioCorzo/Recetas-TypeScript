import { Modal, Toast } from "bootstrap";
import axios from "axios";
// SELECTORES
const selectCategorias = document.querySelector("#categorias");
const resultado = document.querySelector("#resultado");
const favoritosDiv = document.querySelector(".favoritos");
const modal = new Modal("#modal", {});
//FUNCIONES
const obtenerCategorias = async () => {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    const { data } = await axios(url);
    // const respuesta: CategoryData = await data.json();
    mostrarCategorias(data);
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
    const { data } = await axios(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoriaValue}`);
    // const { meals }: ComidasDeCategoria = await data.json();
    mostrarComidas(data.meals);
};
//Limpia el HTML
const limpiarHTML = (selector) => {
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
};
//Elimina en LocalStorage los Favoritos
const eliminarFavorito = (id) => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    const nuevosFavoritos = favoritos.filter(favorito => favorito.idMeal !== id);
    localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
};
//Consulta si existe un Favorito
const existeEnStorage = (id) => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? []; // Por si aun no hay anda en LocalStorage
    const existeReceta = favoritos.some(favorito => favorito.idMeal === id);
    return existeReceta;
};
const mostrarMensajeDeGuardado = (mensaje) => {
    const toastDiv = document.querySelector("#toast");
    const toastBody = document.querySelector(".toast-body");
    const nuevoToast = new Toast(toastDiv);
    toastBody.textContent = mensaje;
    nuevoToast.show();
};
//Almacena en LocalStorage los Favoritos
const agregarFavorito = (receta, btnFavorito) => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? []; // Por si aun no hay anda en LocalStorage
    if (!existeEnStorage(receta.idMeal)) {
        localStorage.setItem("favoritos", JSON.stringify([...favoritos, receta]));
        btnFavorito.textContent = "Eliminar Favorito";
        mostrarMensajeDeGuardado("Agregado Correctamente");
    }
    else {
        eliminarFavorito(receta.idMeal);
        btnFavorito.textContent = "Guardar Favorito";
        mostrarMensajeDeGuardado("Eliminado Correctamente");
        return;
    }
};
//Muestra las comidas seleccionadas
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
        recetaHeading.classList.add("card-title", "mb-3", "text");
        recetaHeading.textContent = strMeal;
        const recetaButton = document.createElement("button");
        recetaButton.classList.add("btn", "btn-danger", "w-100");
        recetaButton.textContent = "Ver Receta";
        recetaButton.onclick = () => seleccionarReceta(idMeal);
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
//Mustra Favoritos
const obtenerFavoritos = () => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    if (favoritos.length) {
        mostrarComidas(favoritos);
    }
    else {
        const noHayFavoritos = document.createElement("p");
        noHayFavoritos.classList.add("fs-4", "text-center", "font-bold", "mt-5");
        noHayFavoritos.textContent = "No Hay Favoritos Aun";
        favoritosDiv.appendChild(noHayFavoritos);
    }
};
//Boton de receta y activacion del modal
const seleccionarReceta = async (id) => {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const { data } = await axios(url);
    // const { meals } : ComidaIndividual = await data.json();
    const [meal] = data.meals;
    mostrarRecetaModal(meal);
};
const mostrarRecetaModal = (meal) => {
    const { idMeal, strInstructions, strMeal, strMealThumb } = meal;
    //A??adir Contenido al Modal
    const modalTitle = document.querySelector(".modal .modal-title");
    const modalBody = document.querySelector(".modal .modal-body");
    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `
        <img class="img-fluid" src=${strMealThumb} alt=receta ${strMeal}>
        <h3 class="my-3 text-center">Instrucciones</h3>
        <p>${strInstructions}</p>
        <h3 class="my-3 text-center">Ingredientes y Cantidades</h3>
    `;
    //Mostrar Cantidades e Ingredientes que no vienen vacios de la API
    const listaDeIngredientes = document.createElement("ul");
    listaDeIngredientes.classList.add("list-group");
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            const ingrediente = meal[`strIngredient${i}`];
            const cantidad = meal[`strMeasure${i}`];
            const ingredienteLi = document.createElement("li");
            ingredienteLi.classList.add("list-group-item");
            ingredienteLi.textContent = `Ingrediente: ${ingrediente} - cantidad: ${cantidad}`;
            listaDeIngredientes.appendChild(ingredienteLi);
        }
    }
    modalBody.appendChild(listaDeIngredientes);
    //Botones de cerrar y favorito
    const modalFooter = document.querySelector(".modal-footer");
    limpiarHTML(modalFooter);
    //Favorito
    const btnFavorito = document.createElement("btn");
    btnFavorito.classList.add("btn", "btn-danger", "col");
    btnFavorito.textContent = !existeEnStorage(idMeal) ? "Guardar Favorito" : "Eliminar Favorito";
    modalFooter.appendChild(btnFavorito);
    btnFavorito.onclick = () => agregarFavorito({ idMeal: idMeal, strMeal: strMeal, strMealThumb: strMealThumb }, btnFavorito);
    //Cerrar
    const btnCerrar = document.createElement("btn");
    btnCerrar.classList.add("btn", "btn-secondary", "col");
    btnCerrar.textContent = "Cerrar";
    btnCerrar.onclick = () => modal.hide();
    modalFooter.appendChild(btnCerrar);
    //Muestra el Modal
    modal.show();
};
//INICIO DE APP
function iniciarApp() {
    //Para que no genere errores en la pagina Favoritos porque no existe el elemento select
    if (selectCategorias) {
        selectCategorias.addEventListener("change", seleccionarCategoria);
        obtenerCategorias();
    }
    //Para la pagina de Favoritos
    if (favoritosDiv) {
        obtenerFavoritos();
    }
}
document.addEventListener("DOMContentLoaded", iniciarApp);
