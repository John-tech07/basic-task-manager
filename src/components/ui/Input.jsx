function Input({ className = "", ...props }) {
    const isDateTime = props.type === "datetime-local";
    return (
        <input
            className={`border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 py-3 min-h-[44px] rounded-lg w-full text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 transition ${
                isDateTime ? "px-2 sm:px-3" : "px-4"
            } ${className}`}
            {...props}
        />
    );
}

export default Input;
