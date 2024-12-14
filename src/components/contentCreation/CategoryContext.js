import React, { createContext, useState } from 'react';

const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
    const [categoryId, setCategoryId] = useState([]);
    const [categoryIdPost, setCategoryIdPost] = useState([]);
    const [activities, setActivities] = useState([]);
    const [pressedStates, setPressedStates] = useState({})
    const [pressedStatesPost, setPressedStatesPost] = useState({})

    const updateCategoryIdPost = (ids) => {
        setCategoryIdPost(ids);
    };

    const updatePressedStatesPost = (states) => {
        setPressedStatesPost(states);
    };
    
    const updateCategoryId = (ids) => {
        setCategoryId(ids);
    };

    const updatePressedStates = (states) => {
        setPressedStates(states);
    };
    const [saveEvent, setSaveEvent] = useState(() => () => {});
    const [savePost, setSavePost] = useState(() => () => {});

    return (
        <CategoryContext.Provider 
            value={{ 
                categoryId, setCategoryId, 
                saveEvent, setSaveEvent, 
                activities, setActivities, 
                savePost, setSavePost, 
                categoryIdPost, setCategoryIdPost,
                updateCategoryId, 
                pressedStates, setPressedStates,
                updatePressedStates,
                updateCategoryIdPost,
                pressedStatesPost, setPressedStatesPost,
                updatePressedStatesPost,
                }}>
            {children}
        </CategoryContext.Provider>
    )
};

export { CategoryContext, CategoryProvider };
