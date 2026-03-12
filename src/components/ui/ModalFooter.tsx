import { Button } from './Button';

type ModalFooterVariant = 'primary' | 'danger';

interface ModalFooterProps {
    onClose: () => void;
    isLoading: boolean;
    submitLabel: string;
    submitVariant?: ModalFooterVariant;
    formAction?: boolean;
    onConfirm?: () => void;
}

export function ModalFooter({
    onClose,
    isLoading,
    submitLabel,
    submitVariant = 'primary',
    formAction = false,
    onConfirm,
}: ModalFooterProps) {
    return (
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
                type={formAction ? 'submit' : 'button'}
                variant={submitVariant}
                loading={isLoading}
                onClick={!formAction ? onConfirm : undefined}
            >
                {submitLabel}
            </Button>
        </div>
    );
}
