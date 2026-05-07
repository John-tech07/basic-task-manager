function Button({ onClick, className = '', children, ...props }) {
    return (
        <button
            onClick={onClick}
            className={`bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-lg transition-colors ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
