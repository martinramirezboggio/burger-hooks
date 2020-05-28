import React, {useState, useEffect, useCallback} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-orders';

import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions/index';

const burgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false);

  const dispatch = useDispatch(); // to replace connect.

  const onIngredientAdded = (ingredientName) => dispatch(actions.addIngredient(ingredientName));
  const onIngredientRemoved = (ingredientName) => dispatch(actions.removeIngredient(ingredientName));
  const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), []);
  const onIntPurchase = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

  const ings = useSelector(state => {
    return state.burgerBuilder.ingredients
  })

  const totalPrice = useSelector(state => {
    return state.burgerBuilder.totalPrice
  })

  const error = useSelector(state => {
    return state.burgerBuilder.error
  })

  const isAuthenticated = useSelector(state => {
    return state.auth.token !== null
  })

  useEffect(()=>{
    onInitIngredients();
  },[onInitIngredients])

  const updatePurchaseState  = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum,el)=>{
        return sum + el;
      }, 0);
   return sum > 0;
  }

  const purchaseHandler = () => {
    if(isAuthenticated){
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  }

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  }

  const purchaseContinueHandler = () => {
    onIntPurchase();
    props.history.push('/checkout');
  };

  const disabledInfo = {
    ...ings
  };
  let orderSummary = null;
  let burger = error?<p>Ingredients can't be loaded</p>:<Spinner/>;

  for(let key in disabledInfo){
    disabledInfo[key] = disabledInfo[key]<=0
  }

  if(ings){
    burger = (
      <Aux>
        <Burger ingredients={ings}/>
        <BuildControls
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientRemoved}
          disabled={disabledInfo}
          ordered={purchaseHandler}
          purchasable={updatePurchaseState(ings)}
          price={totalPrice}
          isAuth={isAuthenticated}
        />
      </Aux>
    );
    orderSummary = <OrderSummary
      price={totalPrice}
      purchaseCancelled={purchaseCancelHandler}
      purchaseContinued={purchaseContinueHandler}
      ingredients={ings}/>;
  }

  return(
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
}

// const mapStateToProps = state => {
//   return{
//     ings: state.burgerBuilder.ingredients,
//     totalPrice: state.burgerBuilder.totalPrice,
//     error: state.burgerBuilder.error,
//     isAuthenticated: state.auth.token !== null
//   }
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
//     onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
//     onInitIngredients: () => dispatch(actions.initIngredients()),
//     onIntPurchase: () => dispatch(actions.purchaseInit()),
//     onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
//   }
// }

export default withErrorHandler(burgerBuilder,axios);
