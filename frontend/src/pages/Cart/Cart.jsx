import React, { useContext, useState } from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import {ToastContainer, toast } from 'react-toastify'

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount,discount,setDiscount ,url} = useContext(StoreContext);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  // const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    if (getTotalCartAmount() === 0) {
      setPromoError('Your cart is empty');
      return;
    }

    const promoCodes = {
      SAVE10: 10,
      FOODIE20: 20
    };

    if (promoCodes[code]) {
      setDiscount(promoCodes[code]);
      toast.success(`discount of ${promoCodes[code]} % applied successfully`);

      setPromoError('');
    } else {
      setDiscount(0);
      setPromoError('Invalid promo code');
      toast.error("Invalid promo code")
    }
  };

  const deliveryFee = getTotalCartAmount() === 0 ? 0 : 30;
  const total = getTotalCartAmount() + deliveryFee - (discount*0.01*getTotalCartAmount());

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list
          .filter(item => cartItems[item._id] > 0)
          .map(item => (
            <div key={item._id}>
              <div className='cart-items-title cart-items-item'>
                {item.image && (
                  <img src={url+"/images/"+item.image} alt={item.name || 'food-item'} />
                )}
                <p>{item.name}</p>
                <p>₹{item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>₹{item.price * cartItems[item._id]}</p>
                <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
              </div>
              <hr />
            </div>
          ))}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            {discount > 0 && (
              <>
                <div className="cart-total-details">
                  <p>Discount</p>
                  <p>- ₹{discount*0.01*getTotalCartAmount()}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{total > 0 ? total : 0}</b>
            </div>
          </div>
          <button 
            disabled={getTotalCartAmount() === 0}
            onClick={() => navigate('/order')}
            className={getTotalCartAmount() === 0 ? 'disabled' : ''}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input 
                type='text' 
                placeholder='promo-code'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handleApplyPromo}>Submit</button>
            </div>
            {promoError && <p style={{ color: 'red' }}>{promoError}</p>}
            {discount > 0 && <p style={{ color: 'green' }}>Promo applied: {discount}% off</p>}
          </div>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default Cart;
