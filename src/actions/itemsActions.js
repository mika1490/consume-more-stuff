import Axios from 'axios';
const HOST = '/api/items'; 

export const LOAD_ITEMS = `LOAD_ITEMS`;
export const LOAD_SINGLE_ITEM = `LOAD_SINGLE_ITEM`;
export const EDIT_ITEM = `EDIT_ITEM`;
export const ADD_ITEM = `ADD_ITEM`;

export const loadItems = () => {
  return dispatch => {
    return Axios.get(HOST)
    .then(items => {
      dispatch({
        type: LOAD_ITEMS,
        items: items.data
      });
    })
  }
}

export const loadSingleItem = id => {
  return dispatch => {
    return Axios.get(`${HOST}/${id}`)
    .then(item => {
      dispatch({
        type: LOAD_SINGLE_ITEM,
        item: item.data
      })
    }) 
  }
}

export const addItem = (newItem, callback) => {
  return dispatch => {
    Axios.post(HOST, newItem)
    .then(newItemDetails => {
      if(newItemDetails.data && newItemDetails.data.id) {
         dispatch(loadItems());
         return newItemDetails.data.id
      }
    })
    .then(id => {
      callback(id);
    })
    .catch((err) => {
      console.log(err.response);
    });
  }
}

export const editItem = (updatedItem, callback) => {
  return dispatch => {
    return Axios.put(`${HOST}/${updatedItem.id}`, updatedItem)
    .then(updatedItemDetails => {
      dispatch(
        loadSingleItem(updatedItem.id)
      );
      dispatch(loadItems());
    })
    .then(() => {
      callback();
    })
    .catch((err) => {
      console.log(err.response);
    });
  };
};
