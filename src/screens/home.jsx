import { Link } from "react-router-dom";

const Home = () => {
    return <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-500 ">
        <Link to='/quizes' 
        className="bg-green-500 p-4 rounded-lg w-44 text-center m-4 
        hover:bg-green-600 
        hover:text-white 
        transition-all duration-200">
            Quizes
        </Link>
        <Link to='/create'
         className="bg-green-500 p-4 rounded-lg w-44 text-center m-4 
         hover:bg-green-600 
         hover:text-white 
         transition-all duration-200">
            Create
        </Link>
    </div>
}

export default Home;