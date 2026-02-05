interface AccomplishmentModalProps {
    item: {
        image: string;
        title: string;
        date: string;
        description: string;
    };
    onClose: () => void;
}

export default function AccomplishmentModal({ item, onClose }: AccomplishmentModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
            className="bg-white w-full max-w-3xl rounded-lg max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
            >
            <img
                src={`/pice-backend/uploads/accomplishments/${item.image}`}
                className="w-full h-64 object-cover"
            />

            <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">
                {item.title}
                </h2>

                <div className="text-sm text-gray-500">
                {item.date}
                </div>

                <div className="whitespace-pre-line">
                {item.description}
                </div>

                <div className="flex justify-end pt-4">
                <button 
                    onClick={onClose} 
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
                >
                    Close
                </button>
                </div>
            </div>
            </div>
        </div>
    )
}
