import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) {
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            closeBtnRef.current?.focus();
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
    }[maxWidth];

    return createPortal(
        <div
            className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={onClose}
        >
            <div
                className={`modal-panel relative w-full ${maxWidthClass} rounded-2xl bg-surface border border-border-subtle shadow-card overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
                    <h3
                        id="modal-title"
                        className="text-base font-semibold text-text-primary tracking-tight"
                    >
                        {title}
                    </h3>
                    <button
                        ref={closeBtnRef}
                        type="button"
                        className="rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
