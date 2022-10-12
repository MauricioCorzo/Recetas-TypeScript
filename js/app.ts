// import axios from "axios";
import { CategoryData } from "./interfaces";
import { ComidasDeCategoria , Comidas} from "./interfaces";

const selectCategorias = document.querySelector("#categorias") as HTMLSelectElement;
const resultado = document.querySelector("#resultado") as HTMLDivElement;


const obtenerCategorias = async () => {
    const url: string = "https://www.themealdb.com/api/json/v1/1/categories.php";
    
    const  data  = await fetch(url);
    const respuesta: CategoryData = await data.json();

    mostrarCategorias(respuesta);

};

const mostrarCategorias = ({categories}: CategoryData): void => {
    categories.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.strCategory;
        option.textContent = categoria.strCategory;
        // console.log(option);
        selectCategorias?.appendChild(option);
    });
};

const seleccionarCategoria = async (e:Event ) => {
    const categoriaValue = (e.target as HTMLSelectElement).value;
    
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoriaValue}`);
    const { meals }: ComidasDeCategoria = await data.json();
    mostrarComidas(meals);
};

//Limpia el HTML
const limpiarHTML = (selector: HTMLElement) => {
    while(selector.firstChild){
        selector.removeChild(selector.firstChild);
    }
};

const mostrarComidas = (meals: Comidas[]) => {

    limpiarHTML(resultado);

    const headig = document.createElement("h2") as HTMLHeadingElement;
    headig.classList.add("text-center", "text-black", "my-5");
    headig.textContent = meals.length? `${meals.length} Resultados` : "No hay Resultados";

    resultado.appendChild(headig);
    
    meals.forEach(m => {

        const { strMeal, strMealThumb } = m;

        const recetaContenedor = document.createElement("div") as HTMLDivElement;
        recetaContenedor.classList.add("col-md-4");

        const card = document.createElement("div") as HTMLDivElement;
        card.classList.add("card", "mb-4");

        const cardImagen = document.createElement("img") as HTMLImageElement;
        cardImagen.classList.add("card-img-top");
        cardImagen.alt = `Imagen de la receta ${strMeal}`;
        cardImagen.src = strMealThumb;

        const cardBody = document.createElement("div") as HTMLDivElement;
        cardBody.classList.add("card-body");

        const recetaHeading = document.createElement("h3") as HTMLHeadingElement;
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


function iniciarApp(){
    
    obtenerCategorias();
    
    selectCategorias.addEventListener("change", seleccionarCategoria);
}


document.addEventListener("DOMContentLoaded", iniciarApp);