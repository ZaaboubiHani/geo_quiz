import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";

const Quizes = () => {
    const [createdQuizes, setCreatedQuizes] = useState([])
    useEffect(() => {
        let createdQuizes = JSON.parse(localStorage.getItem('createdQuizes'));
        if (createdQuizes) {
            setCreatedQuizes(createdQuizes)
        }
    }, [])

    return <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-500">
        <Link to='/quizes/world'
            className="bg-green-500 p-4 rounded-lg w-44 text-center m-4 
        hover:bg-green-600 
        hover:text-white 
        transition-all duration-200">
            World
        </Link>
        {
            createdQuizes.map((quiz) => (
                <div className="flex justify-between items-center  m-4">
                    <Link to={`/quizes/${quiz.name}`}
                        className="bg-green-500 p-4 rounded-lg w-44 text-center  
                hover:bg-green-600 
                hover:text-white 
                transition-all duration-200">
                        {quiz.name}
                    </Link>
                    <CiTrash className="text-2xl w-10 h-10 p-2 ml-2 rounded-full cursor-pointer
                     bg-white hover:text-white hover:bg-black transition-all duration-200" 
                     onClick={()=>{
                        let newCraetedQuizes = createdQuizes.filter((q)=>q.name !== quiz.name);
                        setCreatedQuizes(newCraetedQuizes);
                        localStorage.setItem('createdQuizes', JSON.stringify(newCraetedQuizes));
                     }}/>
                </div>
            ))
        }

    </div>
}

export default Quizes;