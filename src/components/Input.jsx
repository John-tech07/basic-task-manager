function Input(props) {
    return (
        <input
            className="border border-slate-300 outline-slate-400 px-4 py-2 rounded-md" 
            type={props.type}
            placeholder={props.placeholder} 
            value={props.value}
            onChange={props.onChange}
        />

    )
}

export default Input;