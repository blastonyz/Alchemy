import { useState } from "react"
import server from "./server"

export const CreateAccount = () => {
        const [account,setAccount] = useState({
            owner:"",
            balance:0
        })

        const onChange = (evt) => {
            const { name, value } = evt.target;
            setAccount({
                ...account,
                [name]: value
            });
        }    

        const handleSubmit = async (evt) => {
            evt.preventDefault();
            try {
                const response = await server.put('/create', account);
                console.log("Account created:", response.data);
              
            } catch (error) {
                console.error("Error creating account:", error);
               
            }
        };
      
        


    console.log("Rendering CreateAccount:", account);

        return(
           <form className="create-form" onSubmit={handleSubmit} method="PUT">
            <h2 >Create New Account</h2>
            <input type="text" name="owner" onChange={onChange} placeholder="you name" />
            <input type="number" name="balance"  onChange={onChange} placeholder="your deposit" />
            <button type="submit">Create Account</button>
           </form>
        )
}