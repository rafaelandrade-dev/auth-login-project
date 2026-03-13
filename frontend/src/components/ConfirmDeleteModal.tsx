import { AlertTriangle } from 'lucide-react';
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
        <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão" maxWidth="sm">
            <div className="space-y-5 py-2">
                {/* Alert icon */}
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 ring-4 ring-danger/10">
                        <AlertTriangle className="h-8 w-8 text-danger" />
                    </div>
                </div>

                {/* Text */}
                <div className="text-center space-y-1.5">
                    <p className="text-sm text-text-muted leading-relaxed">
                        Tem certeza que deseja excluir o usuário{' '}
                        <span className="font-bold text-text-primary">"{userName}"</span>?
                    </p>
                    <p className="text-xs text-danger/80 font-medium">
                        Esta ação não pode ser desfeita.
                    </p>
                </div>

                <ModalFooter
                    onClose={onClose}
                    isLoading={isLoading}
                    submitLabel="Excluir permanentemente"
                    submitVariant="danger"
                    onConfirm={onConfirm}
                />
            </div>
        </Modal>
    );
}
