import { api } from './client.js'

// Fetch all categories with tree structure
export async function fetchAllCategories() {
    return api.get('/categories')
}

// Fetch main categories only
export async function fetchMainCategories() {
    return api.get('/categories/main')
}

// Fetch subcategories for a specific main category
export async function fetchSubcategories(parentCategory) {
    return api.get(`/categories/subcategories/${parentCategory}`)
}

// Fetch a specific category by ID
export async function fetchCategory(id) {
    return api.get(`/categories/${id}`)
}

// Create a new category (admin only)
export async function createCategory(categoryData, token) {
    return api.post('/categories', categoryData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

// Update a category (admin only)
export async function updateCategory(id, categoryData, token) {
    return api.put(`/categories/${id}`, categoryData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

// Delete a category (admin only)
export async function deleteCategory(id, token) {
    return api.delete(`/categories/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

// Initialize categories (admin only)
export async function initializeCategories(token) {
    return api.post('/categories/initialize', {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

// Helper function to get category tree structure
export function buildCategoryTree(categories) {
    if (!categories || !categories.categoryTree) {
        return []
    }
    
    return categories.categoryTree.map(category => ({
        mainCategory: category.mainCategory,
        displayName: category.displayName,
        icon: category.icon,
        description: category.description,
        subcategories: category.subcategories || []
    }))
}

// Helper function to get all main category names
export function getMainCategoryNames(categories) {
    if (!categories || !categories.categoryTree) {
        return []
    }
    
    return categories.categoryTree.map(category => category.mainCategory)
}

// Helper function to get subcategories for a main category
export function getSubcategoriesForMain(categories, mainCategory) {
    if (!categories || !categories.categoryTree) {
        return []
    }
    
    const category = categories.categoryTree.find(cat => cat.mainCategory === mainCategory)
    return category ? category.subcategories : []
}
