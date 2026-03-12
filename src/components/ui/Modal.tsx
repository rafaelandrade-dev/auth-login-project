import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Mover o foco para o botão de fechar ao abrir para acessibilidade
            closeBtnRef.current?.focus();
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Fechar ao pressionar a tecla ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg transform rounded-2xl bg-white p-6 shadow-xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
                    <h3 id="modal-title" className="text-xl font-semibold leading-6 text-gray-900">
                        {title}
                    </h3>
                    <button
                        ref={closeBtnRef}
                        type="button"
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="mt-2">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
