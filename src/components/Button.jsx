function Button({ onClick, className = '', children, ...props }) {
    return (
        <button
            onClick={onClick}
            className={`bg-slate-400 p-2 rounded-md text-white ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button;
