import { useState } from "react"
import { configSelect } from "../data/stacks"


function StackSelector({onSubmit}){

    const [select, setSelect] = useState({"rol": "", "stack": "", "level": ""})


    return(
        <>
            <section>
                <h3>1. Selecciona tu Rol</h3>
                {Object.keys(configSelect.rol).map(rol =>(
                    <button onClick={()=> setSelect({...select, "rol": rol})} key={rol}>{rol}</button>
                ))}
            </section>
            {
                select.rol && 
                <section>
                    {configSelect.rol[select.rol].map(stack =>(
                        <button onClick={()=>setSelect({...select, "stack": stack})} key={stack}>{stack}</button>
                    ))}
                </section>
            }
            {
                select.stack &&
                <section>
                    {configSelect.level.map(lvl =>(
                        <button onClick={()=> setSelect({...select, "level": lvl})} key={lvl}>{lvl}</button>
                    ))}
                </section>
            }
            {
                select.level && 
                <section>
                    <button onClick={() => onSubmit({...select})}>Empezar</button>
                </section>
            }
        </>
    )
}

export default StackSelector