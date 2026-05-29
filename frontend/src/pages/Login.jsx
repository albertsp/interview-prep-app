import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldGroup} from "@/components/ui/field"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

function Login(){


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    let navigate = useNavigate()
    const { login } = useAuth()

    async function handleSubmit(e){
        e.preventDefault()
        const result = await fetchLogin(email,password)
        login(result.name,result.access_token)
        navigate("/session")
        
    }


    async function fetchLogin(email,password){

        const url = `${import.meta.env.VITE_API_URL}/auth/login`
        const data = {
            email: email,
            password: password
        };

        try {
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Si la response no es un 2XX, manejamos error
            if (!response.ok){
                const error = await response.json();
                throw new Error(error.message)
            }
            
            // Si sale bien, parseamos response
            const result = await response.json()
            console.log('Login exitoso:', result)
            return result


        } catch (error) {
            console.error(error.message)
            throw error;
            
        }

    }

    return(
        <form onSubmit={handleSubmit}>

            <FieldGroup>
            <Field>
                <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                    <Input
                    id="fieldgroup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange ={(e)=>setEmail(e.target.value)}
                    />
            </Field>

            <Field>
                <FieldLabel htmlFor="fieldgroup-password"> Password</FieldLabel>
                    <Input
                    id="fieldgroup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange ={(e)=>setPassword(e.target.value)}
                    />
            </Field>

            <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
            </Field>
            </FieldGroup>
        </form>
    )

}

export default Login