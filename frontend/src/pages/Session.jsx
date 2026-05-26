import StackSelector from "../components/StackSelector"

function Session(){
    return(
        <>
            <StackSelector onSubmit={(select)=>console.log(select)}></StackSelector>
        </>
        
    )
}

export default Session