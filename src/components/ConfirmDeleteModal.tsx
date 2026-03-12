import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
    isLoading: boolean;
}

export function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    userName,
    isLoading
}: ConfirmDeleteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão">
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Tem certeza que deseja excluir o usuário <span className="font-semibold text-gray-900">{userName}</span>?
                </p>
                <p className="text-xs text-red-500 italic">
                    Esta ação não pode ser desfeita.
                </p>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        onClick={onConfirm}
                        loading={isLoading}
                    >
                        Excluir
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
