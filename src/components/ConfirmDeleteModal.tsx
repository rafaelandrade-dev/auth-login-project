import { Modal } from './ui/Modal';
import { ModalFooter } from './ui/ModalFooter';

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
    isLoading,
}: ConfirmDeleteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão">
            <div className="space-y-2">
                <p className="text-sm text-gray-600">
                    Tem certeza que deseja excluir o usuário{' '}
                    <span className="font-semibold text-gray-900">{userName}</span>?
                </p>
                <p className="text-xs text-red-500 italic">Esta ação não pode ser desfeita.</p>
            </div>

            <ModalFooter
                onClose={onClose}
                isLoading={isLoading}
                submitLabel="Excluir"
                submitVariant="danger"
                onConfirm={onConfirm}
            />
        </Modal>
    );
}
