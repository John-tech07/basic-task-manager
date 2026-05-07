import { TrashIcon, XIcon } from "lucide-react";
import Button from "../ui/Button";

function TaskDeleteConfirm({ onConfirm, onCancel }) {
    return (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 p-3 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium flex-1">Deletar esta tarefa?</p>
            <Button onClick={onCancel} aria-label="Cancelar exclusão">
                <XIcon size={16} />
            </Button>
            <Button
                onClick={onConfirm}
                className="!bg-red-500 hover:!bg-red-600 !text-white"
                aria-label="Confirmar exclusão"
            >
                <TrashIcon size={16} />
            </Button>
        </div>
    );
}

export default TaskDeleteConfirm;
