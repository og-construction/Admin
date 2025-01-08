import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

export let showSuccessToast = (message) => {
    toast.success( <div className="flex items-center justify-center space-x-2">
        <FaSpinner className="animate-spin text-2xl text-white " /> {message}
      </div>,{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};


export let showErrorToast = (message) => {
    toast.error(  <div className="flex items-center justify-center space-x-2">
        <FaSpinner className="animate-spin text-2xl text-white" /> {message}
      </div>, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};