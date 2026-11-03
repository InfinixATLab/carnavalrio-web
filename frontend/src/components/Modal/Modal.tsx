import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { FiX } from "react-icons/fi";

type ModalProps = { isOpen: boolean; onClose: () => void; modalTitle?: string; children: ReactNode; };

export default function Modal({ isOpen, onClose, modalTitle, children }: ModalProps) {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    useEffect(() => {
        const dialog = ref.current;
        if (isOpen && !dialog?.open) dialog?.showModal();
        else if (!isOpen && dialog?.open) dialog.close();
    }, [isOpen]);
    return (
        <dialog ref={ref} className="portal-dialog" aria-labelledby={modalTitle ? titleId : undefined} aria-label={modalTitle ? undefined : "Configurações"} onClose={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="dialog-heading od-row">
                {modalTitle && <h2 id={titleId}>{modalTitle}</h2>}
                <button type="button" className="icon-button" aria-label="Fechar" onClick={onClose}><FiX aria-hidden="true" /></button>
            </div>
            {children}
        </dialog>
    );
}
