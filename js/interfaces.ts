export interface CategoryData {
    categories: Category[]
  }
  
export interface Category {
    idCategory: string
    strCategory: string
    strCategoryThumb: string
    strCategoryDescription: string
}

export interface ComidasDeCategoria {
  meals: Comidas[]
}

export interface Comidas {
  strMeal: string
  strMealThumb: string
  idMeal: string
}