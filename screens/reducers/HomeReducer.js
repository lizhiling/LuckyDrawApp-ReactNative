export const USE_CARD = 'USE_CARD';
export const LIST_CARDS = 'LIST_CARDS';
export const LIST_CARDS_SUCCESS = 'LIST_CARDS_SUCCESS';
export const LIST_CARDS_FAIL = 'LIST_CARDS_FAIL';
export const USE_CARD_SUCCESS = 'USE_CARD_SUCCESS';
export const USE_CARD_FAIL = 'USE_CARD_FAIL';
export const CLOSE_PHOTO_OVERLAY = 'CLOSE_PHOTO_OVERLAY';

const initialState = {
    cards: [],
    error: false,
    message: null,
    loading: true,
    usedPhotoCard: false,
    gotNewPhoto: false
};

export default function homeReducer(state = initialState, action ) {
    switch (action.type) {
        case LIST_CARDS_SUCCESS:
            if (action.payload.data.errorMessage) {
                return {...state, error: true, message: action.payload.data.errorMessage};
            }
            return {...state, loading:false, cards: action.payload.data.Items};
        case USE_CARD:
        case LIST_CARDS:
            return {...state, loading: true};
        case USE_CARD_SUCCESS:
            if (action.payload.data.errorMessage) {
                console.log(action.payload.data);
                return {...state, error: true, message: action.payload.data.errorMessage};
            }
            console.log(action.payload.data);
            if (action.payload.data.photoData) {
                if (!!action.payload.data.photoData.existed) {
                    return {...state, loading: false, cards: action.payload.data.Items, gotNewPhoto: false, usedPhotoCard: true};
                } else {
                    return {...state, loading: false, cards: action.payload.data.Items, gotNewPhoto: true, usedPhotoCard: true};
                }
            }
            return {...state, loading: false, cards: action.payload.data.Items};
        case CLOSE_PHOTO_OVERLAY:
            return {...state,  usedPhotoCard: false, gotNewPhoto: false};
        case USE_CARD_FAIL:
        case LIST_CARDS_FAIL:
            console.log(action);
            return state;
        default:
            return state;
    }
}


export function retrieveCards() {
    return {
        type: LIST_CARDS,
        payload: {
            request: {
                url: `https://qz3vwsx074.execute-api.ap-southeast-1.amazonaws.com/default/retrieveCards`,
                method: "post",
                data: {
                    "user": global.USER,
                    "token": global.TOKEN
                }
            }
        }
    }
}

export function useCard(cardId) {
    return {
        type: USE_CARD,
        payload: {
            request: {
                url: `https://gxd6049ro9.execute-api.ap-southeast-1.amazonaws.com/default/UseCard`,
                method: "post",
                data: {
                    "user": global.USER,
                    "token": global.TOKEN,
                    "uuid": cardId
                }
            }
        }
    }
}

export function closePhotoOverlay() {
    return {
        type: CLOSE_PHOTO_OVERLAY
    }

}
