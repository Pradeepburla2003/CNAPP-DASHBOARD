import { createSlice, nanoid } from '@reduxjs/toolkit';
import seed from '../../data/dashboard.json';

const initialState = {
    title: seed.title,
    categories: seed.categories,
    widgets: seed.widgets,
    searchQuery: '',
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // Case 1: Create a new widget
        addWidgetToCategory(state, action) {
            const { categoryId, name, text } = action.payload;

            const newWidget = {
                id: nanoid(),
                name,
                text,
            };

            state.widgets.push(newWidget);

            const cat = state.categories.find(c => c.id === categoryId);
            if (cat) {
                cat.widgetIds.push(newWidget.id);
            }
        },

        // Case 2: Add an existing widget to a category (from toggle page)
        addExistingWidgetToCategory(state, action) {
            const { categoryId, widgetId } = action.payload;

            const cat = state.categories.find(c => c.id === categoryId);
            if (cat && !cat.widgetIds.includes(widgetId)) {
                cat.widgetIds.push(widgetId);
            }
        },

        removeWidgetFromCategory(state, action) {
            const { categoryId, widgetId } = action.payload;
            const cat = state.categories.find(c => c.id === categoryId);
            if (cat) {
                cat.widgetIds = cat.widgetIds.filter(id => id !== widgetId);
            }
        },
        deleteWidget(state, action) {
            const widgetId = action.payload;
            // Remove globally
            state.widgets = state.widgets.filter(w => w.id !== widgetId);
            // Remove from all categories
            state.categories.forEach(c => {
                c.widgetIds = c.widgetIds.filter(id => id !== widgetId);
            });
        },

        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
    },
});

export const {
    addWidgetToCategory,
    addExistingWidgetToCategory,
    removeWidgetFromCategory,
    setSearchQuery,
    deleteWidget
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
