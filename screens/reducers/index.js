import homeReducer from './HomeReducer'
import shopReducer from './ShopReducer'
import {combineReducers} from "redux";

export default combineReducers(
    {
        userData: homeReducer,
        shopData: shopReducer
    }
);
