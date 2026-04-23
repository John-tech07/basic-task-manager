function Button({ onClick, className = '', children, ...props }) {
    return (
        <button
            onClick={onClick}
            className={`bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-lg transition-colors ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
