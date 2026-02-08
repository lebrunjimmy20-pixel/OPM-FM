import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    itemName?: string;
}

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName
}: DeleteConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.25)] border border-gray-100 p-8 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Decorative background element */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-60" />

                <div className="flex flex-col items-center text-center relative z-10">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-red-50 rounded-[24px] flex items-center justify-center mb-6 shadow-sm border border-red-100/50">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                        {title}
                    </h3>

                    <p className="text-gray-500 font-medium leading-relaxed mb-8 px-4">
                        {description}
                        {itemName && (
                            <span className="block mt-2 text-gray-900 font-bold bg-gray-50 py-2 px-4 rounded-xl border border-gray-100">
                                {itemName}
                            </span>
                        )}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 text-gray-700 font-black text-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-700 shadow-[0_12px_30px_-10px_rgba(220,38,38,0.5)] transition-all hover:shadow-[0_15px_35px_-12px_rgba(220,38,38,0.6)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            CONFIRM DELETE
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
