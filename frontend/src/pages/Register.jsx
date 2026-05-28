import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldGroup} from "@/components/ui/field"
import { useNavigate } from "react-router-dom"

function Register(){


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")


    let navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        await fetchRegister(email,password)
        // Añadir condicion register exitoso
        navigate("/login")
        
    }


    async function fetchRegister(email,password){

        const url = `${import.meta.env.VITE_API_URL}/auth/register`

        const data = {
            name: name,
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
            console.log('Register exitoso:', result)
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
                <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                    <Input
                    id="fieldgroup-name"
                    type="text"
                    placeholder="Introduce tu nombre"
                    value={name}
                    onChange ={(e)=>setName(e.target.value)}
                    />
            </Field>

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

export default Register