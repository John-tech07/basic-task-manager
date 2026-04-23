function Input(props) {
    return (
        <input
            className="border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 px-4 py-3 rounded-lg w-full text-slate-800 placeholder-slate-400 bg-slate-50 transition"
            {...props}
        />
    );
}

export default Input;
