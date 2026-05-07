import { ClipboardX } from "lucide-react";

function EmptyState({ message }) {
    return (
        <div className="p-8 flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
            <ClipboardX size={40} />
            <p className="text-sm">{message}</p>
        </div>
    );
}

export default EmptyState;
