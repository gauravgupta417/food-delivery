import { createContext, useContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";
import axios from "axios"

export const StoreContext= createContext(null)
const StoreContextProvider= (props)=>{

const [cartItems,setCartItems]=useState({});
const url = "https://cravings-cart.onrender.com";
  const [discount, setDiscount] = useState(0);
  const [token,setToken]=useState("");
const [food_list,setFoodList]=useState([]);

     const addToCart=async(itemId)=>{
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }
    const removeFromCart=async(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))

        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }
    
    // useEffect(()=>{
    // console.log(cartItems);
    // },[cartItems])
     const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo=food_list.find((product)=>product._id===item);
                // console.log(itemInfo.price);
                if(itemInfo)
                totalAmount+=itemInfo.price*cartItems[item];
                else console.log('item not fetched')
            }
        }
        return totalAmount;
    }
      const fetchFoodList=async()=>{
        // using get:-because food list api is created using get method.
        const response=await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }

     const loadCartData=async(token)=>{
        const response=await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }

      useEffect(()=>{
        try{
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }
    catch(err){
        console.log(err);
    }

    },[])

      const contextValue={
       food_list, // now we can access the food_list array anywhere.
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        discount,
        setDiscount,
        url,
        token,
        setToken
    }
    
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}
export default StoreContextProvider
