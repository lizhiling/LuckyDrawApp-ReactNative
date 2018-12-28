import {STORE, STORE_TOKEN} from '../../constants/Constants'

export const LUCKY_DRAW = 'LUCKY_DRAW';
export const LUCKY_DRAW_SUCCESS = 'LUCKY_DRAW_SUCCESS';
export const LUCKY_DRAW_FAIL = 'LUCKY_DRAW_FAIL';
export const LIST_CARDS_SELLING = 'LIST_CARDS_SELLING';
export const LIST_CARDS_SELLING_SUCCESS = 'LIST_CARDS_SELLING_SUCCESS';
export const LIST_CARDS_SELLING_FAIL = 'LIST_CARDS_SELLING_FAIL';
export const BUY_CARD = 'BUY_CARD';
export const BUY_CARD_SUCCESS = 'BUY_CARD_SUCCESS';
export const BUY_CARD_FAIL = 'BUY_CARD_FAIL';
export const OPEN_CARD = 'OPEN_CARD';
export const CLOSE_CARD = 'CLOSE_CARD';


export const LUCKY_DRAW_MODAL = 'LUCKY_DRAW_MODAL';
export const LUCKY_DRAW_MODAL_SUCCESS = 'LUCKY_DRAW_MODAL_SUCCESS';
export const LUCKY_DRAW_MODAL_FAIL = 'LUCKY_DRAW_MODAL_FAIL';

const initialState = {
    shopCards: [],
    loading: true,
    error: false,
    message: null,
    userCards: [],
    needsRefresh: false,
    exchangeSuccess: false,
    exchanged: false,
    drawnCard: null,
    drawCardSuccess: true
};

export default function shopReducer(state = initialState, action) {
    if (action)
        console.log(action.type);
    switch (action.type) {
        case LIST_CARDS_SELLING:
            return {...state, loading: true};
        case LIST_CARDS_SELLING_SUCCESS:
            return {...state, loading: false, shopCards: action.payload.data.Items};

        case BUY_CARD:
            return {...state, loading: true};
        case LUCKY_DRAW:
            return {...state, loading: true};
        case LUCKY_DRAW_SUCCESS:
            // add new card to existed cards
            console.log(action.payload.data);
            if (action.payload.data.message !== "success"){
                return  {...state, drawCardSuccess: false, loading: false}
            }

            return {...state,
                userCards: state.userCards.concat(action.payload.data.card),
                drawnCard: action.payload.data.card,
                drawCardSuccess: true,
                loading: false
            };
        case BUY_CARD_SUCCESS:
            if (action.payload.data.message !== "success") {
                return {...state, exchangeSuccess: false, exchanged: true, loading: false}
            }
            return {...state,
                exchangeSuccess: true,
                exchanged: true,
                needsRefresh: true,
                loading: false
            };
        case OPEN_CARD:
            return {...state, exchanged: false};
        case LUCKY_DRAW_MODAL_SUCCESS:
            return {...state, loading: false};
        case CLOSE_CARD:
            return {...state, exchanged: false, exchangeSuccess: false, loading: false};
        case LUCKY_DRAW_FAIL:
        case LIST_CARDS_SELLING_FAIL:
        case BUY_CARD_FAIL:
        case LUCKY_DRAW_MODAL_FAIL:
            console.log(action);
            return {...state, loading: false};
        default:
            return state;
    }
}

export function openCard() {
    return {
        type: OPEN_CARD
    }
}
export function closeCard() {
    return {
        type: CLOSE_CARD
    }
}

export function luckyDrawClose() {
    return {
        type: LUCKY_DRAW_MODAL
    }
}

export function listCardsSelling() {
    return {
        type: LIST_CARDS_SELLING,
        payload: {
            request: {
                url: `https://qz3vwsx074.execute-api.ap-southeast-1.amazonaws.com/default/retrieveCards`,
                method: "post",
                data: {
                    "user": STORE,
                    "token": STORE_TOKEN
                }
            }
        }
    }
}

export function luckyDraw() {
    return {
        type: LUCKY_DRAW,
        payload: {
            request: {
                method: "post",
                url: `https://6znk17m66k.execute-api.ap-southeast-1.amazonaws.com/default/drawCard`,
                data: {
                    "user": global.USER,
                    "token": global.TOKEN
                },
            }
        }
    }
}

export function buyCard(cardsOutIds, cardInId) {
    return {
        type: BUY_CARD,
        payload: {
            request: {
                method: "post",
                url: `https://i8xzvrh9wf.execute-api.ap-southeast-1.amazonaws.com/default/exchangeCardWithStore`,
                data: {
                    "user": USER,
                    "token": TOKEN,
                    "cardsOut": cardsOutIds,
                    "cardIn": cardInId
                }
            }
        }
    }
}
